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
    unitDesignators?: Record<string, string>;
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
    private formattedPredictionsMap;
    private hasPlaceSelected;
    private unitDesignator;
    private unitNumber;
    constructor(props: IAccessibleGooglePlacesAutocompleteProps);
    onAutoCompleteSelect: (value: string) => Promise<void>;
    onApiLoad(): void;
    getNoResultsMessage(): string;
    getStatusSelectedOptionMessage(selectedOption: string): string;
    getStatusNoResultsMessage(): string;
    getStatusResultsMessage(length: number, contentSelectedOption: string): string;
    getSuggestions(query: string, populateResults: any): void;
    render(): JSX.Element;
    private formatPrediction;
    private hasPartialPostalCode;
    private getPlaceDetails;
    private getReverseGeocodeData;
}
export declare const DEFAULT_UNIT_DESIGNATORS: {
    '#': string;
    apartment: string;
    building: string;
    department: string;
    floor: string;
    hanger: string;
    key: string;
    lot: string;
    pier: string;
    room: string;
    slip: string;
    space: string;
    stop: string;
    suite: string;
    trailer: string;
    unit: string;
};
export {};
