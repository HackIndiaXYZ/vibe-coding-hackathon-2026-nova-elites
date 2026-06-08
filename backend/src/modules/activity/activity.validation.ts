import { z } from 'zod';

export const getActivityQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  }),
});

export const organizationActivityParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid organization ID format'),
  }),
});

export const operationActivityParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid operation ID format'),
  }),
});
