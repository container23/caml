import { DISCORD_BOT_AUTH_URL, mockReqRes, Request, Response } from '../utils';
import { handleHome } from './home';

describe('Home Handler', () => {
  test('renders home view with data', async () => {
    const mockRes = {
      locals: { gtmId: 'GA-FAKE-ID' },
      render: jest.fn(),
    };
    const { req, res } = mockReqRes(null, mockRes);

    await handleHome(req as Request, res as Response);

    expect(mockRes.render.mock.calls[0][0]).toEqual('home');
    expect(mockRes.render.mock.calls[0][1]).toEqual({
      gtmId: mockRes.locals.gtmId,
      discordBotAuth: DISCORD_BOT_AUTH_URL,
    });
  });
});
