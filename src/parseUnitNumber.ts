export interface IParseUnitNumberResult {
  civicAddress: string;
  unitDesignator: string;
  unitNumber: string;
}

// Mapping of full unit designator string to preferred abbreviation. See
// https://pe.usps.com/text/pub28/28apc_003.htm#ep538629 for a list of
// supported unit number designators.
export const DEFAULT_DESIGNATORS = {
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

function buildDesignatorExpression(unitDesignators: Record<string, string>) {
  return Object.keys(unitDesignators)
    .reduce((accumulator, current) => {
      const value = unitDesignators[current];
      if (value !== '' && value !== current) {
        return [...accumulator, current, `${value}\\.?`];
      }
      return [...accumulator, current];
    }, [])
    .join('|');
}

// Matches Unit numbers that are one letter, unicode fractions, or full
// fractions.
const unitLetterOrFractionExp = '[a-z¼½¾]|(?:1/4|1/2|3/4)';

// Matches Unit numbers that are all numbers, one letter, or numbers followed
// by 1 letter, unicode fractions, or full fractions. Letter or fractional
// suffixes may be separated with space or dash. Full fraction form may be
// separated only by space. Note that fractional units or standalone letters
// are intentionally matched first.
const unitNumberExp = `${unitLetterOrFractionExp}|\\d+(?:[\\s-]?[a-z¼½¾]|\\s?(?:1/4|1/2|3/4))?`;

// Removes and space or dash separators from unit and returns in upper-case.
// Converts vulgar fraction characters to ASCII.
function normalizeUnitNumber(unitNumber: string): string {
  return unitNumber
    .replace(/-/g, ' ') // replace dashes with spaces
    .replace(/\s+([a-z])/gi, '$1') // remove spaces before letters
    .replace(/¼/g, ' 1/4')
    .replace(/½/g, ' 1/2')
    .replace(/¾/g, ' 3/4')
    .replace(/^\s+/g, '') // strip leading spaces
    .toLocaleUpperCase();
}

// Removes any trailing . characters and normalizes to the preferred designator
// abbreviation.
function normalizeDesignator(
  unitDesignators: Record<string, string>,
  designator: string
): string {
  const strippedDesignator = designator.replace(/\./, '').toLocaleLowerCase();

  return unitDesignators[strippedDesignator] !== undefined
    ? unitDesignators[strippedDesignator]
    : strippedDesignator;
}

export function parseUnitNumber(
  query: string,
  unitDesignators: Record<string, string> = DEFAULT_DESIGNATORS
): IParseUnitNumberResult {
  // Combine designators and abbreviated designators into regex string.
  const designators = buildDesignatorExpression(unitDesignators);

  // Match dashed address formats where the unit goes before the street number.
  const dashedExp = new RegExp(
    `^[\\s#]*(${unitNumberExp})[\\s-–\\/]+([0-9]+\\s.*)\\s*$`,
    'i'
  );

  const dashedMatches = dashedExp.exec(query);
  if (dashedMatches !== null) {
    const unitNumber = normalizeUnitNumber(dashedMatches[1]);
    return {
      civicAddress: dashedMatches[2],
      unitDesignator: '',
      unitNumber
    };
  }

  // Match dashed address formats where the unit is a letter or fraction after
  // the street number.
  const dashedLetterExp = new RegExp(
    `^\\s*(\\d+)[\\s-–\\/]*(${unitLetterOrFractionExp})\\s(\\D.*)?\\s*$`,
    'i'
  );
  const dashedLetterMatches = dashedLetterExp.exec(query);
  if (dashedLetterMatches !== null) {
    const unitNumber = normalizeUnitNumber(dashedLetterMatches[2]);
    return {
      civicAddress: `${dashedLetterMatches[1]} ${dashedLetterMatches[3]}`,
      unitDesignator: '',
      unitNumber
    };
  }

  // Match unit number and designator after the civic number and before the
  // street name. Needs to go before after-street case to prevent parsing civic
  // number as a full street address.
  const afterNumber = new RegExp(
    `^\\s*(\\d+)\\s+(${designators})\\s*(${unitNumberExp})([\\s,].*)$`,
    'i'
  );
  const afterNumberMatches = afterNumber.exec(query);
  if (afterNumberMatches !== null) {
    const unitDesignator = normalizeDesignator(
      unitDesignators,
      afterNumberMatches[2]
    );
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
    `^\\s*(\\d+.+)\\s(${designators})\\s*(${unitNumberExp})([\\s,].*|$)$`,
    'i'
  );
  const afterStreetMatches = afterStreet.exec(query);
  if (afterStreetMatches !== null) {
    const unitDesignator = normalizeDesignator(
      unitDesignators,
      afterStreetMatches[2]
    );
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
    const unitDesignator = normalizeDesignator(
      unitDesignators,
      beforeCivicNumberMatches[1]
    );
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
