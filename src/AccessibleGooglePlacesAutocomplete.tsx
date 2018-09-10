import * as React from 'react';
import * as Script from 'react-load-script';
import Autocomplete from 'accessible-autocomplete/react';
import { translate } from './translate';

interface IAccessibleGooglePlacesAutocompleteOptions {
  bounds?: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral;
  componentRestrictions?: google.maps.places.ComponentRestrictions;
  location?: google.maps.LatLng;
  offset?: number;
  radius?: number;
  types?: string[];
}

interface IAccessibleGooglePlacesAutocompleteProps {
  autoselect?: boolean;
  googlePlacesApiKey: string;
  googlePlacesOptions?: IAccessibleGooglePlacesAutocompleteOptions;
  id: string;
  minLength?: number;
  onClear?: () => void;
  onConfirm?: (placeResult: google.maps.places.PlaceResult) => void;
  onError?: (error: any) => void;
  required?: boolean;
  t?: any;
  useMoreAccuratePostalCode?: boolean;
}

interface IAccessibleGooglePlacesAutocompleteState {
  apiLoaded: boolean;
}

export class AccessibleGooglePlacesAutocomplete extends React.Component<
  IAccessibleGooglePlacesAutocompleteProps,
  IAccessibleGooglePlacesAutocompleteState
