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

  const afterStreet = new RegExp(
    `^\\s*([0-9]+.+)\\s${designators}\\s*([0-9]+|[a-z])(.*)$`,
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

  return {
    civicAddress: query,
    unitDesignator: 'apt',
    unitNumber: '2'
  };
}
