import { Response } from 'express';
import { prisma } from '../prisma';
import { createSuccessResponse } from '../utils/response';
import { asyncHandler } from '../middleware/asyncHandler';
import { AuthRequest } from '../middleware/auth.middleware';

export const getNotificationsController = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id; // Assuming authenticate middleware sets req.user
  if (!userId) {
    throw new Error('User not authenticated');
  }

  const limit = parseInt(req.query.limit as string) || 20;

  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit
  });

  res.status(200).json(createSuccessResponse(notifications));
});

export const markNotificationReadController = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    throw new Error('User not authenticated');
  }

  const notification = await prisma.notification.updateMany({
    where: { id, userId },
    data: { isRead: true }
  });

  res.status(200).json(createSuccessResponse({ success: true }));
});

export const markAllNotificationsReadController = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new Error('User not authenticated');
  }

  await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true }
  });

  res.status(200).json(createSuccessResponse({ success: true }));
});
