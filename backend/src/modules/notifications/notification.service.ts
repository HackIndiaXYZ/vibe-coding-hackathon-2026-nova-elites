import { prisma } from '../../prisma';
import { NotFoundError, AuthorizationError, ValidationError } from '../../utils/errors';
import { CreateNotificationDto, NotificationQueryFilters, PaginatedNotifications } from './notification.types';
import { NotificationMapper } from './notification.mapper';

export class NotificationService {
  async createNotification(data: CreateNotificationDto) {
    if (!data.userId) {
      throw new ValidationError('UserId is required');
    }

    const notification = await prisma.notification.create({
      data: {
        userId: data.userId,
        organizationId: data.organizationId || null,
        type: data.type,
        title: data.title,
        body: data.body,
        metadata: data.metadata as any,
        isRead: false,
      },
    });

    return NotificationMapper.toResponse(notification);
  }

  async markAsRead(id: string, userId: string) {
    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundError('Notification not found');
    }

    if (notification.userId !== userId) {
      throw new AuthorizationError('Only the notification owner can mark it as read');
    }

    if (notification.isRead) {
      return NotificationMapper.toResponse(notification);
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    return NotificationMapper.toResponse(updated);
  }

  async markAsUnread(id: string, userId: string) {
    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundError('Notification not found');
    }

    if (notification.userId !== userId) {
      throw new AuthorizationError('Only the notification owner can mark it as unread');
    }

    if (!notification.isRead) {
      return NotificationMapper.toResponse(notification);
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: false },
    });

    return NotificationMapper.toResponse(updated);
  }

  async getUserNotifications(userId: string, filters: NotificationQueryFilters): Promise<PaginatedNotifications> {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = { userId };

    if (filters.isRead !== undefined) {
      where.isRead = filters.isRead;
    }

    if (filters.organizationId) {
      where.organizationId = filters.organizationId;
    }

    const [total, items] = await prisma.$transaction([
      prisma.notification.count({ where }),
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      items: NotificationMapper.toResponseList(items),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getUnreadCount(userId: string, organizationId?: string) {
    const where: any = { userId, isRead: false };
    
    if (organizationId) {
      where.organizationId = organizationId;
    }

    const count = await prisma.notification.count({ where });
    return { count };
  }
}

export const notificationService = new NotificationService();
