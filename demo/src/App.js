import React from 'react';
import { AccessibleGooglePlacesAutocomplete } from 'accessible-google-places-autocomplete';

function App() {
  document.title = 'Accessible Google Places Address Autocomplete';

  function onConfirm(place) {
    console.log(place);
  }

  const googlePlacesOptions = {
    componentRestrictions: { country: 'CA' },
    types: ['geocode']
  };

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
          onConfirm={onConfirm}
        />
      </form>
    </div>
  );
}

export default App;
