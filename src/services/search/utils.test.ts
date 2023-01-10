import { isValidDateStr, sanitizeStr } from './utils';

describe('Search Utils', () => {
  describe('sanitizeStr', () => {
    const tests = [
      {
        searchInput: '<$testall!%?~$>`^',
        searchOutput: 'testall',
      },
      {
        searchInput: 'Sufian al-Pasterar',
        searchOutput: 'Sufian al-Pasterar',
      },
      {
        searchInput: 'john.strt@mldex.com',
        searchOutput: 'john.strt@mldex.com',
      },
      {
        searchInput: 'BTC X3235T1',
        searchOutput: 'BTC X3235T1',
      },
      {
        searchInput: 'FTX (X3235T1)',
        searchOutput: 'FTX X3235T1',
      },
    ];

    for (const t of tests) {
      test(`sanitized input ${t.searchInput} to ${t.searchOutput}`, async () => {
        const sanitized = await sanitizeStr(t.searchInput);
        expect(sanitized).toEqual(t.searchOutput);
      });
    }
  });

  describe('isValidDateStr', () => {
    expect(isValidDateStr('01/23/2023')).toBe(true);
    expect(isValidDateStr('01/23/23')).toBe(false);
  });
});
