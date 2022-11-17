import 'dotenv/config';
import express from 'express';
import { setupMiddlewares } from './server/middlewares/index.js';
import { setupRoutes } from './server/routing.js';
import {initCommands} from './services/discord/bot/commands.js';

const app = express();
const PORT = process.env.PORT || 3000;

setupMiddlewares(app);
setupRoutes(app);

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
  initCommands(process.env.APP_ID, process.env.GUILD_ID);
});
