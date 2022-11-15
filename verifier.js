import { AML_SOURCE_LIST, AML_SOURCE_DATE } from './aml-list.js';

export const AML_STATUS_SAFE = 'safe';
export const AML_STATUS_BANNED = 'banned';

export const AML_STATUS_MESSAGES = {
    [AML_STATUS_SAFE]: `✅ (**SAFE**)`,
    [AML_STATUS_BANNED]: `🚫 (**BANNED**)`
};


export const checkValueOnAML = (searchValue) => {
    // TODO: perform better text matching and include additional of matched data
    const searchFlags = 'gmi'; // global, multiple, insenstive
    const searchQuery = "\\b" + searchValue + "\\b" // search within boundary
    const searchQueryRegExp = new RegExp(searchQuery, searchFlags);
    const matchIndex = AML_SOURCE_LIST.search(searchQueryRegExp);
    // console.log('match results', AML_SOURCE_LIST.match(searchQuery));
    console.log('found matched string index', matchIndex);
    const foundMatch = matchIndex >= 0;
    const matchedText = foundMatch ? AML_SOURCE_LIST[matchIndex] : '';
    const status = foundMatch ? AML_STATUS_BANNED : AML_STATUS_SAFE;
    const result = {
        status,
        statusMsg: AML_STATUS_MESSAGES[status],
        foundMatch,
        matchedText,
        sourceDate: AML_SOURCE_DATE
    };
    console.debug(result);
    return result;
};