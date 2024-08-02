import { Response, NextFunction } from 'express';
import validator from '../middleware/validator';

describe('Validator Middleware', () => {
  it('should remove creation_date if present and set it to today', () => {
    const req: any = {
      body: {
        creation_date: '2024-08-01',
        someField: 'value',
      },
    };
    const res: Response = {} as Response;
    const next: NextFunction = jest.fn();

    validator(req, res, next);

    expect(req.body.creation_date).toBe(new Date().toJSON().slice(0, 10));
    expect(req.body.someField).toBe('value');
    expect(next).toHaveBeenCalled();
  });

  it('should set empty values to null', () => {
    const req: any = {
      body: {
        someField: '',
      },
    };
    const res: Response = {} as Response;
    const next: NextFunction = jest.fn();

    validator(req, res, next);

    expect(req.body.someField).toBe(null);
    expect(next).toHaveBeenCalled();
  });
});
