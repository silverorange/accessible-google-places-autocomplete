import * as React from 'react';
import { TLanguageCode } from './languageCodes';
interface IGoogleMapsApiLoaderProps {
    googlePlacesApiKey: string;
    language?: TLanguageCode;
    onLoad?: () => void;
    onUnload?: () => void;
}
interface IGoogleMapsApiLoaderState {
    apiLoaded: boolean;
}
export declare class GoogleMapsApiLoader extends React.Component<IGoogleMapsApiLoaderProps, IGoogleMapsApiLoaderState> {
    constructor(props: IGoogleMapsApiLoaderProps);
    onApiLoad(): void;
    componentDidUpdate(prevProps: IGoogleMapsApiLoaderProps): void;
    render(): JSX.Element;
    private getScriptUrl;
}
export {};
