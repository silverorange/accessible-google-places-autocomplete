import { parseUnitNumber } from './parseUnitNumber';

function expectParsedPartsToBe(
  address: string,
  expectedCivicAddress: string,
  expectedUnitDesignator: string,
  expectedUnitNumber: string
): void {
  const results = parseUnitNumber(address);
  expect(results.civicAddress).toEqual(expectedCivicAddress);
  expect(results.unitDesignator).toEqual(expectedUnitDesignator);
  expect(results.unitNumber).toEqual(expectedUnitNumber);
}

describe('parseUnitNumber', () => {
  describe('dashed format', () => {
    it('detects dashed unit', () => {
      expectParsedPartsToBe(
        '12-36 Grafton Street, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        '',
        '12'
      );
    });

    it('detects dashed unit with emdash', () => {
      expectParsedPartsToBe(
        '12–36 Grafton Street, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        '',
        '12'
      );
    });

    it('detects dashed unit with spaces', () => {
      expectParsedPartsToBe(
        '12 - 36 Grafton Street, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        '',
        '12'
      );
    });

    it('detects dashed letter unit', () => {
      expectParsedPartsToBe(
        'C-36 Grafton Street, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        '',
        'C'
      );
    });

    it('detects letter-number unit', () => {
      expectParsedPartsToBe(
        '12C-36 Grafton Street, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        '',
        '12C'
      );
    });

    it('detects dashed letter unit after civic number', () => {
      expectParsedPartsToBe(
        '36-C Grafton Street, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        '',
        'C'
      );
    });

    it('detects letter unit after civic number', () => {
      expectParsedPartsToBe(
        '36C Grafton Street, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        '',
        'C'
      );
    });

    it('detects letter unit after civic number with leading space', () => {
      expectParsedPartsToBe(
        ' 36 C Grafton Street, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        '',
        'C'
      );
    });
  });

  describe('letter numbers', () => {
    it('converts letter unit after number to uppercase', () => {
      expectParsedPartsToBe(
        '36 c Grafton Street, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        '',
        'C'
      );
    });

    it('converts letter unit before number to uppercase', () => {
      expectParsedPartsToBe(
        'c-36 Grafton Street, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        '',
        'C'
      );
    });

    it('converts lettered unit after civic number to uppercase', () => {
      expectParsedPartsToBe(
        '36 apt. c Grafton Street, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        'apt',
        'C'
      );
    });

    it('converts lettered unit before civic number to uppercase', () => {
      expectParsedPartsToBe(
        'Apt. c, 36 Grafton Street, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        'apt',
        'C'
      );
    });

    it('detects lettered unit after street name to uppercase', () => {
      expectParsedPartsToBe(
        '36 Grafton Street apt. c, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        'apt',
        'C'
      );
    });
  });

  describe('after civic number', () => {
    it('detects apartment after civic number', () => {
      expectParsedPartsToBe(
        '36 apartment 12 Grafton Street, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        'apt',
        '12'
      );
    });

    it('detects apt after civic number', () => {
      expectParsedPartsToBe(
        '36 apt 12 Grafton Street, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        'apt',
        '12'
      );
    });

    it('detects apt. after civic number', () => {
      expectParsedPartsToBe(
        '36 apt. 12 Grafton Street, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        'apt',
        '12'
      );
    });

    it('detects letter-number apt after civic number', () => {
      expectParsedPartsToBe(
        '36 apt 12C Grafton Street, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        'apt',
        '12C'
      );
    });

    it('detects letter-number with space apt after civic number', () => {
      expectParsedPartsToBe(
        '36 apt 12 C Grafton Street, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        'apt',
        '12C'
      );
    });

    it('detects letter-number with dash apt after civic number', () => {
      expectParsedPartsToBe(
        '36 apt 12-C Grafton Street, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        'apt',
        '12C'
      );
    });

    it('detects lettered apartment after civic number', () => {
      expectParsedPartsToBe(
        '36 apt. C Grafton Street, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        'apt',
        'C'
      );
    });

    it('detects slashed unit', () => {
      expectParsedPartsToBe(
        '12 / 36 Grafton Street, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        '',
        '12'
      );
    });
  });

  describe('before civic number', () => {
    it('detects hash sign before civic number', () => {
      expectParsedPartsToBe(
        '#12 36 Grafton Street, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        '',
        '12'
      );
    });

    it('detects apartment before civic number', () => {
      expectParsedPartsToBe(
        'Apartment 12, 36 Grafton Street, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        'apt',
        '12'
      );
    });

    it('detects apt before civic number', () => {
      expectParsedPartsToBe(
        'Apt 12, 36 Grafton Street, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        'apt',
        '12'
      );
    });

    it('detects apt. before civic number', () => {
      expectParsedPartsToBe(
        'Apt. 12, 36 Grafton Street, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        'apt',
        '12'
      );
    });

    it('detects lettered apartment before civic number', () => {
      expectParsedPartsToBe(
        'Apt. C, 36 Grafton Street, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        'apt',
        'C'
      );
    });

    it('detects letter-number apartment before civic number', () => {
      expectParsedPartsToBe(
        'Apt 12C, 36 Grafton Street, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        'apt',
        '12C'
      );
    });

    it('detects letter-number with space apartment before civic number', () => {
      expectParsedPartsToBe(
        'Apt 12 C, 36 Grafton Street, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        'apt',
        '12C'
      );
    });

    it('detects letter-number with dash apartment before civic number', () => {
      expectParsedPartsToBe(
        'Apt 12-C, 36 Grafton Street, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        'apt',
        '12C'
      );
    });

    it('detects apt. before civic number with no comma', () => {
      expectParsedPartsToBe(
        'Apt. 12 36 Grafton Street, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        'apt',
        '12'
      );
    });

    it('detects apt. before civic number with dash', () => {
      expectParsedPartsToBe(
        'Apt. 12-36 Grafton Street, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        'apt',
        '12'
      );
    });
  });

  describe('after street name', () => {
    it('detects hash sign apartment after street name', () => {
      expectParsedPartsToBe(
        '36 Grafton Street # 12, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        '',
        '12'
      );
    });

    it('detects apartment after street name', () => {
      expectParsedPartsToBe(
        '36 Grafton Street apartment 12, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        'apt',
        '12'
      );
    });

    it('detects apt after street name', () => {
      expectParsedPartsToBe(
        '36 Grafton Street apt 12, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        'apt',
        '12'
      );
    });

    it('detects apt. after street name', () => {
      expectParsedPartsToBe(
        '36 Grafton Street apt. 12, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        'apt',
        '12'
      );
    });

    it('detects letter-number apt after street name', () => {
      expectParsedPartsToBe(
        '36 Grafton Street apt 12C, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        'apt',
        '12C'
      );
    });

    it('detects letter-number with space apt after street name', () => {
      expectParsedPartsToBe(
        '36 Grafton Street apt 12 C, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        'apt',
        '12C'
      );
    });

    it('detects letter-number with dash apt after street name', () => {
      expectParsedPartsToBe(
        '36 Grafton Street apt 12-C, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        'apt',
        '12C'
      );
    });

    it('detects lettered apartment after street name', () => {
      expectParsedPartsToBe(
        '36 Grafton Street apt. C, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        'apt',
        'C'
      );
    });

    it('detects apt after street name with comma', () => {
      expectParsedPartsToBe(
        '36 Grafton Street, apt 12, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        'apt',
        '12'
      );
    });

    it('detects apt after street name at end of string', () => {
      expectParsedPartsToBe(
        '36 Grafton Street apt 12',
        '36 Grafton Street',
        'apt',
        '12'
      );
    });
  });

  describe('false positives', () => {
    it('does not detect apartment street', () => {
      expectParsedPartsToBe(
        '36 Apartment Street, Charlottetown, PE',
        '36 Apartment Street, Charlottetown, PE',
        '',
        ''
      );
    });
  });

  describe('designators', () => {
    it('detects building', () => {
      expectParsedPartsToBe(
        '36 Grafton Street building 12, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        'bldg',
        '12'
      );
    });

    it('detects bldg', () => {
      expectParsedPartsToBe(
        '36 Grafton Street bldg 12, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        'bldg',
        '12'
      );
    });

    it('detects department', () => {
      expectParsedPartsToBe(
        '36 Grafton Street department 12, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        'dept',
        '12'
      );
    });

    it('detects dept', () => {
      expectParsedPartsToBe(
        '36 Grafton Street dept 12, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        'dept',
        '12'
      );
    });

    it('detects floor', () => {
      expectParsedPartsToBe(
        '36 Grafton Street floor 12, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        'fl',
        '12'
      );
    });

    it('detects fl', () => {
      expectParsedPartsToBe(
        '36 Grafton Street fl 12, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        'fl',
        '12'
      );
    });

    it('detects suite', () => {
      expectParsedPartsToBe(
        '36 Grafton Street suite 12, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        'ste',
        '12'
      );
    });

    it('detects ste', () => {
      expectParsedPartsToBe(
        '36 Grafton Street ste 12, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        'ste',
        '12'
      );
    });

    it('detects room', () => {
      expectParsedPartsToBe(
        '36 Grafton Street room 12, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        'rm',
        '12'
      );
    });

    it('detects rm', () => {
      expectParsedPartsToBe(
        '36 Grafton Street rm 12, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        'rm',
        '12'
      );
    });

    it('detects unit', () => {
      expectParsedPartsToBe(
        '36 Grafton Street unit 12, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        'unit',
        '12'
      );
    });
  });

  describe('fractional units', () => {
    it('detects fractional unit before civic number', () => {
      expectParsedPartsToBe(
        '1/2 36 Grafton Street, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        '',
        '1/2'
      );
    });

    it('detects fractional unit before civic number with dash', () => {
      expectParsedPartsToBe(
        '1/2-36 Grafton Street, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        '',
        '1/2'
      );
    });

    it('detects unicode fractional unit before civic number', () => {
      expectParsedPartsToBe(
        '½ 36 Grafton Street, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        '',
        '1/2'
      );
    });

    it('detects unicode fractional unit before civic number with dash', () => {
      expectParsedPartsToBe(
        '½-36 Grafton Street, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        '',
        '1/2'
      );
    });

    it('detects fractional unit after civic number', () => {
      expectParsedPartsToBe(
        '36 1/2 Grafton Street, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        '',
        '1/2'
      );
    });

    it('detects unicode unit after civic number', () => {
      expectParsedPartsToBe(
        '36½ Grafton Street, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        '',
        '1/2'
      );
    });

    it('detects dashed fractional unit after civic number', () => {
      expectParsedPartsToBe(
        '36-1/2 Grafton Street, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        '',
        '1/2'
      );
    });

    it('detects unicode fractional unit after civic number', () => {
      expectParsedPartsToBe(
        '36-½ Grafton Street, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        '',
        '1/2'
      );
    });

    it('detects fractional unit after civic address', () => {
      expectParsedPartsToBe(
        '36 Grafton Street apt 1/2, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        'apt',
        '1/2'
      );
    });

    it('detects unicode fractional unit after civic address', () => {
      expectParsedPartsToBe(
        '36 Grafton Street apt ½, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        'apt',
        '1/2'
      );
    });

    it('detects fractional unit with designator before civic address', () => {
      expectParsedPartsToBe(
        'Apt 1/2, 36 Grafton Street, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        'apt',
        '1/2'
      );
    });

    it('detects unicode fractional unit with designator before civic address', () => {
      expectParsedPartsToBe(
        'Apt ½, 36 Grafton Street, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        'apt',
        '1/2'
      );
    });
  });

  describe('fractional unit suffix', () => {
    it('does not detect fractional unit suffix before civic number with dash', () => {
      expectParsedPartsToBe(
        '9-3/4 36 Grafton Street, Charlottetown, PE',
        '9-3/4 36 Grafton Street, Charlottetown, PE',
        '',
        ''
      );
    });

    it('detects fractional unit suffix before civic number without dash', () => {
      expectParsedPartsToBe(
        '9 3/4 36 Grafton Street, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        '',
        '9 3/4'
      );
    });

    it('detects unicode fractional unit suffix before civic number', () => {
      expectParsedPartsToBe(
        '9¾ 36 Grafton Street, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        '',
        '9 3/4'
      );
    });

    it('detects fractional unit suffix after civic address', () => {
      expectParsedPartsToBe(
        '36 Grafton Street apt 9 3/4, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        'apt',
        '9 3/4'
      );
    });

    it('detects unicode fractional unit after civic address', () => {
      expectParsedPartsToBe(
        '36 Grafton Street apt 9¾, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        'apt',
        '9 3/4'
      );
    });

    it('detects fractional unit with designator before civic address', () => {
      expectParsedPartsToBe(
        'Apt 9 3/4, 36 Grafton Street, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        'apt',
        '9 3/4'
      );
    });

    it('detects unicode fractional unit with designator before civic address', () => {
      expectParsedPartsToBe(
        'Apt 9¾, 36 Grafton Street, Charlottetown, PE',
        '36 Grafton Street, Charlottetown, PE',
        'apt',
        '9 3/4'
      );
    });
  });
});
