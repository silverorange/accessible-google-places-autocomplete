import * as React from 'react';
interface IAccessibleGooglePlacesAutocompleteProps {
    countryCode: string;
    googleMapsApiKey: string;
    id: string;
    minLength?: number;
    t?: any;
}
interface IAccessibleGooglePlacesAutocompleteState {
    apiLoaded: boolean;
}
export declare class AccessibleGooglePlacesAutocomplete extends React.Component<IAccessibleGooglePlacesAutocompleteProps, IAccessibleGooglePlacesAutocompleteState> {
    private service;
    private currentStatusMessage;
    constructor(props: IAccessibleGooglePlacesAutocompleteProps);
    onApiLoad(): void;
    getNoResultsMessage(): string;
    getStatusSelectedOptionMessage(selectedOption: string): string;
    getStatusNoResultsMessage(): string;
    getStatusResultsMessage(length: number, contentSelectedOption: string): string;
    getSuggestions(query: string, populateResults: any): void;
    render(): JSX.Element;
}
export {};
