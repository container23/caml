import { logger } from '../../utils/logger';
import { Handler } from '../utils';

import { Config, Environment, ProcessVariables } from "../config/config.type";
import { getLocalConfig } from "../config/get-local.config";
import { getProdConfig } from "../config/get-prod.config";


// TODO: generate build info
export function getConfig(processVariables: ProcessVariables): Config {
  const environment: Environment = processVariables.ENV || "local";
  switch (environment) {
    case "production":
      return getProdConfig(processVariables);
    case "local":
      return getLocalConfig(processVariables);
  }
}

export const handleCfg: Handler = async (req, res) => {

  const timestamp = new Date().toISOString();
  const nodeEnv = process.env.NODE_ENV || '';
  const buildTime = process.env.BUILD_TIME || '';
  const version = process.env.VERSION|| '';
  const commit = process.env.COMMIT || '';

  res.status(200).send({
    timestamp,
    environment: nodeEnv,
    buildTime,
    commit,
    version,
    config: getConfig,
  });

};