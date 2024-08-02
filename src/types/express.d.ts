import { Request } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    session: {
      user: {
        _id: string;
        email: string;
      };
    };
  }
}
