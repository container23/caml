import { NextFunction } from 'express';
import httpLogger from 'pino-http';
import { logger } from '../../utils/logger';

export const requestLogger = () => {
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
