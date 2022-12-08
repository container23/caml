import {json, Express as Server, NextFunction} from 'express';
import { verifyDiscordRequest } from '../../services/discord/index'
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
  app.use(requestLogger())
  // app.use(bodyParser.json());
  // discord auth 
  app.use(json({ verify: verifyDiscordRequest(process.env.PUBLIC_KEY || '') }));
}