import { DiscordRequest } from './utils.js';

export async function HasGuildCommands(appId, guildId, commands) {
  if (guildId === '' || appId === '') return;

  commands.forEach((c) => HasGuildCommand(appId, guildId, c));
}

// Checks for a command
async function HasGuildCommand(appId, guildId, command) {
  // API endpoint to get and post guild commands
  const endpoint = `applications/${appId}/guilds/${guildId}/commands`;

  try {
    const res = await DiscordRequest(endpoint, { method: 'GET' });
    const data = await res.json();

    if (data) {
      const installedNames = data.map((c) => c['name']);
      // This is just matching on the name, so it's not good for updates
      if (!installedNames.includes(command['name'])) {
        console.log(`Installing "${command['name']}"`);
        InstallGuildCommand(appId, guildId, command);
      } else {
        console.log(`"${command['name']}" command already installed`);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

// Installs a command
export async function InstallGuildCommand(appId, guildId, command) {
  // API endpoint to get and post guild commands
  const endpoint = `applications/${appId}/guilds/${guildId}/commands`;
  // install command
  try {
    await DiscordRequest(endpoint, { method: 'POST', body: command });
  } catch (err) {
    console.error(err);
  }
}


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
      min_length: 2,
      max_length: 80,
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
      min_length: 2,
      max_length: 80,
      required: true
    },
  ],
  type: 1,
};
