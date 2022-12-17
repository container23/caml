import { discordRequest } from '../index';
import { logger } from '../../../utils/logger';

export const verifyGuildCommands = async (appId: string, guildId: string, commands: Command[]) => {
  if (guildId === '' || appId === '') return;
  logger.info('Performing guild commands verifications...');
  commands.forEach((c) => verifyGuildCommand(appId, guildId, c));
};

// Verify and install a command if its not already registered on the guild server
const verifyGuildCommand = async (appId: string, guildId: string, command: Command) => {
  // API endpoint to get and post guild commands
  const endpoint = `applications/${appId}/guilds/${guildId}/commands`;

  try {
    const data = (await discordRequest(endpoint)) as Command[];
    if (data) {
      const installedNames = data.map((c: Command) => c.name);
      // This is just matching on the name, so it's not good for updates
      if (!installedNames.includes(command.name)) {
        logger.info(`Installing "${command.name}"`);
        installGuildCommand(appId, guildId, command);
      } else {
        logger.info(`"${command.name}" command already installed`);
      }
    }
  } catch (err) {
    logger.error({ msg: `error setting up command "${command.name}":`, error: err });
  }
};

// Installs/registers a command to the guild server
export const installGuildCommand = async (appId: string, guildId: string, command: Command) => {
  // API endpoint to get and post guild commands
  const endpoint = `applications/${appId}/guilds/${guildId}/commands`;
  // install command
  try {
    await discordRequest(endpoint, { method: 'post', data: command });
  } catch (err: any) {
    logger.error({ msg: `discord request error: ${err.message}`, error: err });
  }
};


/**
 * COMMANDS DEFINITIONS
 */

export const MIN_INPUT_LENGTH = 2;
export const MAX_INPUT_LENGTH = 80;

// Simple test "health check" command
export const TEST_COMMAND: Command = {
  name: 'test',
  description: 'Basic health check command',
  type: 1,
};

// Define requirements for Check command
export const SIMPLE_CHECK_COMMAND: Command = {
  name: 'check',
  description: 'Simple AML verification check',
  options: [
    {
      type: 3,
      name: 'value',
      description: 'Enter value to check',
      min_length: MIN_INPUT_LENGTH,
      max_length: MAX_INPUT_LENGTH,
      required: true
    },
  ],
  type: 1,
};

export const VERBOSE_CHECK_COMMAND: Command = {
  name: 'checkv',
  description: 'Verbose AML verification check, includes additional details of result',
  options: [
    {
      type: 3,
      name: 'value',
      description: 'Enter value to check',
      min_length: MIN_INPUT_LENGTH,
      max_length: MAX_INPUT_LENGTH,
      required: true
    },
  ],
  type: 1,
};

// Init commands
// Check if guild commands from commands.js are installed (if not, install them)
export const initCommands = async (appId: string, guildId: string) => verifyGuildCommands(appId, guildId, [
  TEST_COMMAND,
  SIMPLE_CHECK_COMMAND,
  VERBOSE_CHECK_COMMAND
]);