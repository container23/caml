import 'dotenv/config';
import { verifyKey } from 'discord-interactions';
import { Request, Response } from '../../api/utils/index';
import { REST, Routes } from 'discord.js';
import { logger } from '../../utils/logger';
import { SIMPLE_CHECK_COMMAND, TEST_COMMAND, VERBOSE_CHECK_COMMAND } from './commands';

const BASE_API_VERSION = '10';
const ACCESS_TOKEN = process.env.DISCORD_TOKEN || '';
let restInstance: REST;

export const verifyDiscordRequest = (clientKey: string) => {
  return (req: Request, res: Response, buf: Buffer) => {
    const signature = req.get('X-Signature-Ed25519');
    const timestamp = req.get('X-Signature-Timestamp');

    const isValidRequest = verifyKey(buf, signature, timestamp, clientKey);
    if (!isValidRequest) {
      res.status(401).send('Bad request signature');
      throw new Error('Bad request signature');
    }
  };
};

// Init commands
// Check if guild commands from commands.js are installed (if not, install them)
export const initCommands = async (appId: string, guildId?: string) => registerCommands(
  appId,
  [
    TEST_COMMAND,
    SIMPLE_CHECK_COMMAND,
    VERBOSE_CHECK_COMMAND
  ],
  guildId
);

export const newRestRequest = (version = BASE_API_VERSION): REST => {
  if (restInstance) {
    return restInstance;
  }
  restInstance = new REST({ version });
  restInstance.setToken(ACCESS_TOKEN);
  return restInstance;
}

export const registerCommands = async (
  appId: string,
  commands: Command[],
  guildId?: string
) => {
  try {
    const req = newRestRequest();
    if (guildId) {
      logger.info(`Started refreshing application (/) commands on server/guild: ${guildId}`);
      // only register commands to given guild server
      await req.put(Routes.applicationGuildCommands(appId, guildId), {
        body: commands
      });
    } else {
      logger.info('Started refreshing application (/) commands.');
      // register on application level
      await req.put(Routes.applicationCommands(appId), {
        body: commands,
      });
    }
    logger.info('Successfully reloaded application (/) commands.');
  } catch (error) {
    logger.error(error);
    return error;
  }
};
