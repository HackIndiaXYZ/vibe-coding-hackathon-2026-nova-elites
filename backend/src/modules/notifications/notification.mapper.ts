import { Notification } from '@prisma/client';
import { NotificationResponse } from './notification.types';

export class NotificationMapper {
  static toResponse(notification: Notification): NotificationResponse {
    return {
      id: notification.id,
      userId: notification.userId,
      organizationId: notification.organizationId,
      type: notification.type,
      title: notification.title,
      body: notification.body,
      isRead: notification.isRead,
      metadata: notification.metadata as Record<string, unknown> | null,
      createdAt: notification.createdAt.toISOString(),
    };
  }

  static toResponseList(notifications: Notification[]): NotificationResponse[] {
    return notifications.map(NotificationMapper.toResponse);
  }
}
