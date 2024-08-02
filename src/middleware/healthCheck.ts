import { Request, Response, NextFunction } from 'express';

const healthCheck = (
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  res.status(200).json({ status: 'ok' });
};

export default healthCheck;
