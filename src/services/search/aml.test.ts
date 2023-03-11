import { describe, expect, test } from '@jest/globals';
import { searchAMLFile } from './aml';
import { AML_STATUS, AML_STATUS_MESSAGES } from './types';
import path from 'path';

const TEST_FILE_PATH = path.join(
  __dirname,
  '../../../data-sources/testlist.txt'
);

const trimSpaces = (str: string) => str.replace(/[\n\r]/g, '');

describe('AML File Search', () => {
  describe('Should search based on input text', () => {
    const tests = [
      {
        input: 'multiline',
        matched: true,
        totalMatches: 2,
        matches: [
          {
            blockNum: 1,
            blockStart: 1,
            blockEnd: 3,
            blockText:
              'This is a multiline testing Filefor testing files searches with multiline matches in a block',
            totalMatches: 2,
            matchedLines: [
              {
                lineNum: 1
              },
              {
                lineNum: 3
              },
            ],
          },
        ],
      },
      {
        input: 'Bogdan',
        matched: true,
        totalMatches: 3,
        matches: [
          {
            blockNum: 6,
            blockStart: 27,
            blockEnd: 32,
            blockText:
              trimSpaces(`BASKAU, Dzmitriy Yurievich (a.k.a. BASKAU, Dzmitry; a.k.a. BASKOV,
Dmitriy; a.k.a. BASKOV, Dmitriy Yurievich; a.k.a. BASKOV, Dmitry),
ul. M. Bogdanovicha, d. 124, kv. 68, Minsk, Belarus; DOB 25 Aug
1978; POB Minsk, Belarus; nationality Belarus; Gender Male;
Passport MP3727671 (Belarus) issued 16 Sep 2015; National ID No.
3250878A013PB7 (Belarus) (individual) [BELARUS-EO14038].`),
            totalMatches: 1,
            matchedLines: [
              {
                lineNum: 29,
              },
            ],
          },
          {
            blockNum: 7,
            blockStart: 34,
            blockEnd: 39,
            totalMatches: 1,
            blockText:
              trimSpaces(`Second BASKAU, Dzmitry (a.k.a. BASKAU, Dzmitriy Yurievich; a.k.a. BASKOV,
Dmitriy; a.k.a. BASKOV, Dmitriy Yurievich; a.k.a. BASKOV, Dmitry),
Second. Bogdanovicha, d. 123, kv. 61, Igina, Belarus; DOB 12 Jan
1978; POB Minsk, Belarus; nationality Belarus; Gender Male;
Passport T00043812 (Belarus) issued 16 Sep 2015; National ID No.
3250878A013PB7 (Belarus) (individual) [BELARUS-EO14038].`),
            matchedLines: [
              {
                lineNum: 36,
              },
            ],
          },
          {
            blockNum: 8,
            blockStart: 41,
            blockEnd: 41,
            totalMatches: 1,
            blockText: 'Bogdan is also a common name on the list :). Right bogdan!',
            matchedLines: [
              {
                lineNum: 41,
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
        expect(re.status).toBe(t.matched ? AML_STATUS.MATCH : AML_STATUS.NO_MATCH);
        expect(re.statusMsg).toBe(AML_STATUS_MESSAGES[re.status]);
        if (t.matches) {
          expect(re.matches).toEqual(t.matches);
        }
      });
    }
  });
});
