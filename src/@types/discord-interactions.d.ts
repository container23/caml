// Type definitions for discord-interactions lib
// For now allowing all methods without declared types
// Eventually this definitions should be provided provided by the package itself
declare module 'discord-interactions';

interface CommandOpt {
    type: number;
    name: string;
    description: string;
    min_length: number;
    max_length: number;
    required: boolean;
}

interface Command {
  name: string;
  type: number;
  description: string;
  options?: CommandOpt[];
}
