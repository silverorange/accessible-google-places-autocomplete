/* global google */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Script from 'react-load-script';
import Autocomplete from 'accessible-autocomplete/react';

function onConfirm() {
  console.log('confirmed address');
}

export default class AddressAutoComplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apiLoaded: false
    };

    this.service = null;

    this.onApiLoad = this.onApiLoad.bind(this);
    this.getSuggestions = this.getSuggestions.bind(this);
  }

  onApiLoad() {
    this.setState(() => ({ apiLoaded: true }));
    this.service = new google.maps.places.AutocompleteService();
  }

  getSuggestions(query, populateResults) {
    const { countryCode } = this.props;

    const request = {
      input: query,
      types: ['geocode'],
      componentRestrictions: { country: countryCode }
    };

    function getPlaces(predictions, status) {
      if (status !== google.maps.places.PlacesServiceStatus.OK) {
        populateResults([]);
        return;
      }

      const results = predictions.map(prediction => prediction.description);
      populateResults(results);
    }

    this.service.getPlacePredictions(request, getPlaces);
  }

  render() {
    const { googleMapsApiKey, id } = this.props;
    const { apiLoaded } = this.state;
    const encodedKey = encodeURIComponent(googleMapsApiKey);
    const googleMapsApi = `https://maps.googleapis.com/maps/api/js?key=${encodedKey}&libraries=places`;
    if (apiLoaded) {
      return (
        <Autocomplete
          id={id}
          source={this.getSuggestions}
          minLength={4}
          required
          displayMenu="overlay"
          onConfirm={onConfirm}
        />
      );
    }
    return <Script url={googleMapsApi} onLoad={this.onApiLoad} />;
  }
}

AddressAutoComplete.propTypes = {
  googleMapsApiKey: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  countryCode: PropTypes.string.isRequired
};
