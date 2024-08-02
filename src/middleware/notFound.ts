import { Request, Response, NextFunction } from 'express';

const notFound = (_req: Request, res: Response, _next: NextFunction): void => {
  res.status(404).send('Not Found');
};

export default notFound;
