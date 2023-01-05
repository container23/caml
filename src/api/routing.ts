import { handleAMLCheckResults } from './handlers/aml';
import { handleInteractions } from './handlers/index';
import { Server } from './utils/index';

export const setupRoutes = (app: Server) => {
  app.get('/', (_, res) => {
    res.send('Hello Bot :)');
  });

  /**
   * Interactions endpoint URL where Discord will send HTTP requests
   */
  app.post('/interactions', handleInteractions);

  /**
   * AML Check Results 
   */
  app.get('/amlcheck/results', handleAMLCheckResults)
};
