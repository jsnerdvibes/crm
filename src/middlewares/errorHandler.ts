import { Request, Response, NextFunction } from 'express';
import { AppError } from '../core/error';
import { errorResponse } from '../utils/response';
import { logger } from '../core/logger';
import { config } from '../config';
import { ValidationErrorItem } from '../types/errorType';

export function errorHandler(
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // Log error (can replace with pino/winston)
  logger.error(err);

  let statusCode = 500;
  let message = 'Something went wrong';
  let errors: ValidationErrorItem[] = [];

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors ?? [];

    return res.status(statusCode).json({
      ...errorResponse(message, errors),
      ...(config.app.env === 'development' && { stack: err.stack }),
    });
  }

  res.status(statusCode).json(errorResponse(message, errors));
}
