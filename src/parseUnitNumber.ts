export interface IParseUnitNumberResult {
  civicAddress: string;
  unitDesignator: string;
  unitNumber: string;
}

// Mapping of full unit designator string to preferred abbreviation. See
// https://pe.usps.com/text/pub28/28apc_003.htm#ep538629 for a list of
// supported unit number designators.
const normalizedDesignators = {
  '#': '',
  apartment: 'apt',
  building: 'bldg',
  department: 'dept',
  floor: 'fl',
  hanger: 'hngr',
  key: 'key',
  lot: 'lot',
  pier: 'pier',
  room: 'rm',
  slip: 'slip',
  space: 'spc',
  stop: 'stop',
  suite: 'ste',
  trailer: 'trlr',
  unit: 'unit'
};

// Combine designators and abbreviated designators into regex string.
const designators = Object.keys(normalizedDesignators)
  .reduce((accumulator, current) => {
    const value = normalizedDesignators[current];
    if (value !== '' && value !== current) {
      return [...accumulator, current, `${value}\\.?`];
    }
    return [...accumulator, current];
  }, [])
  .join('|');

// Matches Unit numbers that are all numbers, one letter, or numbers followed
// by 1 letter.
const unitNumberExp = '[0-9]+(?:[\\s-]?[a-z])?|[a-z]';

// Removes any trailing . characters and normalizes to the preferred designator
// abbreviation.
function normalizeDesignator(designator: string): string {
  const strippedDesignator = designator.replace(/\./, '').toLocaleLowerCase();

  return normalizedDesignators[strippedDesignator] !== undefined
    ? normalizedDesignators[strippedDesignator]
    : strippedDesignator;
}

// Removes and space or dash separators from unit and returns in upper-case.
function normalizeUnitNumber(unitNumber: string) {
  return unitNumber.replace(/[ -]/g, '').toUpperCase();
}

export function parseUnitNumber(query: string): IParseUnitNumberResult {
  // Match dashed address formats where the unit goes before the street number.
  const dashedMatches = /^[\s#]*([0-9]+(?:[\s-]?[a-z])?|[a-z])[\s-–\/]+([0-9]+\s.*)\s*$/i.exec(
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
  const dashedLetterMatches = /^\s*([0-9]+)[\s-–\/]*([a-z])\s(.*)\s*$/i.exec(
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
    `^\\s*([0-9]+)\\s+(${designators})\\s*(${unitNumberExp})([\\s,].*)$`,
    'i'
  );
  const afterNumberMatches = afterNumber.exec(query);
  if (afterNumberMatches !== null) {
    const unitDesignator = normalizeDesignator(afterNumberMatches[2]);
    const unitNumber = normalizeUnitNumber(afterNumberMatches[3]);

    return {
      civicAddress: `${afterNumberMatches[1].replace(
        /[\s,]*$/,
        ''
      )} ${afterNumberMatches[4].replace(/^[\s,]*/, '')}`,
      unitDesignator,
      unitNumber
    };
  }

  // Match unit number and designator after the street address.
  const afterStreet = new RegExp(
    `^\\s*([0-9]+.+)\\s(${designators})\\s*(${unitNumberExp})([\\s,].*|$)$`,
    'i'
  );
  const afterStreetMatches = afterStreet.exec(query);
  if (afterStreetMatches !== null) {
    const unitDesignator = normalizeDesignator(afterStreetMatches[2]);
    const unitNumber = normalizeUnitNumber(afterStreetMatches[3]);
    const civicAddressPart1 = afterStreetMatches[1].replace(/[\s,]*$/, '');
    const civicAddressPart2 = afterStreetMatches[4].replace(/^[\s,]*/, '');
    const civicAddress = civicAddressPart2
      ? `${civicAddressPart1}, ${civicAddressPart2}`
      : civicAddressPart1;

    return {
      civicAddress,
      unitDesignator,
      unitNumber
    };
  }

  // Match unit number and designator before the civic number.
  const beforeCivicNumber = new RegExp(
    `^\\s*(${designators})\\s*(${unitNumberExp})[-\\s,]+(.*)$`,
    'i'
  );
  const beforeCivicNumberMatches = beforeCivicNumber.exec(query);
  if (beforeCivicNumberMatches !== null) {
    const unitDesignator = normalizeDesignator(beforeCivicNumberMatches[1]);
    const unitNumber = normalizeUnitNumber(beforeCivicNumberMatches[2]);
    return {
      civicAddress: beforeCivicNumberMatches[3].replace(/^\s*/, ''),
      unitDesignator,
      unitNumber
    };
  }

  // No unit number was parsed in the given address.
  return {
    civicAddress: query,
    unitDesignator: '',
    unitNumber: ''
  };
}
