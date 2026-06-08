import { Router } from 'express';
import { dashboardController } from './dashboard.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { asyncHandler } from '../../middleware/asyncHandler';

const router = Router();

router.use(authenticate);

router.get('/overview', asyncHandler(dashboardController.getOverview));
router.get('/resources', asyncHandler(dashboardController.getResources));
router.get('/volunteers', asyncHandler(dashboardController.getVolunteers));
router.get('/activity', asyncHandler(dashboardController.getActivity));

export default router;
