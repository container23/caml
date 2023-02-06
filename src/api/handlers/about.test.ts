import { DISCORD_BOT_AUTH_URL, mockReqRes, Request, Response } from '../utils';
import { handleAbout } from './about';

describe('About Handler', () => {
  test('renders about view with data', async () => {
    const mockRes = {
      locals: { gtmId: 'GA-FAKE-ID' },
      render: jest.fn(),
    };
    const { req, res } = mockReqRes(null, mockRes);

    await handleAbout(req as Request, res as Response);

    expect(mockRes.render.mock.calls[0][0]).toEqual('about');
    expect(mockRes.render.mock.calls[0][1]).toEqual({
      gtmId: mockRes.locals.gtmId,
      discordBotAuth: DISCORD_BOT_AUTH_URL,
    });
  });
});
