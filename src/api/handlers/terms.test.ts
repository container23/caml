import { mockReqRes, Request, Response } from '../utils';
import { handleTerms } from './terms';

describe('Terms of Service Handler', () => {
  test('renders terms view', async () => {
    const mockRes = {
      render: jest.fn(),
    };
    const { req, res } = mockReqRes(null, mockRes);

    await handleTerms(req as Request, res as Response);

    expect(mockRes.render.mock.calls[0][0]).toEqual('terms');
  });
});
