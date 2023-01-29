// Helpers for search AML sources

import { once } from 'node:events';
import path from 'node:path';
import {
  AMLSearchMatch,
  AMLSearchResponse,
  AML_STATUS,
  AML_STATUS_MESSAGES,
  LineMatch,
} from './types';
import {
  buildReadlineStream,
  buildSearchRegEx,
  isValidDateStr,
  sanitizeStr,
} from './utils';

export const AML_LIST_FILEPATH =
  process.env.AML_LIST_FILEPATH ||
  path.join(__dirname, '../../data-sources/sdnlist.txt');

/**
 * Search if a {inputTxt} match is found in the given AML filepath
 * @param {String} searchTxt
 * @param {String} filepath Optional path to AML source list. Default to local AML_LIST_FILEPATH
 * @returns matches result object
 */
export const searchAMLFile = async (
  inputTxt: string,
  filepath = AML_LIST_FILEPATH
): Promise<AMLSearchResponse> => {
  const searchTerm = sanitizeStr(inputTxt);
  const searchRegExp = buildSearchRegEx(searchTerm);

  const matches: AMLSearchMatch[] = [];
  let currentBlockMatches: LineMatch[] = [],
    lineNum = 0,
    blockStartIdx = 1,
    blockEndIdx = -1,
    totalMatches = 0,
    lastProcessedLine = '';

  // closure for internal line processing
  const processLine = (line?: string) => {
    lineNum++;
    if (!line) {
      // check if its a line break
      blockEndIdx = lineNum - 1;
      // if we found any matches in the current block
      // include the matched lines results
      if (currentBlockMatches.length) {
        totalMatches += currentBlockMatches.length;
        matches.push({
          blockStart: blockStartIdx,
          blockEnd: blockEndIdx,
          totalMatches: currentBlockMatches.length,
          matchedLines: currentBlockMatches,
        });
      }
      // reset block fields
      blockStartIdx = lineNum + 1;
      currentBlockMatches = [];
      // check if current line matches input text
    } else if (sanitizeStr(line).search(searchRegExp) >= 0) {
      // add the matches to the current block
      currentBlockMatches.push({
        lineNum,
        lineText: line,
      });
    }
  };

  const rl = await buildReadlineStream(filepath);
  // process each line from file
  rl.on('line', (line) => {
    processLine(line);
    lastProcessedLine = line;
  });
  // wait to read last line
  await once(rl, 'close');
  processLine(); // process last line
  // the last line of the SDN source files represents updated date
  const sourceUpdatedAt = isValidDateStr(lastProcessedLine)
    ? lastProcessedLine
    : '';
  return buildResultsOutput({
    searchTerm,
    totalMatches,
    matches,
    sourceUpdatedAt,
  });
};

/**
 * Builds the final results set from AML file search results
 * @param param0 AML file results
 * @returns AMLSearchResponse
 */
const buildResultsOutput = ({
  searchTerm,
  matches = [],
  sourceUpdatedAt,
  totalMatches = 0,
}: {
  searchTerm: string;
  matches?: AMLSearchMatch[];
  sourceUpdatedAt: string;
  totalMatches?: number;
}) => {
  const foundMatch = totalMatches > 0;
  const status = foundMatch ? AML_STATUS.BANNED : AML_STATUS.SAFE;
  const statusMsg = AML_STATUS_MESSAGES[status];
  return {
    searchTerm,
    status,
    sourceUpdatedAt,
    statusMsg,
    foundMatch,
    matches,
    totalMatches,
  };
};

export default searchAMLFile;