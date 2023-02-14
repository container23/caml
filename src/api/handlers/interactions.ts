import { InteractionType, InteractionResponseType } from 'discord-interactions';
import {
  TEST_COMMAND,
  SIMPLE_CHECK_COMMAND,
  VERBOSE_CHECK_COMMAND,
} from '../../services/discord/commands';
import { getRandomEmoji } from '../../utils';
import {
  searchAMLFile,
 
} from '../../services/search/aml';
import {
  MAX_SEARCH_INPUT_LENGTH,
  MIN_SEARCH_INPUT_LENGTH,
} from '../../services/search/types';
import { Handler, API_BASE_URL } from '../utils/index';
import { AMLSearchResponse } from '../../services/search/types';
import { logger } from '../../utils/logger';

export const handleDiscordInteractions: Handler = async (req, res) => {
  if (!req.body) {
    return res.json({ status: 400, error: 'invalid request body' });
  }
  // Interaction type and data
  // Default to interaction type
  const { type = 2, id } = req.body;
  logger.info(`New Interaction: Type: ${type}, ID: ${id}`);

  if (!type) {
    return res.json({ status: 400, error: 'invalid request type' });
  }
  /**
   * Handle ping checks
   */
  if (type === InteractionType.PING) {
    return res.json({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name: cmdName } = req.body.data || {};
    switch (cmdName) {
    case TEST_COMMAND.name:
      return handleTestCommand(req, res);
    case SIMPLE_CHECK_COMMAND.name:
    case VERBOSE_CHECK_COMMAND.name:
      return handleVerificationChecksCmds(req, res);
    default:
      return res.json({
        status: 400,
        error: `interaction command '${cmdName}' is not supported`
      });
    }
  }
  return res.json({
    status: 400,
    error: `interaction type ${type} not supported`
  });
};

// Handle "test" guild command
const handleTestCommand: Handler = async (req, res) => {
  if (!req.body.member || !req.body.member.user) {
    return res.json({ status: 400, error: 'invalid member data' });
  }
  // Send a message into the channel where command was triggered from
  const userId = req.body.member.user.id;
  return res.json({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: `Hello <@${userId}> ${getRandomEmoji()}. I'm doing okay ;)`,
    },
  });
};

// Handle verifications "check" commmands
const handleVerificationChecksCmds: Handler = async (req, res) => {
  if (!req.body.member || !req.body.member.user) {
    return res.json({ status: 400, error: 'invalid member data' });
  }

  if (!req.body.data || !req.body.data.options) {
    return res.json({ status: 400, error: 'invalid data.options' });
  }

  const { name: cmdName } = req.body.data || {};
  const userId = req.body.member.user.id;
  const inputValue = req.body.data.options[0]?.value; // User's value to check
  const includeExtraDetails = cmdName == VERBOSE_CHECK_COMMAND.name;
  logger.info(
    `New Verification ${cmdName}, UserID: ${userId}, InputValue: ${inputValue}`
  );

  // verify user submitted valid text input
  if (
    !inputValue ||
    inputValue.length < MIN_SEARCH_INPUT_LENGTH ||
    inputValue.length > MAX_SEARCH_INPUT_LENGTH
  ) {
    return res.json({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: `invalid input value. Input must be between ${MIN_SEARCH_INPUT_LENGTH} and ${MAX_SEARCH_INPUT_LENGTH} characters. Please try again.`,
      },
    });
  }
  try {
    const result = await searchAMLFile(inputValue);
    let resultMsg = buildSimpleCheckOutput(result);

    if (includeExtraDetails) {
      resultMsg += buildVerboseDetailsOutput(result);
    }
    // logger.info('Verification results', resultMsg);
    return res.json({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: resultMsg,
      },
    });
  } catch (error) {
    logger.error({
      msg: 'unexpected error searching AML file',
      error: error
    });
    return res.json({
      status: 500,
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: buildSearchErrorMsg(),
      },
    });
  }
};

export const buildSearchErrorMsg = () => 'Oops :/. We had some trouble processing your request. Please try again.';

export const buildSimpleCheckOutput = (result: AMLSearchResponse) =>
  `Verification result for **${result.searchTerm}**: ${result.statusMsg}`;

export const buildVerboseDetailsOutput = (
  result: AMLSearchResponse,
  maxOutputLines = 10
) => {
  let output = `\n **Source List Updated Date**: ${result.sourceUpdatedAt}`;
  output += `\n **Found ${result.totalMatches} match${
    result.totalMatches > 1 ? 'es' : ''
  }.**`;
  if (result.totalMatches > 0) {
    if (result.totalMatches > maxOutputLines) {
      output += `. Below are the first ${maxOutputLines} matches:`;
    }
    let totalLinesAdded = 1;
    for (const m of result.matches) {
      if (totalLinesAdded > maxOutputLines) {
        break;
      }
      output += `\n \t ⚠ Matches on paragraph from line ${m.blockStart} to ${m.blockEnd}:`;
      // add lines
      for (const ml of m.matchedLines) {
        if (totalLinesAdded > maxOutputLines) {
          break;
        }
        output += `\n \t \t - ${totalLinesAdded}) **Line # ${ml.lineNum}**: ${ml.lineText}`;
        totalLinesAdded++;
      }
    }
    output += `\n See full results [here](${generateAmlResultsURL(
      result.searchTerm
    )})`;
  }
  return output;
};

export const generateAmlResultsURL = (searchTerm: string) => {
  // TODO: generate signed token
  const queryParams = `term=${encodeURIComponent(searchTerm)}`;
  return `${API_BASE_URL}/aml/search?${queryParams}`;
};
