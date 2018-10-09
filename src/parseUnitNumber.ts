export interface IParseUnitNumberResult {
  civicAddress: string;
  unitDesignator: string;
  unitNumber: string;
}

export function parseUnitNumber(query: string): IParseUnitNumberResult {
  return {
    civicAddress: query,
    unitDesignator: 'apt',
    unitNumber: '2'
  };
}
