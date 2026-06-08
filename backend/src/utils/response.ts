/**
 * Frozen API Envelope — DO NOT MODIFY SHAPE
 *
 * All frontend-facing responses MUST follow:
 *   { success: boolean, data: T | null, meta: object, errors: ErrorEntry[] }
 *
 * This is a platform guarantee once frontend ships.
 */

export interface ErrorEntry {
  code: string;
  message: string;
}

export interface ApiEnvelope<T> {
  success: boolean;
  data: T | null;
  meta: Record<string, unknown>;
  errors: ErrorEntry[];
}

export function createSuccessResponse<T>(data: T, meta: Record<string, unknown> = {}): ApiEnvelope<T> {
  return {
    success: true,
    data,
    meta,
    errors: [],
  };
}

export function createErrorResponse(
  message: string,
  code: string = 'UNKNOWN_ERROR',
  meta: Record<string, unknown> = {}
): ApiEnvelope<null> {
  return {
    success: false,
    data: null,
    meta,
    errors: [{ code, message }],
  };
}

export function createMultiErrorResponse(
  errors: ErrorEntry[],
  meta: Record<string, unknown> = {}
): ApiEnvelope<null> {
  return {
    success: false,
    data: null,
    meta,
    errors,
  };
}
