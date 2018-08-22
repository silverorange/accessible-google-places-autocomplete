import React, { Component } from 'react';
import { AccessibleGooglePlacesAutocomplete } from 'accessible-google-places-autocomplete';
import AddressView from './AddressView';

const googlePlacesOptions = {
  componentRestrictions: { country: 'CA' },
  types: ['geocode']
};

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: []
    };
  }

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
    const { address } = this.state;
    return (
      <div className="App">
        <form>
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
            onConfirm={this.onConfirm}
            onClear={this.onClear}
            useMoreAccuratePostalCode
          />
        </form>
        <AddressView address={address} />
      </div>
    );
  }
}
