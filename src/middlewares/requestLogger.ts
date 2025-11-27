import { Request, Response, NextFunction } from 'express';
import { logger } from '../core/logger';

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();

  // Log basic request info
  logger.info(
    {
      method: req.method,
      url: req.url,
      query: req.query,
      body: req.body,
    },
    'Incoming request'
  );

  // Capture response time
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(
      {
        method: req.method,
        url: req.url,
        status: res.statusCode,
        duration: `${duration}ms`,
      },
      'Request completed'
    );
  });

  next();
};
