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

  const room = getAddressComponent(address, ['room']);
  const floor = getAddressComponent(address, ['floor']);
  const unitNumber = getAddressComponent(address, ['unit_number']);
  const unitDesignator = getAddressComponent(address, ['unit_designator']);

  const subunit = room
    ? ` room ${room}`
    : floor
      ? ` floor ${floor}`
      : unitDesignator
        ? ` ${unitDesignator} ${unitNumber}`
        : '';

  const combinedNumber =
    !floor && !room && !unitDesignator && unitNumber
      ? `${unitNumber}-${streetNumber}`
      : streetNumber;

  return (
    <div className="address">
      <div className="address__line1">
        {combinedNumber}
        {subunit} {streetName}
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
