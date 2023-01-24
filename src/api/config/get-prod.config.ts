import { Config, ProcessVariables } from "./config.type";

export function getProdConfig(processVariables: ProcessVariables): Config {
  return {
    environment: "production",
    logLevel: processVariables.LOG_LEVEL ?? "error",
  };
}