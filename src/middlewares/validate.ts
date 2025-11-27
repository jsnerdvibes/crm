import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { UnprocessableEntityError } from '../core/error';

export const validate =
  (schema: ZodSchema<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const zodError = result.error as ZodError; // remove <any>, ZodError already generic
      const errors = zodError.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      return next(new UnprocessableEntityError('Validation failed', errors));
    }

    req.body = result.data; // sanitized
    next();
  };
