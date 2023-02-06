import {
  handleHome,
  handleDiscordInteractions,
  handleAMLSearch,
  handlePrivacy,
  handleBot,
  handleAbout,
  handleTerms
} from './handlers';
import {  } from './handlers/bot';
import { Server } from './utils/index';

export const setupRoutes = (app: Server) => {
  /**
   * Home Page
   */
  app.get('/', handleHome);

  /**
   * AML Search
   */
  app.get('/aml/search', handleAMLSearch);

  /**
   * Discord Bot Integration
   */
  app.get('/discord/bot', handleBot);

  /**
   * Discord Bot Interactions requests
   */
  app.post('/discord/interactions', handleDiscordInteractions);

  /**
   * Info pages
   */
  app.get('/about', handleAbout);
  app.get('/privacy', handlePrivacy);
  app.get('/terms', handleTerms);
};
