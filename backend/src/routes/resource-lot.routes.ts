import { Router } from 'express';
import { createResourceLotController, getResourceLotsController, getResourceLotController, updateResourceLotController } from '../controllers/resource-lot.controller';

const router = Router();
import { authenticate } from '../middleware/auth.middleware';
import { requireOrganizationRole } from '../middleware/authorization.middleware';

router.post('/', authenticate, requireOrganizationRole(['OWNER', 'ADMIN', 'COORDINATOR']), createResourceLotController);
router.get('/', getResourceLotsController);
router.get('/:id', getResourceLotController);
router.patch('/:id', authenticate, requireOrganizationRole(['OWNER', 'ADMIN', 'COORDINATOR']), updateResourceLotController);

export default router;
