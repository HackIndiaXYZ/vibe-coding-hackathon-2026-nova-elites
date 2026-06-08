import { Notification } from '@prisma/client';

export interface CreateNotificationDto {
  userId: string;
  organizationId?: string | null;
  type: string;
  title: string;
  body: string;
  metadata?: Record<string, unknown> | null;
}

export interface NotificationQueryFilters {
  page?: number;
  limit?: number;
  isRead?: boolean;
  organizationId?: string;
}

export interface NotificationResponse {
  id: string;
  userId: string;
  organizationId: string | null;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface PaginatedNotifications {
  items: NotificationResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
