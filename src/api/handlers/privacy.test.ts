import { mockReqRes, Request, Response } from '../utils';
import { handlePrivacy } from './privacy';

describe('Privacy Policy Handler', () => {
  test('renders privacy view', async () => {
    const mockRes = {
      render: jest.fn(),
    };
    const { req, res } = mockReqRes(null, mockRes);

    await handlePrivacy(req as Request, res as Response);

    expect(mockRes.render.mock.calls[0][0]).toEqual('privacy');
  });
});
