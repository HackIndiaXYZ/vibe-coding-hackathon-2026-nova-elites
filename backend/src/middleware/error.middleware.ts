import { Request, Response, NextFunction } from 'express';
import { createErrorResponse, createMultiErrorResponse } from '../utils/response';
import { ZodError } from 'zod';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (process.env.NODE_ENV !== 'test') {
    console.error(err);
  }

  // --- Zod Validation Errors ---
  if (err instanceof ZodError) {
    const errors = err.errors.map((e: any) => {
      let code = 'VALIDATION_ERROR';
      if (e.path.includes('operationalRegions')) code = 'OPERATIONAL_REGIONS_REQUIRED';
      else if (e.path.includes('phoneNumber')) code = 'INVALID_PHONE_NUMBER';
      else if (e.code === 'invalid_type' && e.received === 'undefined') code = 'MISSING_REQUIRED_FIELD';
      return { code, message: `${e.path.join('.')}: ${e.message}` };
    });
    return res.status(400).json(createMultiErrorResponse(errors));
  }

  // --- Custom domain errors ---
  if (err.statusCode) {
    let code = 'UNKNOWN_ERROR';
    if (err.statusCode === 400) code = 'VALIDATION_ERROR';
    else if (err.statusCode === 401) code = 'UNAUTHORIZED';
    else if (err.statusCode === 403) code = 'FORBIDDEN';
    else if (err.statusCode === 404) code = 'NOT_FOUND';
    return res.status(err.statusCode).json(createErrorResponse(err.message, code));
  }

  // --- Prisma Known Request Errors ---
  if (err.name === 'PrismaClientKnownRequestError') {
    if (err.code === 'P2002') {
      const targetStr = JSON.stringify(err.meta?.target || '');
      const code = targetStr.includes('registrationNumber')
        ? 'REGISTRATION_NUMBER_ALREADY_EXISTS'
        : 'DUPLICATE_RESOURCE';
      return res.status(409).json(createErrorResponse('A unique constraint would be violated.', code));
    }
    if (err.code === 'P2025') {
      return res.status(404).json(createErrorResponse('Record not found.', 'ORGANIZATION_NOT_FOUND'));
    }
    return res.status(400).json(createErrorResponse('Database constraint violation.', 'VALIDATION_ERROR'));
  }

  // --- String-matching fallbacks for unrefactored throws ---
  const msg = err.message || '';
  if (msg.includes('not found')) {
    return res.status(404).json(createErrorResponse(msg, 'ORGANIZATION_NOT_FOUND'));
  }
  if (msg.includes('transition') || msg.includes('exceed') || msg.includes('must be')) {
    return res.status(409).json(createErrorResponse(msg, 'VALIDATION_ERROR'));
  }
  if (msg.includes('Only the organization')) {
    return res.status(403).json(createErrorResponse(msg, 'FORBIDDEN'));
  }

  // --- Catch-all ---
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json(createErrorResponse(message, 'UNKNOWN_ERROR'));
}
