import { Router } from 'express';
import { activityController } from './activity.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requireOrganizationAccess, requireEventAccess } from '../../middleware/authorization.middleware';
import { asyncHandler } from '../../middleware/asyncHandler';

const router = Router();

// ALL routes require authentication
router.use(authenticate);

// Organization feed: Accessible by members
router.get(
  '/organizations/:id',
  requireOrganizationAccess(['OWNER', 'ADMIN', 'COORDINATOR', 'VOLUNTEER']),
  asyncHandler(activityController.getOrganizationActivity)
);

// Operation feed: Accessible by coordinators/admins (or volunteers if permitted, but we stick to EventAccess defaults)
router.get(
  '/operations/:id',
  requireEventAccess(['OWNER', 'ADMIN', 'COORDINATOR', 'VOLUNTEER']),
  asyncHandler(activityController.getOperationActivity)
);

export default router;
