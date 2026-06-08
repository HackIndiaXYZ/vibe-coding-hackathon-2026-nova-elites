import { Router } from 'express';
import { getNotificationsController, markNotificationReadController, markAllNotificationsReadController } from '../controllers/notification.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, getNotificationsController);
router.patch('/read-all', authenticate, markAllNotificationsReadController);
router.patch('/:id/read', authenticate, markNotificationReadController);

export default router;
