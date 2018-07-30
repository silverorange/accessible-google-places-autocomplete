import * as React from 'react';
import * as renderer from 'react-test-renderer';
import { AccessibleGooglePlacesAutocomplete } from './AccessibleGooglePlacesAutocomplete';

it('renders correctly', () => {
  const googlePlacesOptions = {
    componentRestrictions: { country: 'CA' },
    types: ['geocode']
  };

  const tree = renderer
    .create(
      <AccessibleGooglePlacesAutocomplete
        id="address_input"
        googlePlacesApiKey="123456"
        googlePlacesOptions={googlePlacesOptions}
      />
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});
