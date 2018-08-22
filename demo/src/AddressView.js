import React from 'react';
import PropTypes from 'prop-types';

function getAddressComponent(components, types, short) {
  return components
    .filter(component =>
      types.reduce(
        (result, type) => result || component.types.includes(type),
        false
      )
    )
    .map(component => (short ? component.short_name : component.long_name))
    .join(' ');
}

export default function AddressView(props) {
  const { address } = props;

  const streetNumber = getAddressComponent(address, ['street_number']);
  const streetName = getAddressComponent(address, ['route']);
  const city = getAddressComponent(address, ['locality']);
  const provState = getAddressComponent(
    address,
    ['administrative_area_1'],
    true
  );
  const country = getAddressComponent(address, ['country']);
  const postalCode = getAddressComponent(address, ['postal_code']);

  return (
    <div className="address">
      <div className="address__line1">
        {streetNumber} {streetName}
      </div>
      <div className="address__line2">
        {city} {provState}
        &nbsp;&nbsp;
        {postalCode}
      </div>
      <div className="address__line3">{country}</div>
    </div>
  );
}

AddressView.propsTypes = {
  address: PropTypes.arrayOf(
    PropTypes.shape({
      long_name: PropTypes.string.isRequired,
      short_name: PropTypes.string.isRequired,
      types: PropTypes.arrayOf(PropTypes.string).isRequired
    })
  ).isRequired
};
