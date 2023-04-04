import { Request, Response, NextFunction } from '../utils';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(err)
  }

  res.status(500);
  if (req.get('Content-Type') === 'application/json') {
    res.json({ error: err });
  } else {
    res.render('error', { error: err });
  }
};

export default errorHandler
