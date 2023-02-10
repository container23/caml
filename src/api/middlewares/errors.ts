import { Request, Response, NextFunction } from '../utils';

export const errorHandler = (
  err: Error,
  _: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(err)
  }
  res.status(500).render('error', { error: err });
};

export default errorHandler
