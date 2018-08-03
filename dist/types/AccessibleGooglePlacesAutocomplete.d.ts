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
    googlePlacesApiKey: string;
    googlePlacesOptions?: IAccessibleGooglePlacesAutocompleteOptions;
    id: string;
    minLength?: number;
    t?: any;
}
interface IAccessibleGooglePlacesAutocompleteState {
    apiLoaded: boolean;
}
export declare class AccessibleGooglePlacesAutocomplete extends React.Component<IAccessibleGooglePlacesAutocompleteProps, IAccessibleGooglePlacesAutocompleteState> {
    private autocompleteService;
    private predictions;
    private currentStatusMessage;
    constructor(props: IAccessibleGooglePlacesAutocompleteProps);
    onConfirm: (value: string) => void;
    onApiLoad(): void;
    getNoResultsMessage(): string;
    getStatusSelectedOptionMessage(selectedOption: string): string;
    getStatusNoResultsMessage(): string;
    getStatusResultsMessage(length: number, contentSelectedOption: string): string;
    getSuggestions(query: string, populateResults: any): void;
    render(): JSX.Element;
}
export {};
