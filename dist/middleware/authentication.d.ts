import { Request, Response, NextFunction } from 'express';
declare const verifyToken: (req: Request, res: Response, next: NextFunction) => any;
export default verifyToken;
