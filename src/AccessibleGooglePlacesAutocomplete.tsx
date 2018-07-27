declare var google: any;

import * as React from 'react';
import Script from 'react-load-script';
import Autocomplete from 'accessible-autocomplete/react';
import * as get from 'get-value';

function onConfirm() {
  // console.log('confirmed address');
}

function translate(message: string, context: any): string {
  const messages = {
    addressAutoComplete: {
      noResults: 'Address not found',
      statusNoResults: 'No matching addresses',
      statusResults:
        '%{smart_count} matching address is available |||| %{smart_count} matching addresses are available',
      statusSelectedOption: 'You’ve selected %{option}'
    }
  };

  let translation = get(messages, message);

  if (!context) {
    return translation;
  }

  if (!translation) {
    return message;
  }

  // Support English plurals. More complex requirements should use an external
  // i18n library like Polyglot.
  if (context.smart_count !== undefined) {
    const pluralForms = translation.split('||||');
    const pluralIndex = context.smart_count === 1 ? 0 : 1;
    translation = pluralForms[pluralIndex].trim();
  }

  // Interpolate results.
  return translation.replace(
    /%\{(.*?)\}/g,
    (match: string, contextKey: string): string => {
      if (context[contextKey] === undefined) {
        return match;
      }
      if (typeof context[contextKey] === 'string') {
        return context[contextKey].replace(/\$/g, '$$');
      }
      return context[contextKey];
    }
  );
}

interface IAccessibleGooglePlacesAutocompleteProps {
  googleMapsApiKey: string;
  googleMapsOptions: any;
  id: string;
  minLength?: number;
  t?: any;
}

interface IAccessibleGooglePlacesAutocompleteState {
  apiLoaded: boolean;
}

interface IPredictionSubstring {
  length: number;
  offset: number;
}

interface IPredictionTerm {
  offset: number;
  value: string;
}

interface IStructuredFormatting {
  main_text: string;
  main_text_matched_substrings: IPredictionSubstring[];
  secondary_text: string;
}

interface IAutocompletePrediction {
  description: string;
  matched_substrings: IPredictionSubstring[];
  place_id: string;
  structured_formatting: IStructuredFormatting;
  terms: IPredictionTerm[];
  types: string[];
}

export class AccessibleGooglePlacesAutocomplete extends React.Component<
  IAccessibleGooglePlacesAutocompleteProps,
  IAccessibleGooglePlacesAutocompleteState
> {
  private service: any;
  private currentStatusMessage: string;

  constructor(props: IAccessibleGooglePlacesAutocompleteProps) {
    super(props);

    this.state = {
      apiLoaded: false
    };

    this.service = null;
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

  public onApiLoad() {
    this.setState(() => ({ apiLoaded: true }));
    this.service = new google.maps.places.AutocompleteService();
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
    const { googleMapsOptions } = this.props;

    const request = googleMapsOptions;
    request.input = query;

    function getPlaces(predictions: IAutocompletePrediction[], status: string) {
      if (status !== google.maps.places.PlacesServiceStatus.OK) {
        populateResults([]);
        return;
      }

      const results = predictions.map(prediction => prediction.description);
      populateResults(results);
    }

    this.service.getPlacePredictions(request, getPlaces);
  }

  public render() {
    const { googleMapsApiKey, id, minLength = 4 } = this.props;
    const { apiLoaded } = this.state;
    const encodedKey = encodeURIComponent(googleMapsApiKey);
    const googleMapsApi = `https://maps.googleapis.com/maps/api/js?key=${encodedKey}&libraries=places`;

    if (apiLoaded) {
      return (
        <Autocomplete
          id={id}
          source={this.getSuggestions}
          minLength={minLength}
          required
          displayMenu="overlay"
          tNoResults={this.getNoResultsMessage}
          tStatusSelectedOption={this.getStatusSelectedOptionMessage}
          tStatusNoResults={this.getStatusNoResultsMessage}
          tStatusResults={this.getStatusResultsMessage}
          onConfirm={onConfirm}
        />
      );
    }

    return <Script url={googleMapsApi} onLoad={this.onApiLoad} />;
  }
}
