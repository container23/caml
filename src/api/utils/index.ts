import { Express, Request, Response, NextFunction } from 'express';

export const API_BASE_URL =
  process.env.API_BASE_URL || `localhost:${process.env.PORT || 8080}`;
export const DISCORD_BOT_AUTH_URL = process.env.DISCORD_BOT_AUTH_URL;

export type Handler = (
  req: Request,
  res: Response,
  next?: NextFunction
) => Promise<Response | void> | void;

export type Server = Express;
export { Request, Response, NextFunction };

// Test Mocks
export const mockReqRes = (mockReq?: unknown, mockRes?: unknown) => {
  const req = mockReq || {
    query: {},
    headers: {},
  };
  const res = mockRes || {
    send: jest.fn(),
    json: jest.fn(),
    render: jest.fn(),
  };
  return { req, res };
};