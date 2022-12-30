import 'dotenv/config';
import server from './api/server.js'
import { initCommands } from './services/discord';
import { logger } from './utils/logger';

const { PORT: PORT = 8080, NODE_ENV: ENVIRONMENT = 'dev' } = process.env;

server.listen(PORT, () => {
  logger.info(`Started "${ENVIRONMENT}" server on http://localhost:${PORT}`);
  initCommands(process.env.APP_ID || '');
});
