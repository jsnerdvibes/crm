import { Request, Response, NextFunction } from "express";
import { AppError } from "../core/error";

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err); // optional: integrate with logger

  // Default error values
  let statusCode = 500;
  let message = "Something went wrong";

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    // optionally include stack in dev
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}
