// Helpers for search AML sources 
import fs from 'fs';
import readline from 'readline';
import stream from 'stream';
import { once } from 'node:events';
import path from 'path';

export const AML_FILE_PATH = path.join(__dirname, '../../data-sources/sdnlist.txt');
export const AML_STATUS_SAFE = 'safe';
export const AML_STATUS_BANNED = 'banned';
export const AML_STATUS_MESSAGES = {
    [AML_STATUS_SAFE]: `✅ (**SAFE**)`,
    [AML_STATUS_BANNED]: `🚫 (**BANNED**)`
};

const buildSearchRegEx = (searchTxt) => {
    const searchFlags = 'gmi'; // global, multiple, insenstive
    const searchQuery = `\\b${searchTxt}\\b` // search within boundary
    const regEx = new RegExp(searchQuery, searchFlags);
    return regEx
};

const buildReadlineStream = async (filepath) => {
    const inStream = fs.createReadStream(filepath);
    const outStream = new stream;
    const rl = readline.createInterface(inStream, outStream);
    return rl;
};

/**
 * Search if a {inputTxt} match is found in the given AML filepath
 * @param {String} searchTxt 
 * @param {String} filepath Optional path to AML source list. Default to local AML_FILE_PATH
 * @returns matches result object
 */
export const searchAMLFile = async (inputTxt, filepath = AML_FILE_PATH) => {
    const lineMatches = [];
    let currentBlockMatches = [];
    let lineNum = 0, blockStartIdx = 0, blockEndIdx = -1;
    let lastProcessedLine = '';
    // closure for internal line processing
    const processLine = (line) => {
        lineNum++;
        if (!line) { // check if its a line break
            blockEndIdx = lineNum - 1;
            // if we found any matches in the current block
            // include the matched lines results
            if (currentBlockMatches.length) {
                lineMatches.push({
                    blockStart: blockStartIdx,
                    blockEnd: blockEndIdx,
                    totalMatches: currentBlockMatches.length,
                    matchedLines: currentBlockMatches
                });
            } else {
                blockStartIdx = lineNum + 1;
                blockEndIdx = -1;
            }
            currentBlockMatches = [];
        }

        // check if current line matches input text
        if (line && line.search(searchRegEx) >= 0) {
            // add the matches to the current block
            currentBlockMatches.push({
                lineNum,
                lineText: line
            });
        }
    }

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
        lineMatches,
        // the last line of the SDN source files represents updated date 
        sourceUpdatedAt: lastProcessedLine
    });
}

const buildResultsOutput = ({lineMatches = [], sourceUpdatedAt} = {}) => {
    const foundMatch = lineMatches.length > 0;
    const status = foundMatch ? AML_STATUS_BANNED : AML_STATUS_SAFE;
    const statusMsg = AML_STATUS_MESSAGES[status]
    return {
        status,
        sourceUpdatedAt,
        statusMsg,
        foundMatch,
        lineMatches,
        totalMatches: lineMatches.length,
    };
};
