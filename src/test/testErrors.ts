// src/test/testErrors.ts
import exp_ress, { Request, Response } from 'express';
import { errorHandler } from '../middlewares/errorHandler';
import {
  AppError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
} from '../core/error';
import { logger } from '../core/logger';

const app = exp_ress();
app.use(exp_ress.json());

// Routes to test different errors
app.get('/app-error', (_req: Request, _res: Response) => {
  throw new AppError('This is a generic app error', 501);
});

app.get('/not-found', (_req: Request, _res: Response) => {
  throw new NotFoundError('User not found');
});

app.get('/bad-Request', (_req: Request, _res: Response) => {
  throw new BadRequestError('Invalid Request data');
});

app.get('/unauthorized', (_req: Request, _res: Response) => {
  throw new UnauthorizedError('You are not authorized');
});

app.get('/forbidden', (_req: Request, _res: Response) => {
  throw new ForbiddenError('Access forbidden');
});

// Test a normal error (non-AppError)
app.get('/normal-error', (_req: Request, _res: Response) => {
  throw new Error('Some unexpected error');
});

// Global error handler must be the last middleware
app.use(errorHandler);

// Start server for testing
const PORT = 4001;
app.listen(PORT, () => {
  logger.error(`Test server running on http://localhost:${PORT}`);
});
