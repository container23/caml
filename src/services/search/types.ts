export enum AML_STATUS {
   SAFE = 'safe',
   BANNED = 'banned',
}

export const AML_STATUS_MESSAGES = {
  [AML_STATUS.SAFE]: '✅ (**SAFE**)',
  [AML_STATUS.BANNED]: '🚫 (**BANNED**)',
};

export const MIN_SEARCH_INPUT_LENGTH = 2;
export const MAX_SEARCH_INPUT_LENGTH = 80;

export type LineMatch = {
  lineNum: number;
  lineText: string;
};

export type AMLSearchMatch = {
  blockStart: number;
  blockEnd: number;
  totalMatches: number;
  matchedLines: LineMatch[];
};

export type AMLSearchResponse = {
  searchTerm: string;
  status: AML_STATUS;
  statusMsg: string;
  foundMatch: boolean;
  matches: AMLSearchMatch[];
  totalMatches: number;
  sourceUpdatedAt: string;
};
