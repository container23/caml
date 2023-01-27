import { handleAMLCheckResults } from './handlers/aml';
import { handleInteractions } from './handlers/index';
import { Server } from './utils/index';
import { handleHome } from './handlers/home';

export const setupRoutes = (app: Server) => {
  app.get('/', handleHome);

  /**
   * Interactions endpoint URL where Discord will send HTTP requests
   */
  app.post('/interactions', handleInteractions);

  /**
   * AML Check Results 
   */
  app.get('/amlcheck/results', handleAMLCheckResults)
};
