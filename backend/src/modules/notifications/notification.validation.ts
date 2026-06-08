import { z } from 'zod';

export const createNotificationSchema = z.object({
  body: z.object({
    type: z.string().min(1, 'Type is required'),
    title: z.string().min(1, 'Title is required'),
    body: z.string().min(1, 'Body is required'),
    organizationId: z.string().uuid().optional().nullable(),
    metadata: z.record(z.unknown()).optional().nullable(),
  }),
});

export const getNotificationsQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    isRead: z.enum(['true', 'false']).transform(val => val === 'true').optional(),
    organizationId: z.string().uuid().optional(),
  }),
});

export const getUnreadCountQuerySchema = z.object({
  query: z.object({
    organizationId: z.string().uuid().optional(),
  }),
});

export const notificationIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid notification ID format'),
  }),
});
