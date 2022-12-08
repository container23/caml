export enum AML_STATUS {
   SAFE = 'safe',
   BANNED = 'banned',
}

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
  status: AML_STATUS;
  statusMsg: string;
  foundMatch: boolean;
  matches: AMLSearchMatch[];
  totalMatches: number;
  sourceUpdatedAt: string;
};