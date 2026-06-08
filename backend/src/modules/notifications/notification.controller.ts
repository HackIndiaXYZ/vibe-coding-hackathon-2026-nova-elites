import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { notificationService } from './notification.service';
import { createSuccessResponse } from '../../utils/response';
import { getNotificationsQuerySchema, getUnreadCountQuerySchema, notificationIdParamSchema } from './notification.validation';

export class NotificationController {
  async getUserNotifications(req: AuthRequest, res: Response) {
    const userId = req.user!.id;
    const validated = getNotificationsQuerySchema.parse({ query: req.query });

    const result = await notificationService.getUserNotifications(userId, validated.query);
    
    return res.status(200).json(createSuccessResponse(result.items, {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    }));
  }

  async getUnreadCount(req: AuthRequest, res: Response) {
    const userId = req.user!.id;
    const validated = getUnreadCountQuerySchema.parse({ query: req.query });

    const result = await notificationService.getUnreadCount(userId, validated.query.organizationId);

    return res.status(200).json(createSuccessResponse(result));
  }

  async markAsRead(req: AuthRequest, res: Response) {
    const userId = req.user!.id;
    const validated = notificationIdParamSchema.parse({ params: req.params });

    const result = await notificationService.markAsRead(validated.params.id, userId);

    return res.status(200).json(createSuccessResponse(result));
  }

  async markAsUnread(req: AuthRequest, res: Response) {
    const userId = req.user!.id;
    const validated = notificationIdParamSchema.parse({ params: req.params });

    const result = await notificationService.markAsUnread(validated.params.id, userId);

    return res.status(200).json(createSuccessResponse(result));
  }
}

export const notificationController = new NotificationController();
