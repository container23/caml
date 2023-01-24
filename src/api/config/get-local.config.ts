import { Config, ProcessVariables } from "./config.type";

export function getLocalConfig(processVariables: ProcessVariables): Config {
  return {
    environment: "local",
    logLevel: processVariables.LOG_LEVEL ?? "debug",
  };
}