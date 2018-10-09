export interface IParseUnitNumberResult {
  civicAddress: string;
  unitDesignator: string;
  unitNumber: string;
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
      unitNumber: dashedMatches[1]
    };
  }

  // Match dashed address formats where the unit is a letter after the street number.
  const dashedLetterMatches = /^([0-9]+)[\s-–]*([a-z])\s(.*)\s*$/i.exec(query);
  if (dashedLetterMatches !== null) {
    return {
      civicAddress: `${dashedLetterMatches[1]} ${dashedLetterMatches[3]}`,
      unitDesignator: '',
      unitNumber: dashedLetterMatches[2]
    };
  }

  const designators =
    '(apt\\.?|apartment|bldg\\.?|building|dept\\.?|department|fl\\.?|floor|rm\\.?|room|ste\\.?|suite|unit)';

  const normalizedDesignators = {
    apt: 'apartment',
    bldg: 'building',
    dept: 'department',
    fl: 'floor',
    rm: 'room',
    ste: 'suite'
  };

  // Needs to go before after-street case to prevent parsing civic number as a
  // full street address.
  const afterNumber = new RegExp(
    `^\\s*([0-9]+)\\s+${designators}\\s*([0-9]+|[a-z])([\\s,].*)$`,
    'i'
  );
  const afterNumberMatches = afterNumber.exec(query);
  if (afterNumberMatches !== null) {
    const designator = afterNumberMatches[2]
      .replace(/\./, '')
      .toLocaleLowerCase();

    const normalizedDesignator = normalizedDesignators[designator]
      ? normalizedDesignators[designator]
      : designator;

    return {
      civicAddress: `${afterNumberMatches[1].replace(
        /[\s,]*$/,
        ''
      )} ${afterNumberMatches[4].replace(/^[\s,]*/, '')}`,
      unitDesignator: normalizedDesignator,
      unitNumber: afterNumberMatches[3]
    };
  }

  const afterStreet = new RegExp(
    `^\\s*([0-9]+.+)\\s${designators}\\s*([0-9]+|[a-z])([\\s,].*)$`,
    'i'
  );
  const afterStreetMatches = afterStreet.exec(query);
  if (afterStreetMatches !== null) {
    const designator = afterStreetMatches[2]
      .replace(/\./, '')
      .toLocaleLowerCase();

    const normalizedDesignator = normalizedDesignators[designator]
      ? normalizedDesignators[designator]
      : designator;

    return {
      civicAddress: `${afterStreetMatches[1].replace(
        /[\s,]*$/,
        ''
      )}, ${afterStreetMatches[4].replace(/^[\s,]*/, '')}`,
      unitDesignator: normalizedDesignator,
      unitNumber: afterStreetMatches[3]
    };
  }

  const beforeCivicNumber = new RegExp(
    `^\\s*${designators}\\s*([0-9]+|[a-z])[-\\s,]+(.*)$`,
    'i'
  );
  const beforeCivicNumberMatches = beforeCivicNumber.exec(query);
  if (beforeCivicNumberMatches !== null) {
    const designator = beforeCivicNumberMatches[1]
      .replace(/\./, '')
      .toLocaleLowerCase();

    const normalizedDesignator = normalizedDesignators[designator]
      ? normalizedDesignators[designator]
      : designator;

    return {
      civicAddress: beforeCivicNumberMatches[3].replace(/^\s*/, ''),
      unitDesignator: normalizedDesignator,
      unitNumber: beforeCivicNumberMatches[2]
    };
  }

  return {
    civicAddress: query,
    unitDesignator: 'apt',
    unitNumber: '2'
  };
}
