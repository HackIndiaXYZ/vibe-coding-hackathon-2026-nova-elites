import { z } from 'zod';

export const getActivityQuerySchema = z.object({
  query: z.object({
    limit: z.string().regex(/^\d+$/).transform(Number)
      .refine(val => val > 0 && val <= 50, { message: 'Limit must be between 1 and 50' })
      .default('10'),
  }),
});
