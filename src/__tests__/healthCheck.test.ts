import { Request, Response, NextFunction } from 'express';
import healthCheck from '../middleware/healthCheck'; // Adjust path as needed

describe('HealthCheck Middleware', () => {
  it('should return a 200 status and health status message', () => {
    const req: Partial<Request> = {} as Partial<Request>;
    const res: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;
    const next: NextFunction = jest.fn();

    healthCheck(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ status: 'ok' });
  });
});
