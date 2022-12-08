import { Express, Request, Response, NextFunction } from 'express';

export type Handler = (
  req: Request,
  res: Response,
  next?: NextFunction
) => Promise<Response | void> | void;

export type Server = Express
export { Request, Response, NextFunction }