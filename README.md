# Accessible Google Places Autocomplete Widget for React

## About

Google's Places autocomplete widget is extremely popular for finding
addresses, but its default implementation is a simple input box that
isn't accessible for people using screen-readers or other assistive
devices. This leverages the
[Accessible Autocomplete](https://github.com/alphagov/accessible-autocomplete)
by the UK Government Digital Service and applies it to the Google Places API
to make address selection accessible to all. The Accessible Autocomplete
follows the [WAI-ARIA](https://www.w3.org/WAI/standards-guidelines/aria/) best
practices and is compatible with many assistive technologies.

## Installation / usage

[Get a Google Places API key](https://developers.google.com/places/web-service/get-api-key)
from Google.

Add the component to your project by running:

```
yarn add accessible-google-places-autocomplete
```

In your React application, you can import and use the component in your JSX:

```js
import React from 'react';
import ReactDom from 'react';
import AddressAutoComplete from 'accessible-google-places-autocomplete';

ReactDOM.render(
  <div>
    <label for="address_input">Enter your address</label>
    <AddressAutoComplete id="address_input" googleMapsApiKey="api-key-goes-here" />
  </div>,
  document.querySelector('#container'),
);
```

## License

[MIT](LICENSE)
