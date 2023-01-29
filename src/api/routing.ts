import { handleHome, handleDiscordInteractions, handleAMLSearch } from './handlers';
import { Server } from './utils/index';

export const setupRoutes = (app: Server) => {
  /**
   * Home Page
   */
  app.get('/', handleHome);

  /**
   * Discord Bot Interactions requests
   */
  app.post('/discord/interactions', handleDiscordInteractions);

  /**
   * AML Search
   */
  app.get('/aml/search', handleAMLSearch)
};
