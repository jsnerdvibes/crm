import { Request, Response, NextFunction } from 'express';
import { logger } from '../core/logger';

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info(`${req.method} ${req.url}`);
  next();
};
