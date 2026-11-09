import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { ENV } from '../../config/env';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    });
  }

  console.error('[Unhandled Error]', err);

  return res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message:
        ENV.NODE_ENV === 'production'
          ? 'An internal error occurred'
          : err.message,
    },
  });
}
