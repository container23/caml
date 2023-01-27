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

export const asyncHandler =
  (fn: Function): Handler =>
  (req, res, next) => {
    fn(req, res, next).catch(next);
  };
