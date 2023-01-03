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

  app.get('/health', async (_ , res) => {
    const healthcheck = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: Date.now()
    };

    try {
        res.send(healthcheck);
    } catch (error: any) {
        healthcheck.message = error;
        res.status(503).send();
    }
  });
    
}
