import { json, Express as Server, static as ServeStatic } from 'express';
import { verifyDiscordRequest } from '../../services/discord/index';
import { requestLogger } from './logger';
import { trackAnalytics } from './analytics';
import { errorHandler } from './errors';
import cors from 'cors';

export const setupMiddlewares = (app: Server) => {
  // static assets
  app.use('/assets', ServeStatic('dist/views/assets'));
  // scss compile css
  app.use('/css', ServeStatic('dist/css'));
  // logger
  app.use(requestLogger());
  // json parser
  app.use(json(buildJSONParserOpts()));
  // analytics metrics tracking
  app.use(trackAnalytics());
  // CORS
  app.use(cors());
};

export const setupErrorHandlers = (app: Server) => {
  app.use(errorHandler);
}

const buildJSONParserOpts = () =>
  process.env.NODE_ENV === 'production'
    ? {
      // enabled discord request authorization, for non-dev environment
      verify: verifyDiscordRequest(process.env.PUBLIC_KEY || ''),
    }
    : undefined;
