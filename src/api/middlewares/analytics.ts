import { NextFunction, Request, Response } from 'express';
import { gtmId } from '../../utils/analytics';

const trackReq = (req: Request, res: Response, next: NextFunction) => {
  res.locals.gtmId = gtmId;
  // todo track custom events
  next();
};

export const trackRequest = () => trackReq;