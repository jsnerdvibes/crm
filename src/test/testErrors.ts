// src/test/testErrors.ts
import express, { Request, Response, NextFunction } from 'express';
import { errorHandler } from '../middlewares/errorHandler';
import {
  AppError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
} from '../core/error';
import { logger } from '../core/logger';

const app = express();
app.use(express.json());

// Routes to test different errors
app.get('/app-error', (req: Request, res: Response) => {
  throw new AppError('This is a generic app error', 501);
});

app.get('/not-found', (req: Request, res: Response) => {
  throw new NotFoundError('User not found');
});

app.get('/bad-request', (req: Request, res: Response) => {
  throw new BadRequestError('Invalid request data');
});

app.get('/unauthorized', (req: Request, res: Response) => {
  throw new UnauthorizedError('You are not authorized');
});

app.get('/forbidden', (req: Request, res: Response) => {
  throw new ForbiddenError('Access forbidden');
});

// Test a normal error (non-AppError)
app.get('/normal-error', (req: Request, res: Response) => {
  throw new Error('Some unexpected error');
});

// Global error handler must be the last middleware
app.use(errorHandler);

// Start server for testing
const PORT = 4001;
app.listen(PORT, () => {
  logger.error(`Test server running on http://localhost:${PORT}`);
});
