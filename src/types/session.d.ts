import session from 'express-session';
import { Request } from 'express';

declare module 'express-session' {
  interface SessionData {
    user: { _id: string };
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      email: string;
      _id: string;
    };
  }
}
