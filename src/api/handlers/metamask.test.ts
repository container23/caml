import { mockReqRes, Request, Response } from '../utils';
import { handleMetamaskPage } from './metamask';

describe('Metamask Page Handler', () => {
  test('renders metamask view with data', async () => {
    const mockRes = {
      locals: { gtmId: 'GA-FAKE-ID' },
      render: jest.fn(),
    };
    const { req, res } = mockReqRes(null, mockRes);

    await handleMetamaskPage(req as Request, res as Response);

    expect(mockRes.render.mock.calls[0][0]).toEqual('metamask');
    expect(mockRes.render.mock.calls[0][1]).toEqual({
      gtmId: mockRes.locals.gtmId,
    });
  });
});
