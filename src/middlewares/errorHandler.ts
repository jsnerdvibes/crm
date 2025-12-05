import { Request, Response, NextFunction } from 'express';
import { AppError } from '../core/error';
import { errorResponse } from '../utils/response';
import { logger } from '../core/logger';
import { config } from '../config';

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Log error (can replace with pino/winston)
  logger.error(err);

  let statusCode = 500;
  let message = 'Something went wrong';
  let errors: any[] = [];

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    const errors = (err as any).errors || [];
    return res.status(statusCode).json({
      ...errorResponse(message, errors),
      ...(config.app.env === 'development' && { stack: err.stack }),
    });
  }

  res.status(statusCode).json(errorResponse(message, errors));
}
