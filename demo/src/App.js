import React, { Component } from 'react';
import {
  AccessibleGooglePlacesAutocomplete,
  DEFAULT_UNIT_DESIGNATORS
} from 'accessible-google-places-autocomplete';
import AddressView from './AddressView';

const googlePlacesOptions = {
  componentRestrictions: { country: 'CA' },
  types: ['geocode']
};

const unitDesignators = {
  ...DEFAULT_UNIT_DESIGNATORS,
  Appartement: 'app',
  bureau: 'bureau',
  unité: 'unité'
};

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: [],
      language: 'en'
    };
  }

  onSetLanguage = e => {
    const language = e.target.value;
    this.setState(_ => ({
      language
    }));
  };

  onConfirm = place => {
    this.setState(_ => ({
      address: place.address_components
    }));
  };

  onClear = () => {
    this.setState(_ => ({
      address: []
    }));
  };

  render() {
    const { address, language } = this.state;
    return (
      <div className="App">
        <form>
          <div>
            <label>
              <input
                type="radio"
                name="language"
                onChange={this.onSetLanguage}
                value="en"
                checked={language === 'en'}
              />{' '}
              English
            </label>
            <label>
              <input
                type="radio"
                name="language"
                onChange={this.onSetLanguage}
                value="fr"
                checked={language === 'fr'}
              />{' '}
              French
            </label>
          </div>
          <label htmlFor="address_input" aria-describedby="address_note">
            What is your mailing address?
          </label>
          <div id="address_note" style={{ display: 'none' }}>
            This is an automatic address auto-complete. Use arrow keys to choose
            options.
          </div>
          <AccessibleGooglePlacesAutocomplete
            id="address_input"
            googlePlacesApiKey={process.env.REACT_APP_GOOGLE_PLACES_API_KEY}
            googlePlacesOptions={googlePlacesOptions}
            language={language}
            onConfirm={this.onConfirm}
            onClear={this.onClear}
            unitDesignators={unitDesignators}
            useMoreAccuratePostalCode
          />
        </form>
        <AddressView address={address} />
      </div>
    );
  }
}
