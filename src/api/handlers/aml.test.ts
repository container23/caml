const mockedSearchAMLFile = jest.fn();
jest.mock('../../services/search/aml', () => ({
  searchAMLFile: mockedSearchAMLFile,
}));

import { Request, Response, mockReqRes } from '../utils';
import { handleAMLSearch } from './aml';
import { AMLSearchResponse, AML_STATUS } from '../../services/search/types';

describe('AML Search Handler', () => {
  const mockAMLSearchRes: AMLSearchResponse = {
    searchTerm: 'test',
    foundMatch: true,
    status: AML_STATUS.SAFE,
    statusMsg: 'Fake Test Status' as AML_STATUS,
    totalMatches: 1,
    matches: [],
    sourceUpdatedAt: Date(),
  };

  afterEach(() => {
    mockedSearchAMLFile.mockReset();
    mockedSearchAMLFile.mockRestore();
  });

  test('sends 404 when missing search term', async () => {
    const mockRes = { json: jest.fn() };
    const { req, res } = mockReqRes(null, mockRes);

    await handleAMLSearch(req as Request, res as Response);

    expect(mockRes.json.mock.calls[0][0].status).toEqual(400);
  });

  test('sends 500 when search fails', async () => {
    const mockReq = {
      query: { term: 'test' },
    };
    const mockRes = { json: jest.fn() };
    const { req, res } = mockReqRes(mockReq, mockRes);

    mockedSearchAMLFile.mockRejectedValue(new Error('unexpected'));

    const r = await handleAMLSearch(req as Request, res as Response);

    expect(r).toBeUndefined();
    expect(mockRes.json.mock.calls[0][0].status).toEqual(500);
  });

  test('sends JSON response when content-type = application/json', async () => {
    const mockReq = {
      query: { term: 'test' },
      get: () => 'application/json',
    };
    const mockRes = { json: jest.fn() };
    const { req, res } = mockReqRes(mockReq, mockRes);

    mockedSearchAMLFile.mockResolvedValue(mockAMLSearchRes);

    await handleAMLSearch(req as Request, res as Response);

    expect(mockRes.json.mock.calls[0][0]).toEqual(mockAMLSearchRes);
  });

  test('renders aml-results page when content-type not json', async () => {
    const mockReq = {
      query: { term: 'test' },
      get: () => 'text/plain',
    };
    const mockRes = { render: jest.fn() };
    const { req, res } = mockReqRes(mockReq, mockRes);

    mockedSearchAMLFile.mockResolvedValue(mockAMLSearchRes);

    await handleAMLSearch(req as Request, res as Response);

    expect(mockRes.render.mock.calls[0][0]).toEqual('aml-results');
    expect(mockRes.render.mock.calls[0][1]).toEqual({ data: mockAMLSearchRes });
  });
});
