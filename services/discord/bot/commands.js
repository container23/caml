import { discordRequest } from '../../discord/index.js';

export async function hasGuildCommands(appId, guildId, commands) {
  if (guildId === '' || appId === '') return;

  commands.forEach((c) => hasGuildCommand(appId, guildId, c));
}

// Checks for a command
async function hasGuildCommand(appId, guildId, command) {
  // API endpoint to get and post guild commands
  const endpoint = `applications/${appId}/guilds/${guildId}/commands`;

  try {
    const res = await discordRequest(endpoint, { method: 'GET' });
    const data = await res.json();

    if (data) {
      const installedNames = data.map((c) => c['name']);
      // This is just matching on the name, so it's not good for updates
      if (!installedNames.includes(command['name'])) {
        console.log(`Installing "${command['name']}"`);
        installGuildCommand(appId, guildId, command);
      } else {
        console.log(`"${command['name']}" command already installed`);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

// Installs a command
export const installGuildCommand = async (appId, guildId, command) => {
  // API endpoint to get and post guild commands
  const endpoint = `applications/${appId}/guilds/${guildId}/commands`;
  // install command
  try {
    await discordRequest(endpoint, { method: 'POST', body: command });
  } catch (err) {
    console.error(err);
  }
}


/**
 * COMMANDS DEFINITIONS
 */

export const MIN_INPUT_LENGTH = 2;
export const MAX_INPUT_LENGTH = 80;

// Simple test "health check" command
export const TEST_COMMAND = {
  name: 'test',
  description: 'Basic health check command',
  type: 1,
};

// Define requirements for Check command
export const SIMPLE_CHECK_COMMAND = {
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

export const VERBOSE_CHECK_COMMAND = {
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
export const initCommands = async (appId, guildId) => hasGuildCommands(appId, guildId, [
  TEST_COMMAND,
  SIMPLE_CHECK_COMMAND,
  VERBOSE_CHECK_COMMAND
]);