> {
  private geocoderService?: google.maps.Geocoder;
  private autocompleteService?: google.maps.places.AutocompleteService;
  private placesService?: google.maps.places.PlacesService;
  private predictions: google.maps.places.AutocompletePrediction[];
  private currentStatusMessage: string;
  private hasPlaceSelected: boolean;

  constructor(props: IAccessibleGooglePlacesAutocompleteProps) {
    super(props);

    this.state = {
      apiLoaded: false
    };

    this.predictions = [];
    this.currentStatusMessage = '';

    this.onApiLoad = this.onApiLoad.bind(this);
    this.getSuggestions = this.getSuggestions.bind(this);
    this.getNoResultsMessage = this.getNoResultsMessage.bind(this);
    this.getStatusResultsMessage = this.getStatusResultsMessage.bind(this);
    this.getStatusSelectedOptionMessage = this.getStatusSelectedOptionMessage.bind(
      this
    );
    this.getStatusNoResultsMessage = this.getStatusNoResultsMessage.bind(this);
  }

  public onAutoCompleteSelect = async (value: string) => {
    const {
      useMoreAccuratePostalCode = false,
      onError = () => null,
      onConfirm = () => null
    } = this.props;

    const selectedPrediction = this.predictions.find(
      prediction => prediction.description === value
    );

    if (selectedPrediction !== undefined) {
      try {
        const placeResult = await this.getPlaceDetails(selectedPrediction);

        if (
          this.hasPartialPostalCode(placeResult.address_components) &&
          useMoreAccuratePostalCode
        ) {
          const geocodeResult = await this.getReverseGeocodeData(placeResult);

          // Remove Google Places postal code that may be a partial code.
          placeResult.address_components = placeResult.address_components.filter(
            component => !component.types.includes('postal_code')
          );

          // Add reverse geocode postal code value.
          placeResult.address_components = placeResult.address_components.concat(
            geocodeResult.address_components.filter(component =>
              component.types.includes('postal_code')
            )
          );
        }

        this.hasPlaceSelected = true;

        onConfirm(placeResult);
      } catch (e) {
        onError(e);
      }
    }
  };

  public onApiLoad() {
    this.setState(() => ({ apiLoaded: true }));
    this.autocompleteService = new google.maps.places.AutocompleteService();
    this.geocoderService = new google.maps.Geocoder();
    this.placesService = new google.maps.places.PlacesService(
      document.createElement('div')
    );
  }

  public getNoResultsMessage(): string {
    const { t = translate } = this.props;
    return t('addressAutoComplete.noResults');
  }

  public getStatusSelectedOptionMessage(selectedOption: string): string {
    const { t = translate } = this.props;
    return t('addressAutoComplete.statusSelectedOption', {
      option: selectedOption
    });
  }

  public getStatusNoResultsMessage(): string {
    const { t = translate } = this.props;
    const statusNoResults = t('addressAutoComplete.statusNoResults');

    // don't repeat "No matching addresses" over and over
    if (this.currentStatusMessage === statusNoResults) {
      return '';
    }

    this.currentStatusMessage = statusNoResults;
    return statusNoResults;
  }

  public getStatusResultsMessage(
    length: number,
    contentSelectedOption: string
  ): string {
    const { t = translate } = this.props;

    if (contentSelectedOption) {
      return '';
    }

    const statusResults = t('addressAutoComplete.statusResults', {
      smart_count: length
    });

    // don't repeat "5 matching addresses" over and over
    if (this.currentStatusMessage === statusResults) {
      return '';
    }

    this.currentStatusMessage = statusResults;
    return statusResults;
  }

  public getSuggestions(query: string, populateResults: any): void {
    const { onClear = () => null } = this.props;

    if (this.hasPlaceSelected) {
      this.hasPlaceSelected = false;
      onClear();
    }

    Promise.all<google.maps.places.AutocompletePrediction[]>(
      this.getAddressVariants(query).map(this.getSuggestedPlaces.bind(this))
    ).then(suggestions => {
      const results: google.maps.places.AutocompletePrediction[] = [];

      const length = suggestions.reduce(
        (max: number, values: google.maps.places.AutocompletePrediction[]) =>
          values.length > max ? values.length : max,
        0
      );

      for (let i = 0; i < length; i++) {
        for (const values of suggestions) {
          if (values.length > i) {
            results.push(values[i]);
          }
        }
      }

      this.predictions = results;

      populateResults(results.map(result => result.description));
    });
  }

  public render() {
    const {
      autoselect = false,
      googlePlacesApiKey,
      id,
      minLength = 4,
      required = false
    } = this.props;
    const { apiLoaded } = this.state;
    const encodedKey = encodeURIComponent(googlePlacesApiKey);
    const googlePlacesApi = `https://maps.googleapis.com/maps/api/js?key=${encodedKey}&libraries=places`;

    if (apiLoaded) {
      return (
        <Autocomplete
          autoselect={autoselect}
          id={id}
          source={this.getSuggestions}
          minLength={minLength}
          required={required}
          displayMenu="overlay"
          tNoResults={this.getNoResultsMessage}
          tStatusSelectedOption={this.getStatusSelectedOptionMessage}
          tStatusNoResults={this.getStatusNoResultsMessage}
          tStatusResults={this.getStatusResultsMessage}
          onConfirm={this.onAutoCompleteSelect}
        />
      );
    }

    return <Script url={googlePlacesApi} onLoad={this.onApiLoad} />;
  }

  private getAddressVariants(query: string): string[] {
    //return ['2-36 grafton street', '36-2 grafton street'];
    return [query];
  }

  private getSuggestedPlaces(
    query: string
  ): Promise<google.maps.places.AutocompletePrediction[]> {
    const { googlePlacesOptions = {} } = this.props;

    const request: google.maps.places.AutocompletionRequest = {
      ...googlePlacesOptions,
      input: query
    };

    return new Promise((resolve, reject) => {
      const getPlaces = (
        predictions: google.maps.places.AutocompletePrediction[],
        status: google.maps.places.PlacesServiceStatus
      ) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
          resolve([]);
          return;
        }

        resolve(predictions);
      };

      if (this.autocompleteService) {
        this.autocompleteService.getPlacePredictions(request, getPlaces);
      } else {
        reject('Google Places autocomplete service is not available.');
      }
    });
  }

  private hasPartialPostalCode(
    addressComponents: google.maps.GeocoderAddressComponent[]
  ): boolean {
    return (
      addressComponents.find(component =>
        component.types.includes('postal_code_prefix')
      ) !== undefined
    );
  }

  private getPlaceDetails(
    prediction: google.maps.places.AutocompletePrediction
  ): Promise<google.maps.places.PlaceResult> {
    if (this.placesService === undefined) {
      return Promise.reject('Google places service is not available.');
    }

    return new Promise((resolve, reject) => {
      this.placesService!.getDetails(
        {
          placeId: prediction.place_id
        },
        (
          placeResult: google.maps.places.PlaceResult,
          requestStatus: google.maps.places.PlacesServiceStatus
        ) => {
          if (requestStatus === google.maps.places.PlacesServiceStatus.OK) {
            resolve(placeResult);
          } else {
            reject(requestStatus);
          }
        }
      );
    });
  }

  private getReverseGeocodeData(
    place: google.maps.places.PlaceResult
  ): Promise<google.maps.GeocoderResult> {
    if (this.geocoderService === undefined) {
      return Promise.reject('Google geocoding service is not available.');
    }

    return new Promise((resolve, reject) => {
      this.geocoderService!.geocode(
        {
          location: place.geometry.location
        },
        (
          geocodeResult: google.maps.GeocoderResult[],
          geocodeStatus: google.maps.GeocoderStatus
        ) => {
          if (geocodeStatus === google.maps.GeocoderStatus.OK) {
            // Find first reverse geocode address that matches the street
            // number, name, and city.
            const bestResult = geocodeResult.find(result => {
              // Match all the required fields for the reverse geocode address
              // and reduce field matches to a single boolean value.
              return ['street_number', 'route', 'locality']
                .map(fieldName => {
                  return (
                    place.address_components[fieldName] ===
                    result.address_components[fieldName]
                  );
                })
                .reduce((isAddressMatch, isFieldMatch) => {
                  return isAddressMatch && isFieldMatch;
                }, true);
            });

            resolve(bestResult === undefined ? geocodeResult[0] : bestResult);
          } else {
            reject(geocodeStatus);
          }
        }
      );
    });
  }
}
