import { AML_STATUS_MESSAGES } from '../../services/search/aml';
import { AMLSearchResponse, AML_STATUS } from '../../services/search/types';
import { buildVerboseDetailsOutput, generateAmlResultsURL } from './interactions';

describe('Interactions Handler Tests', () => {
  describe('buildVerboseDetailsOutput', () => {
    test('builds verbose output limited to max output lines', () => {
      const maxOutputLines = 2;
      const matchedLines = [
        {
          lineNum: 1,
          lineText: 'test line 1',
        },
        {
          lineNum: 2,
          lineText: 'test line 2',
        },
        // this line should not be included in result
        {
          lineNum: 3,
          lineText: 'test line 3',
        },
      ];
      const input: AMLSearchResponse = {
        searchTerm: 'test',
        status: AML_STATUS.SAFE,
        statusMsg: AML_STATUS_MESSAGES[AML_STATUS.SAFE],
        foundMatch: true,
        sourceUpdatedAt: '12/28/22',
        totalMatches: 3,
        matches: [
          {
            blockStart: 0,
            blockEnd: 4,
            totalMatches: 3,
            matchedLines: matchedLines,
          },
        ],
      };

      const result = buildVerboseDetailsOutput(input, maxOutputLines);

      let expectedOutput = `\n **Source List Updated Date**: ${input.sourceUpdatedAt}`;
      expectedOutput += `\n **Found ${input.totalMatches} matches.**`;
      expectedOutput += `. Below are the first ${maxOutputLines} matches:`;
      expectedOutput += `\n \t ⚠ Matches on paragraph from line ${input.matches[0].blockStart} to ${input.matches[0].blockEnd}:`;
      expectedOutput += `\n \t \t - 1) **Line # ${matchedLines[0].lineNum}**: ${matchedLines[0].lineText}`;
      expectedOutput += `\n \t \t - 2) **Line # ${matchedLines[1].lineNum}**: ${matchedLines[1].lineText}`;
      expectedOutput += `\n See full results [here](${generateAmlResultsURL(input.searchTerm)})`;
     
      expect(result).toEqual(expectedOutput);
    });
  });
});
