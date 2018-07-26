import React from 'react';
import { AccessibleGooglePlacesAutocomplete } from 'accessible-google-places-autocomplete';

function App() {
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
          countryCode="ca"
          googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        />
      </form>
    </div>
  );
}

export default App;
