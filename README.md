# More Accessible Google Places Auto-Complete Widget for React

## About

Google's Places Auto-Complete widget is extremely popular for finding addresses, but its default implementation is a simple input box that isn't accessible for people using screen-readers or other assistive devices. This leverages the [Accessible autocomplete](https://github.com/alphagov/accessible-autocomplete) by the UK Government Digital Service and applies it to the Google Places API to make address selection accessible to all. The Accessible Autocomplete follows the [WAI-ARIA](https://www.w3.org/WAI/standards-guidelines/aria/) best practices and is compatible with many assistive technologies.

## Installation / usage

[Get a Google Places API key](https://developers.google.com/places/web-service/get-api-key) from Google.

Install it by running:

```
npm install --save more-accessible-google-places-autocomplete
```

In your React application, you can import a bundle that will use it:

```
import React from 'react'
import ReactDom from 'react'
import AddressAutoComplete from './AddressAutoComplete';

ReactDOM.render(
	<label for="address_input">Enter your address</label>
	<AddressAutoComplete id="address_input" googleMapsApiKey="api-key-goes-here" />,
	document.querySelector('#container')
);
```

## License

[MIT](LICENSE.txt).
