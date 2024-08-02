import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { unauthorized } from '../constants/statusCodes';
import logger from './winston';

// Extend the Request interface to include the user property
declare module 'express-serve-static-core' {
  interface Request {
    user?: any; // Adjust the type according to your actual user type
  }
}

interface DecodedToken extends JwtPayload {
  user: string; // Adjust the type according to your actual user type
}

const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(unauthorized).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    ) as DecodedToken;

    req.user = decoded.user;

    console.log('TOKEN USER:', req.user);
    next();
  } catch (error) {
    logger.error(error);
    return res.status(unauthorized).json({ error: 'Invalid token' });
  }
};

export default verifyToken;
