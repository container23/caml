import { handleAMLCheckResults } from './handlers/aml';
import { handleInteractions } from './handlers/index';
import { handleCfg } from './handlers/cfg';
import { getHeartbeat } from './handlers/health';
import { Server, DISCORD_BOT_AUTH_URL } from './utils/index';

export const setupRoutes = (app: Server) => {
  app.get('/', (_, res) => {
    const data = {
      discordBotAuth: DISCORD_BOT_AUTH_URL,
    };
    res.render('home', data);
  });

  /**
   * Interactions endpoint URL where Discord will send HTTP requests
   */
  app.post('/interactions', handleInteractions);

  /**
   * AML Check Results 
   */
  app.get('/amlcheck/results', handleAMLCheckResults)

  /**
   * cfg
   */
  app.get('/cfg', handleCfg);

  /**
   * heartbeat 
   */
  app.get('/heartbeat', getHeartbeat);
};
