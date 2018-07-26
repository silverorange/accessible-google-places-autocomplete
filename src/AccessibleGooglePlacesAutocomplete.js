/* global google */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Script from 'react-load-script';
import Autocomplete from 'accessible-autocomplete/react';
import get from 'get-value';

function onConfirm() {
  console.log('confirmed address');
}

function translate(message, context) {
  const messages = {
    addressAutoComplete: {
      noResults: 'Address not found',
      statusNoResults: 'No matching addresses',
      statusSelectedOption: 'You’ve selected %{option}',
      statusResults:
        '%{smart_count} matching address is available |||| %{smart_count} matching addresses are available'
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
  return translation.replace(/%\{(.*?)\}/g, (match, contextKey) => {
    if (context[contextKey] === undefined) {
      return match;
    }
    if (typeof context[contextKey] === 'string') {
      return context[contextKey].replace(/\$/g, '$$');
    }
    return context[contextKey];
  });
}

export default class AccessibleGooglePlacesAutocomplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apiLoaded: false
    };

    this.service = null;
    this.currentStatusMessage = '';

    this.onApiLoad = this.onApiLoad.bind(this);
    this.getSuggestions = this.getSuggestions.bind(this);
    this.getNoResultsMessage = this.getNoResultsMessage.bind(this);
    this.getStatusSelectedOptionMessage = this.getStatusSelectedOptionMessage.bind(
      this
    );
    this.getStatusNoResultsMessage = this.getStatusNoResultsMessage.bind(this);
    this.getStatusResultsMessage = this.getStatusResultsMessage.bind(this);
  }

  onApiLoad() {
    this.setState(() => ({ apiLoaded: true }));
    this.service = new google.maps.places.AutocompleteService();
  }

  getNoResultsMessage() {
    const { t } = this.props;
    return t('addressAutoComplete.noResults');
  }

  getStatusSelectedOptionMessage(selectedOption) {
    const { t } = this.props;
    return t('addressAutoComplete.statusSelectedOption', {
      option: selectedOption
    });
  }

  getStatusNoResultsMessage() {
    const { t } = this.props;
    const statusNoResults = t('addressAutoComplete.statusNoResults');

    // don't repeat "No matching addresses" over and over
    if (this.currentStatusMessage === statusNoResults) {
      return '';
    }

    this.currentStatusMessage = statusNoResults;
    return statusNoResults;
  }

  getStatusResultsMessage(length, contentSelectedOption) {
    const { t } = this.props;

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
    const { googleMapsApiKey, id, minLength } = this.props;
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

AccessibleGooglePlacesAutocomplete.propTypes = {
  googleMapsApiKey: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  countryCode: PropTypes.string.isRequired,
  minLength: PropTypes.number,
  t: PropTypes.func
};

AccessibleGooglePlacesAutocomplete.defaultProps = {
  minLength: 4,
  t: translate
};
