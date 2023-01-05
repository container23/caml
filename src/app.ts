import 'dotenv/config';
import path from 'path';
import server from './api/server.js';
import { initCommands } from './services/discord';
import { logger } from './utils/logger';

const {
  PORT: PORT = 8080,
  NODE_ENV: ENVIRONMENT = 'dev',
  ENABLE_DISCORD_CMDS_REGISTRATION = 'true',
} = process.env;

server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views'));

server.listen(PORT, () => {
  logger.info(`Started "${ENVIRONMENT}" server on http://localhost:${PORT}`);
  // On development, only register the commands to specific guild
  if (ENABLE_DISCORD_CMDS_REGISTRATION === 'true') {
    const guildId = ENVIRONMENT === 'production' ? '' : process.env.GUILD_ID;
    initCommands(process.env.APP_ID || '', guildId);
  }
});
