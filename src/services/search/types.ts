export enum AML_STATUS {
   MATCH = 'match',
   NO_MATCH = 'no match',
}

export const AML_STATUS_MESSAGES = {
  [AML_STATUS.MATCH]: '✅ (**MATCH**)',
  [AML_STATUS.NO_MATCH]: '🚫 (**NO MATCH**)',
};

export const MIN_SEARCH_INPUT_LENGTH = 2;
export const MAX_SEARCH_INPUT_LENGTH = 128;

export type LineMatch = {
  lineNum: number;
  lineText?: string;
};

export type AMLSearchMatch = {
  blockNum: number;
  blockStart: number;
  blockEnd: number;
  blockText: string;
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
