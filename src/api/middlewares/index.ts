import { json, Express as Server, NextFunction } from 'express';
import { verifyDiscordRequest } from '../../services/discord/index';
import httpLogger from 'pino-http';
import { logger } from '../../utils/logger';

const requestLogger = () => {
  const log = httpLogger({
    logger: logger, // reuse existing logger instance
  });

  /* eslint-disable @typescript-eslint/no-explicit-any */
  // using any since this httpLogger treats req and res as different types
  return (req: any, res: any, next: NextFunction) => {
    log(req, res);
    next();
  };
};

export const setupMiddlewares = (app: Server) => {
  // logger
  app.use(requestLogger());
  // json parser
  app.use((req, res, next) => {
    console.log('ENVIRONMENT', process.env.NODE_ENV, process.env.PUBLIC_KEY);
    next();
  });
  app.use(json(buildJSONParserOpts()));
};

const buildJSONParserOpts = () =>
  process.env.NODE_ENV === 'production'
    ? {
        // enabled discord request authorization, for non-dev environment
        verify: verifyDiscordRequest(process.env.PUBLIC_KEY || ''),
      }
    : undefined;
