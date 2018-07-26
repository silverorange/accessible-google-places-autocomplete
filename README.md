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
import { AccessibleGooglePlacesAutocomplete } from 'accessible-google-places-autocomplete';

ReactDOM.render(
  <div>
    <label for="address_input">Enter your address</label>
    <AccessibleGooglePlacesAutocomplete
      id="address_input"
      googleMapsApiKey="api-key-goes-here"
    />
  </div>,
  document.querySelector('#container')
);
```

## Building

The component is distributed as ES5 code in the `dist/` folder. To build the
ES5 code from the `src/` folder Webpack is used.

1.  make your changes in `src/`
2.  run `yarn build`
3.  commit, tag, and publish new release.

## Testing

There is a demo application provided in the repo you can use to test out
the component.

1.  `cd demo/`
2.  copy `.env.example` to `.env` and add your Google Places key.
3.  `yarn install`
4.  `yarn start`

## License

[MIT](LICENSE)
