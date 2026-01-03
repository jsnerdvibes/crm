import { ValidationErrorItem } from '../types/errorType';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errors?: ValidationErrorItem[];

  constructor(
    message: string,
    statusCode: number,
    errors?: ValidationErrorItem[]
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad request') {
    super(message, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

export class UnprocessableEntityError extends AppError {
  public errors: ValidationErrorItem[];

  constructor(
    message = 'Unprocessable Entity',
    errors: ValidationErrorItem[] = []
  ) {
    super(message, 422);
    this.errors = errors;
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict') {
    super(message, 409);
  }
}
