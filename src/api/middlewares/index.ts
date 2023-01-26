import { json, Express as Server, static as ServeStatic } from 'express';
import { verifyDiscordRequest } from '../../services/discord/index';
import { requestLogger } from './logger';
import { trackRequest } from './analytics';

export const setupMiddlewares = (app: Server) => {
  // static assets
  app.use('/assets', ServeStatic('dist/views/assets'));
  // analitycs metrics tracking
  app.use(trackRequest());
  // logger
  app.use(requestLogger());
  // json parser
  app.use(json(buildJSONParserOpts()));
};

const buildJSONParserOpts = () =>
  process.env.NODE_ENV === 'production'
    ? {
      // enabled discord request authorization, for non-dev environment
      verify: verifyDiscordRequest(process.env.PUBLIC_KEY || ''),
    }
    : undefined;
