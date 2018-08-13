/// <reference types="googlemaps" />
import * as React from 'react';
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
export declare class AccessibleGooglePlacesAutocomplete extends React.Component<IAccessibleGooglePlacesAutocompleteProps, IAccessibleGooglePlacesAutocompleteState> {
    private geocoderService?;
    private autocompleteService?;
    private placesService?;
    private placesSessionToken;
    private predictions;
    private currentStatusMessage;
    private hasPlaceSelected;
    constructor(props: IAccessibleGooglePlacesAutocompleteProps);
    onAutoCompleteSelect: (value: string) => Promise<void>;
    onApiLoad(): void;
    getNoResultsMessage(): string;
    getStatusSelectedOptionMessage(selectedOption: string): string;
    getStatusNoResultsMessage(): string;
    getStatusResultsMessage(length: number, contentSelectedOption: string): string;
    getSuggestions(query: string, populateResults: any): void;
    render(): JSX.Element;
    private hasPartialPostalCode;
    private getPlaceDetails;
    private getReverseGeocodeData;
}
export {};
