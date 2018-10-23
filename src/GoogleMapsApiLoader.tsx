import * as React from 'react';
import * as Script from 'react-load-script';
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

const SCRIPT_ID = 'google-maps-script';

export class GoogleMapsApiLoader extends React.Component<
  IGoogleMapsApiLoaderProps,
  IGoogleMapsApiLoaderState
> {
  constructor(props: IGoogleMapsApiLoaderProps) {
    super(props);

    this.state = {
      apiLoaded: false
    };

    this.onApiLoad = this.onApiLoad.bind(this);
  }

  public onApiLoad() {
    const { onLoad } = this.props;
    this.setState(() => ({ apiLoaded: true }));

    if (onLoad) {
      onLoad();
    }
  }

  public componentDidUpdate(prevProps: IGoogleMapsApiLoaderProps) {
    const { language, onUnload } = this.props;
    if (language !== prevProps.language) {
      // Unload current Google Maps API
      const script = document.getElementById(SCRIPT_ID);
      if (script instanceof HTMLElement && script.parentNode) {
        const googlePlacesApi = this.getScriptUrl();
        script.parentNode.removeChild(script);

        delete google.maps;

        delete Script.loadedScripts[googlePlacesApi];
        delete Script.erroredScripts[googlePlacesApi];
        delete Script.scriptObservers[googlePlacesApi];

        this.setState(() => ({
          apiLoaded: false
        }));

        if (onUnload) {
          onUnload();
        }
      }
    }
  }

  public render() {
    const { apiLoaded } = this.state;

    const googlePlacesApi = this.getScriptUrl();

    return (
      <React.Fragment>
        {!apiLoaded && (
          <Script
            url={googlePlacesApi}
            onLoad={this.onApiLoad}
            attributes={{ id: SCRIPT_ID }}
          />
        )}
      </React.Fragment>
    );
  }

  private getScriptUrl(): string {
    const { googlePlacesApiKey } = this.props;

    const encodedKey = encodeURIComponent(googlePlacesApiKey);
    return this.props.language
      ? `https://maps.googleapis.com/maps/api/js?key=${encodedKey}&libraries=places&language=${
          this.props.language
        }`
      : `https://maps.googleapis.com/maps/api/js?key=${encodedKey}&libraries=places`;
  }
}
