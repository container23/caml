import { Level } from "pino";

export type Environment =
  // The service running in a production cluster available for customers
  | "production"
  // The service running locally on a development machine
  | "local";

export interface Config {
  environment: Environment;
  logLevel: Level;
}

export interface ProcessVariables {
  ENV?: Environment;
  LOG_LEVEL?: Level;
}