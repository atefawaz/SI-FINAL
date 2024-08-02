import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import verifyToken from '../middleware/authentication'; // Adjust path as needed
import { unauthorized } from '../constants/statusCodes';

// Mocking the jwt.verify function
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

describe('Authentication Middleware', () => {
  it('should call next if the token is valid', () => {
    const req: Partial<Request> = {
      header: jest.fn().mockReturnValue('Bearer validtoken'),
    };
    const res: Partial<Response> = {} as Partial<Response>;
    const next: NextFunction = jest.fn();

    (jwt.verify as jest.Mock).mockReturnValue({
      user: { id: '123', email: 'test@example.com' },
    });

    verifyToken(req as Request, res as Response, next);

    expect((req as any).user).toEqual({ id: '123', email: 'test@example.com' });
    expect(next).toHaveBeenCalled();
  });

  it('should return 401 if there is no token', () => {
    const req: Partial<Request> = {
      header: jest.fn().mockReturnValue(null),
    };
    const res: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;
    const next: NextFunction = jest.fn();

    verifyToken(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(unauthorized);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
  });

  it('should return 401 if the token is invalid', () => {
    const req: Partial<Request> = {
      header: jest.fn().mockReturnValue('Bearer invalidtoken'),
    };
    const res: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;
    const next: NextFunction = jest.fn();

    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    verifyToken(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(unauthorized);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token' });
  });
});
