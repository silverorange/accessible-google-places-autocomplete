export interface IParseUnitNumberResult {
  civicAddress: string;
  unitDesignator: string;
  unitNumber: string;
}

// Mapping of full unit designator string to preferred abbreviation.
const normalizedDesignators = {
  '#': '',
  apartment: 'apt',
  building: 'bldg',
  department: 'dept',
  floor: 'fl',
  room: 'rm',
  suite: 'ste',
  unit: 'unit'
};

// Combine designators and abbreviated designators into regex string.
const designators = Object.keys(normalizedDesignators)
  .reduce((accumulator, current) => {
    const value = normalizedDesignators[current];
    if (value !== '') {
      return [...accumulator, current, `${value}\\.?`];
    }
    return [...accumulator, current];
  }, [])
  .join('|');

// Removes any trailing . characters and normalizes to the preferred designator
// abbreviation.
function normalizeDesignator(designator: string): string {
  const strippedDesignator = designator.replace(/\./, '').toLocaleLowerCase();

  return normalizedDesignators[strippedDesignator] !== undefined
    ? normalizedDesignators[strippedDesignator]
    : strippedDesignator;
}

export function parseUnitNumber(query: string): IParseUnitNumberResult {
  // Match dashed address formats where the unit goes before the street number.
  const dashedMatches = /^[\s#]*([0-9]+|[a-z])[\s-–]+([0-9]+\s.*)\s*$/i.exec(
    query
  );
  if (dashedMatches !== null) {
    return {
      civicAddress: dashedMatches[2],
      unitDesignator: '',
      unitNumber: dashedMatches[1].toUpperCase()
    };
  }

  // Match dashed address formats where the unit is a letter after the street number.
  const dashedLetterMatches = /^\s*([0-9]+)[\s-–]*([a-z])\s(.*)\s*$/i.exec(
    query
  );
  if (dashedLetterMatches !== null) {
    return {
      civicAddress: `${dashedLetterMatches[1]} ${dashedLetterMatches[3]}`,
      unitDesignator: '',
      unitNumber: dashedLetterMatches[2].toUpperCase()
    };
  }

  // Match unit number and designator after the civic number and before the
  // street name. Needs to go before after-street case to prevent parsing civic
  // number as a full street address.
  const afterNumber = new RegExp(
    `^\\s*([0-9]+)\\s+(${designators})\\s*([0-9]+|[a-z])([\\s,].*)$`,
    'i'
  );
  const afterNumberMatches = afterNumber.exec(query);
  if (afterNumberMatches !== null) {
    const unitDesignator = normalizeDesignator(afterNumberMatches[2]);

    return {
      civicAddress: `${afterNumberMatches[1].replace(
        /[\s,]*$/,
        ''
      )} ${afterNumberMatches[4].replace(/^[\s,]*/, '')}`,
      unitDesignator,
      unitNumber: afterNumberMatches[3].toUpperCase()
    };
  }

  // Match unit number and designator after the street address.
  const afterStreet = new RegExp(
    `^\\s*([0-9]+.+)\\s(${designators})\\s*([0-9]+|[a-z])([\\s,].*|$)$`,
    'i'
  );
  const afterStreetMatches = afterStreet.exec(query);
  if (afterStreetMatches !== null) {
    const unitDesignator = normalizeDesignator(afterStreetMatches[2]);
    const civicAddressPart1 = afterStreetMatches[1].replace(/[\s,]*$/, '');
    const civicAddressPart2 = afterStreetMatches[4].replace(/^[\s,]*/, '');
    const civicAddress = civicAddressPart2
      ? `${civicAddressPart1}, ${civicAddressPart2}`
      : civicAddressPart1;

    return {
      civicAddress,
      unitDesignator,
      unitNumber: afterStreetMatches[3].toUpperCase()
    };
  }

  // Match unit number and designator before the civic number.
  const beforeCivicNumber = new RegExp(
    `^\\s*(${designators})\\s*([0-9]+|[a-z])[-\\s,]+(.*)$`,
    'i'
  );
  const beforeCivicNumberMatches = beforeCivicNumber.exec(query);
  if (beforeCivicNumberMatches !== null) {
    const unitDesignator = normalizeDesignator(beforeCivicNumberMatches[1]);

    return {
      civicAddress: beforeCivicNumberMatches[3].replace(/^\s*/, ''),
      unitDesignator,
      unitNumber: beforeCivicNumberMatches[2].toUpperCase()
    };
  }

  // No unit number was parsed in the given address.
  return {
    civicAddress: query,
    unitDesignator: '',
    unitNumber: ''
  };
}
