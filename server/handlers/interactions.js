import {
    InteractionType,
    InteractionResponseType,
  } from 'discord-interactions';
import { getRandomEmoji } from '../../utils/index.js';

export const handleInteractions = async (req, res) => {
    // Interaction type and data
    const { type, id, data } = req.body;
    console.log(`New Interaction: Type: ${type}, ID: ${id}, Data: ${data}`);

    /**
     * Handle verification requests
     */
    if (type === InteractionType.PING) {
        return res.send({ type: InteractionResponseType.PONG });
    }

    /**
     * Handle slash command requests
     * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
     */
    if (type === InteractionType.APPLICATION_COMMAND) {
        const { name } = data;
        const userId = req.body.member.user.id;

        // Handle "test" guild command
        if (name === TEST_COMMAND.name) {
            // Send a message into the channel where command was triggered from
            return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: `Hello <@${userId}> ${getRandomEmoji()}. I'm doing okay ;)`,
                },
            });
        }

        // Handle verifications "check" commmands
        if (name === SIMPLE_CHECK_COMMAND.name || name == VERBOSE_CHECK_COMMAND.name) {
            const userId = req.body.member.user.id;
            // User's value to check
            const inputValue = req.body.data.options[0].value;
            const includeExtraDetails = name == VERBOSE_CHECK_COMMAND.name;
            console.log(`New Verification Check, UserID: ${userId}, InputValue: ${inputValue}`);

            // verify user submitted valid text input
            if (!inputValue || inputValue.length < 4 || inputValue.length > 80) {
                return res.send({
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: {
                        content: `Invalid input value. Input must be between 4 and 80 characters. Please try again.`,
                    },
                });
            }

            const result = checkValueOnAML(inputValue);
            let resultMsg = `Verification result for **${inputValue}**: ${result.statusMsg}`;

            if (includeExtraDetails) {
                resultMsg += `\n - Source List Updated Date: **${result.sourceDate}**`
                resultMsg += `\n - Matched Details: **<this feature is under development>**`
            }
            console.log('Verification results', resultMsg);
            return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: resultMsg,
                },
            });
        }
    }
}