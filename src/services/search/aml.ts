// Helpers for search AML sources
import fs from 'fs';
import readline from 'readline';
import { once } from 'node:events';
import path from 'path';
import {
  AMLSearchMatch,
  AMLSearchResponse,
  AML_STATUS,
  LineMatch,
} from './types';

export const AML_FILE_PATH = path.join(__dirname, '../../data-sources/sdnlist.txt');

export const AML_STATUS_MESSAGES = {
  [AML_STATUS.SAFE]: '✅ (**SAFE**)',
  [AML_STATUS.BANNED]: '🚫 (**BANNED**)',
};

const buildSearchRegEx = (searchTxt: string) => {
  const searchFlags = 'gmi'; // global, multiple, insenstive
  const searchQuery = `\\b${searchTxt}\\b`; // search within boundary
  const regEx = new RegExp(searchQuery, searchFlags);
  return regEx;
};

const buildReadlineStream = async (filepath: string) => {
  const inStream = fs.createReadStream(filepath);
  const rl = readline.createInterface(inStream);
  return rl;
};

/**
 * Search if a {inputTxt} match is found in the given AML filepath
 * @param {String} searchTxt
 * @param {String} filepath Optional path to AML source list. Default to local AML_FILE_PATH
 * @returns matches result object
 */
export const searchAMLFile = async (
  inputTxt: string,
  filepath = AML_FILE_PATH
): Promise<AMLSearchResponse> => {
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
    }

    // check if current line matches input text
    if (line && line.search(searchRegEx) >= 0) {
      // add the matches to the current block
      currentBlockMatches.push({
        lineNum,
        lineText: line,
      });
    }
  };

  const rl = await buildReadlineStream(filepath);
  const searchRegEx = buildSearchRegEx(inputTxt);

  // process each line from file
  rl.on('line', (line) => {
    processLine(line);
    lastProcessedLine = line;
  });
  // wait to read last line
  await once(rl, 'close');
  processLine(); // process last line
  return buildResultsOutput({
    totalMatches,
    matches,
    // the last line of the SDN source files represents updated date
    sourceUpdatedAt: lastProcessedLine,
  });
};

const buildResultsOutput = ({
  matches = [],
  sourceUpdatedAt,
  totalMatches = 0,
}: {
  matches?: AMLSearchMatch[];
  sourceUpdatedAt: string;
  totalMatches?: number;
}) => {
  const foundMatch = totalMatches > 0;
  const status = foundMatch ? AML_STATUS.BANNED : AML_STATUS.SAFE;
  const statusMsg = AML_STATUS_MESSAGES[status];
  return {
    status,
    sourceUpdatedAt,
    statusMsg,
    foundMatch,
    matches,
    totalMatches,
  };
};
