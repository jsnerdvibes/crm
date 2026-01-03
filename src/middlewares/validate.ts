import { ZodSchema, ZodTypeAny, ZodError } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { UnprocessableEntityError } from '../core/error';
import { sanitizeObject } from '../utils/sanitize';

export const validate =
  <T extends ZodTypeAny>(schema: ZodSchema<T['_output']>) =>
  (req: Request, _res: Response, next: NextFunction) => {
    // sanitize request
    req.body = sanitizeObject(req.body);

    const result = schema.safeParse(req.body);

    if (!result.success) {
      const zodError = result.error as ZodError;
      const errors = zodError.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      return next(new UnprocessableEntityError('Validation failed', errors));
    }

    // sanitize the validated data
    req.body = sanitizeObject(result.data);

    next();
  };
