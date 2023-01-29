import { describe, expect, test } from '@jest/globals';
import { searchAMLFile } from './aml';
import { AML_STATUS, AML_STATUS_MESSAGES } from './types';
import path from 'path';

const TEST_FILE_PATH = path.join(
  __dirname,
  '../../../data-sources/testlist.txt'
);

describe('AML File Search', () => {
  describe('Should search based on input text', () => {
    const tests = [
      {
        input: 'multiline',
        matched: true,
        totalMatches: 2,
        matches: [
          {
            blockStart: 1,
            blockEnd: 3,
            totalMatches: 2,
            matchedLines: [
              {
                lineNum: 1,
                lineText: 'This is a multiline testing File',
              },
              {
                lineNum: 3,
                lineText: 'with multiline matches in a block',
              },
            ],
          },
        ],
      },
      {
        input: 'Bogdanovicha',
        matched: true,
        totalMatches: 2,
        matches: [
          {
            blockStart: 27,
            blockEnd: 32,
            totalMatches: 1,
            matchedLines: [
              {
                lineNum: 29,
                lineText:
                  'ul. M. Bogdanovicha, d. 124, kv. 68, Minsk, Belarus; DOB 25 Aug',
              },
            ],
          },
          {
            blockStart: 34,
            blockEnd: 39,
            totalMatches: 1,
            matchedLines: [
              {
                lineNum: 36,
                lineText:
                  'Second. Bogdanovicha, d. 123, kv. 61, Igina, Belarus; DOB 12 Jan',
              },
            ],
          },
        ],
      },
      {
        input: 'Sufian al-Salamabi',
        matched: true,
        totalMatches: 1,
      },
      {
        input: 'Sufian al',
        matched: true,
        totalMatches: 1,
      },
      {
        input: 'bogdan',
        matched: true,
        totalMatches: 1,
      },
      {
        input: 'KOLOSOV',
        matched: true,
        totalMatches: 1,
      },
      {
        input: 'XBT 3Q5dGfLKkWqWSwYtbMUyc8xGjN5LrRviK4',
        matched: true,
        totalMatches: 1,
      },
      {
        input: 'Aircraft Tail Number YV2913',
        matched: true,
        totalMatches: 1,
      },
      {
        input: 'Passport T00043812',
        matched: true,
        totalMatches: 1,
      },
      {
        input: 'Canada',
        matched: true,
        totalMatches: 2,
      },
      {
        input: 'SOMETEXTNOTONTHEFILE',
        matched: false,
        totalMatches: 0,
      },
    ];

    for (const t of tests) {
      test(`Matched ${t.matched} with input: ${t.input}`, async () => {
        const re = await searchAMLFile(t.input, TEST_FILE_PATH);
        expect(re.foundMatch).toBe(!!t.matched);
        expect(re.sourceUpdatedAt).toBe('11/14/2022');
        expect(re.totalMatches).toBe(t.totalMatches || 0);
        expect(re.status).toBe(t.matched ? AML_STATUS.BANNED : AML_STATUS.SAFE);
        expect(re.statusMsg).toBe(AML_STATUS_MESSAGES[re.status]);
        if (t.matches) {
          expect(re.matches).toEqual(t.matches);
        }
      });
    }
  });
});
