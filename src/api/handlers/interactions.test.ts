const mockedSearchAMLFile = jest.fn();
jest.mock('../../services/search/aml', () => ({
  searchAMLFile: mockedSearchAMLFile,
}));

import { InteractionResponseType, InteractionType } from 'discord-interactions';
import {
  SIMPLE_CHECK_COMMAND,
  TEST_COMMAND,
  VERBOSE_CHECK_COMMAND,
} from '../../services/discord/commands';
import {
  AMLSearchResponse,
  AML_STATUS,
  AML_STATUS_MESSAGES,
  MAX_SEARCH_INPUT_LENGTH,
  MIN_SEARCH_INPUT_LENGTH,
} from '../../services/search/types';
import { Request, Response } from '../utils';
import {
  buildSearchErrorMsg,
  buildSimpleCheckOutput,
  buildVerboseDetailsOutput,
  generateAmlResultsURL,
  handleDiscordInteractions,
} from './interactions';

describe('Interactions Handler Tests', () => {
  describe('discordInteractionsHandler', () => {
    test('returns 400 when req.body is missing', async () => {
      const mockRes = { json: jest.fn() };

      await handleDiscordInteractions(
        {} as Request,
        mockRes as unknown as Response
      );

      expect(mockRes.json.mock.calls[0][0].status).toEqual(400);
    });

    test('returns PONG for PING request', async () => {
      const mockRes = { json: jest.fn() };
      const mockReq = {
        body: {
          type: InteractionType.PING,
        },
      };

      await handleDiscordInteractions(
        mockReq as Request,
        mockRes as unknown as Response
      );

      expect(mockRes.json.mock.calls[0][0]).toEqual({
        type: InteractionResponseType.PONG,
      });
    });

    test('returns 400 when request interation type not supported', async () => {
      const mockRes = { json: jest.fn() };
      const mockReq = {
        body: {
          type: InteractionType.MESSAGE_COMPONENT,
        },
      };

      await handleDiscordInteractions(
        mockReq as Request,
        mockRes as unknown as Response
      );

      expect(mockRes.json.mock.calls[0][0].status).toEqual(400);
    });

    describe('handles application commands', () => {
      const mockAMLSearchRes: AMLSearchResponse = {
        searchTerm: 'test',
        foundMatch: true,
        status: AML_STATUS.NO_MATCH,
        statusMsg: 'Fake Test Status' as AML_STATUS,
        totalMatches: 1,
        matches: [],
        sourceUpdatedAt: Date(),
      };

      test('returns 400 when request interation cmd not supported', async () => {
        const mockRes = { json: jest.fn() };
        const mockReq = {
          body: {
            type: InteractionType.APPLICATION_COMMAND,
            data: {
              name: 'SOME_CMD',
            },
          },
        };

        await handleDiscordInteractions(
          mockReq as Request,
          mockRes as unknown as Response
        );

        expect(mockRes.json.mock.calls[0][0].status).toEqual(400);
      });

      test(`CMD (${TEST_COMMAND.name}) returns 400 when member data is not provided`, async () => {
        const mockRes = { json: jest.fn() };
        const mockReq = {
          body: {
            type: InteractionType.APPLICATION_COMMAND,
            data: {
              name: TEST_COMMAND.name,
            },
            member: null,
          },
        };

        await handleDiscordInteractions(
          mockReq as Request,
          mockRes as unknown as Response
        );

        expect(mockRes.json.mock.calls[0][0].status).toEqual(400);
      });

      test(`CMD (${TEST_COMMAND.name}) returns valid response`, async () => {
        const mockRes = { json: jest.fn() };
        const userId = 'test-userid';
        const mockReq = {
          body: {
            type: InteractionType.APPLICATION_COMMAND,
            data: {
              name: TEST_COMMAND.name,
            },
            member: {
              user: { id: userId },
            },
          },
        };

        await handleDiscordInteractions(
          mockReq as Request,
          mockRes as unknown as Response
        );

        const res = mockRes.json.mock.calls[0][0];
        expect(res.type).toEqual(
          InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE
        );
        expect(res.data.content.includes(userId)).toBeTruthy();
      });

      test(`CMD (${SIMPLE_CHECK_COMMAND.name}) returns 400 when member data is not provided`, async () => {
        const mockRes = { json: jest.fn() };
        const mockReq = {
          body: {
            type: InteractionType.APPLICATION_COMMAND,
            data: {
              name: SIMPLE_CHECK_COMMAND.name,
            },
            member: null,
          },
        };

        await handleDiscordInteractions(
          mockReq as Request,
          mockRes as unknown as Response
        );

        expect(mockRes.json.mock.calls[0][0]).toEqual({
          status: 400,
          error: 'invalid member data',
        });
      });

      test(`CMD (${SIMPLE_CHECK_COMMAND.name}) returns 400 when data options not provided`, async () => {
        const mockRes = { json: jest.fn() };
        const mockReq = {
          body: {
            type: InteractionType.APPLICATION_COMMAND,
            data: {
              name: SIMPLE_CHECK_COMMAND.name,
            },
            member: { user: { id: 'test' } },
          },
        };

        await handleDiscordInteractions(
          mockReq as Request,
          mockRes as unknown as Response
        );

        expect(mockRes.json.mock.calls[0][0]).toEqual({
          status: 400,
          error: 'invalid data.options',
        });
      });

      test(`CMD (${SIMPLE_CHECK_COMMAND.name}) returns invalid response when input term is missing`, async () => {
        const mockRes = { json: jest.fn() };
        const mockReq = {
          body: {
            type: InteractionType.APPLICATION_COMMAND,
            data: {
              name: SIMPLE_CHECK_COMMAND.name,
              options: [],
            },
            member: { user: { id: 'test' } },
          },
        };

        await handleDiscordInteractions(
          mockReq as Request,
          mockRes as unknown as Response
        );

        const res = mockRes.json.mock.calls[0][0];
        expect(res.type).toEqual(
          InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE
        );
        expect(res.data.content.includes('invalid input value')).toBeTruthy();
      });

      test(`CMD (${SIMPLE_CHECK_COMMAND.name}) returns invalid response when input term < ${MIN_SEARCH_INPUT_LENGTH} characters`, async () => {
        const mockRes = { json: jest.fn() };
        const mockReq = {
          body: {
            type: InteractionType.APPLICATION_COMMAND,
            data: {
              name: SIMPLE_CHECK_COMMAND.name,
              options: [{ value: 't' }],
            },
            member: { user: { id: 'test' } },
          },
        };

        await handleDiscordInteractions(
          mockReq as Request,
          mockRes as unknown as Response
        );

        const res = mockRes.json.mock.calls[0][0];
        expect(res.type).toEqual(
          InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE
        );
        expect(res.data.content.includes('invalid input value')).toBeTruthy();
      });

      test(`CMD (${SIMPLE_CHECK_COMMAND.name}) returns invalid response when input term > ${MAX_SEARCH_INPUT_LENGTH} characters`, async () => {
        const mockRes = { json: jest.fn() };
        const mockReq = {
          body: {
            type: InteractionType.APPLICATION_COMMAND,
            data: {
              name: SIMPLE_CHECK_COMMAND.name,
              options: [{ value: 't'.repeat(MAX_SEARCH_INPUT_LENGTH + 1) }],
            },
            member: { user: { id: 'test' } },
          },
        };

        await handleDiscordInteractions(
          mockReq as Request,
          mockRes as unknown as Response
        );

        const res = mockRes.json.mock.calls[0][0];
        expect(res.type).toEqual(
          InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE
        );
        expect(res.data.content.includes('invalid input value')).toBeTruthy();
      });

      test(`CMD (${SIMPLE_CHECK_COMMAND.name}) return error message when search fails`, async () => {
        const mockRes = {
          json: jest.fn(),
        };
        const mockReq = {
          body: {
            type: InteractionType.APPLICATION_COMMAND,
            data: {
              name: SIMPLE_CHECK_COMMAND.name,
              options: [{ value: 'test' }],
            },
            member: { user: { id: 'test' } },
          },
        };
        mockedSearchAMLFile.mockRejectedValueOnce(
          new Error('unexpected error')
        );

        await handleDiscordInteractions(
          mockReq as Request,
          mockRes as unknown as Response
        );

        const res = mockRes.json.mock.calls[0][0];
        expect(res.status).toEqual(500);
        expect(res.type).toEqual(
          InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE
        );
        expect(res.data.content).toEqual(buildSearchErrorMsg());
      });

      test(`CMD (${SIMPLE_CHECK_COMMAND.name}) returns simple response`, async () => {
        const mockRes = {
          json: jest.fn(),
        };
        const mockReq = {
          body: {
            type: InteractionType.APPLICATION_COMMAND,
            data: {
              name: SIMPLE_CHECK_COMMAND.name,
              options: [{ value: 'test' }],
            },
            member: { user: { id: 'test' } },
          },
        };
        mockedSearchAMLFile.mockResolvedValueOnce(mockAMLSearchRes);

        await handleDiscordInteractions(
          mockReq as Request,
          mockRes as unknown as Response
        );

        const res = mockRes.json.mock.calls[0][0];
        expect(res.type).toEqual(
          InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE
        );
        expect(res.data.content).toEqual(
          buildSimpleCheckOutput(mockAMLSearchRes)
        );
      });

      test(`CMD (${VERBOSE_CHECK_COMMAND.name}) returns verbose response`, async () => {
        const mockRes = {
          json: jest.fn(),
        };
        const mockReq = {
          body: {
            type: InteractionType.APPLICATION_COMMAND,
            data: {
              name: VERBOSE_CHECK_COMMAND.name,
              options: [{ value: 'test' }],
            },
            member: { user: { id: 'test' } },
          },
        };
        mockedSearchAMLFile.mockResolvedValueOnce(mockAMLSearchRes);

        await handleDiscordInteractions(
          mockReq as Request,
          mockRes as unknown as Response
        );

        const res = mockRes.json.mock.calls[0][0];
        expect(res.type).toEqual(
          InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE
        );
        const expectedMsg =
          buildSimpleCheckOutput(mockAMLSearchRes) +
          buildVerboseDetailsOutput(mockAMLSearchRes);
        expect(res.data.content).toEqual(expectedMsg);
      });
    });
  });

  describe('buildVerboseDetailsOutput', () => {
    test('builds verbose output limited to max output lines', () => {
      const maxOutputLines = 2;
      const matchedLines = [
        {
          lineNum: 1,
          lineText: 'test line 1',
        },
        {
          lineNum: 2,
          lineText: 'test line 2',
        },
        // this line should not be included in result
        {
          lineNum: 3,
          lineText: 'test line 3',
        },
      ];
      const input: AMLSearchResponse = {
        searchTerm: 'test',
        status: AML_STATUS.NO_MATCH,
        statusMsg: AML_STATUS_MESSAGES[AML_STATUS.NO_MATCH],
        foundMatch: true,
        sourceUpdatedAt: '12/28/22',
        totalMatches: 3,
        matches: [
          {
            blockStart: 0,
            blockEnd: 4,
            totalMatches: 3,
            matchedLines: matchedLines,
          },
        ],
      };

      const result = buildVerboseDetailsOutput(input, maxOutputLines);

      let expectedOutput = `\n **Source List Updated Date**: ${input.sourceUpdatedAt}`;
      expectedOutput += `\n **Found ${input.totalMatches} matches.**`;
      expectedOutput += `. Below are the first ${maxOutputLines} matches:`;
      expectedOutput += `\n \t ⚠ Matches on paragraph from line ${input.matches[0].blockStart} to ${input.matches[0].blockEnd}:`;
      expectedOutput += `\n \t \t - 1) **Line # ${matchedLines[0].lineNum}**: ${matchedLines[0].lineText}`;
      expectedOutput += `\n \t \t - 2) **Line # ${matchedLines[1].lineNum}**: ${matchedLines[1].lineText}`;
      expectedOutput += `\n See full results [here](${generateAmlResultsURL(
        input.searchTerm
      )})`;

      expect(result).toEqual(expectedOutput);
    });
  });
});
