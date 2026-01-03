import { AppError } from '../core/error';

export const successResponse = (message: string, data: unknown = {}) => ({
  status: 'success',
  message,
  data,
  errors: [],
});

// utils/response.ts
export const errorResponse = <T = unknown>(
  message: string,
  errors: T[] = []
) => ({
  status: 'error',
  message,
  data: {},
  errors,
});
