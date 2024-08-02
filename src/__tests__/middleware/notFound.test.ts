import { Request, Response } from 'express';
import notFoundMiddleware from '../../middleware/notFound';

describe('Not Found Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should return 404 with error message "Not Found"', () => {
    notFoundMiddleware(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: {
        message: 'Not Found',
      },
    });
  });
});
