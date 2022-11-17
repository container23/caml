import {handleInteractions} from './handlers/index.js';

export const setupRoutes = (app) => {
    app.get('/', (_, res)  =>{
        res.send('Hello Bot :)')
    });
    
    /**
     * Interactions endpoint URL where Discord will send HTTP requests
     */
    app.post('/interactions', handleInteractions); 
}