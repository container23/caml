import {
  handleHome,
  handleDiscordInteractions,
  handleAMLSearch,
  handlePrivacy,
  handleBot,
  handleAbout,
  handleTerms,
  handleMetamaskPage,
} from './handlers';
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
   * Metamask Integration
   */
  app.get('/metamask', handleMetamaskPage);

  /**
   * Info pages
   */
  app.get('/about', handleAbout);
  app.get('/privacy', handlePrivacy);
  app.get('/terms', handleTerms);
};
