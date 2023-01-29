export enum AML_STATUS {
   SAFE = 'safe',
   BANNED = 'banned',
}

export const AML_STATUS_MESSAGES = {
  [AML_STATUS.SAFE]: '✅ (**SAFE**)',
  [AML_STATUS.BANNED]: '🚫 (**BANNED**)',
};

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
