import { Response } from 'express';

/**
 * Volunteer module response helpers.
 * These MUST mirror the frozen envelope shape from src/utils/response.ts.
 *
 * Shape: { success, data, meta, errors }
 */

export function sendSuccess(res: Response, data: any, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data,
    meta: {},
    errors: [],
  });
}

export function sendError(res: Response, message: string, statusCode = 500, code: string = 'UNKNOWN_ERROR') {
  return res.status(statusCode).json({
    success: false,
    data: null,
    meta: {},
    errors: [{ code, message }],
  });
}
