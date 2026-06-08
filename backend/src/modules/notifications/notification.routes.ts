import { Router } from 'express';
import { notificationController } from './notification.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { asyncHandler } from '../../middleware/asyncHandler';

const router = Router();

// ALL routes require authentication
router.use(authenticate);

router.get('/', asyncHandler(notificationController.getUserNotifications));
router.get('/unread-count', asyncHandler(notificationController.getUnreadCount));
router.patch('/:id/read', asyncHandler(notificationController.markAsRead));
router.patch('/:id/unread', asyncHandler(notificationController.markAsUnread));

export default router;
