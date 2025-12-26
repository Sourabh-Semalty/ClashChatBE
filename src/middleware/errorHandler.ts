import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

interface MongoError extends Error {
  code?: number;
  keyPattern?: Record<string, number>;
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    sendError(res, 'Validation error', err.message, 400);
    return;
  }

  if (err.name === 'CastError') {
    sendError(res, 'Invalid ID format', err.message, 400);
    return;
  }

  const mongoErr = err as MongoError;
  if (mongoErr.code === 11000 && mongoErr.keyPattern) {
    const field = Object.keys(mongoErr.keyPattern)[0];
    sendError(res, `${field} already exists`, 'Duplicate entry', 409);
    return;
  }

  sendError(res, 'Internal server error', err.message, 500);
};

export const notFound = (req: Request, res: Response): void => {
  sendError(res, 'Route not found', `Cannot ${req.method} ${req.path}`, 404);
};
