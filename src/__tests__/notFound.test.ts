import { Request, Response, NextFunction } from 'express';
import notFound from '../middleware/notFound'; // Adjust path as needed

describe('NotFound Middleware', () => {
  it('should return a 404 status and error message', () => {
    const req: Partial<Request> = {} as Partial<Request>;
    const res: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as Partial<Response>;
    const next: NextFunction = jest.fn();

    notFound(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith('Not Found');
  });
});
