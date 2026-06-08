import { Router } from 'express';
import * as orgController from '../controllers/organization.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireOrganizationRole, requireOrganizationAccess } from '../middleware/authorization.middleware';

const router = Router();

// Search must come before /:id so it doesn't get treated as an ID
router.get('/search', authenticate, orgController.search);

// Creating an org requires authentication so we can assign ADMIN membership
router.post('/', authenticate, orgController.create);
router.get('/', orgController.getAll);

// Join an organization
router.post('/:id/join', authenticate, orgController.join);

// Me endpoints
router.get('/me', authenticate, orgController.getMe);
router.patch('/me', authenticate, orgController.updateMe);

router.get('/:id', orgController.getById);

// Protected — only existing OWNER or ADMIN can modify the organization.
// organizationId must be supplied in the request body because req.params.id is
// the target organization, not an org-context parameter for getOrganizationContext.
router.patch(
  '/:id',
  authenticate,
  requireOrganizationAccess(),
  requireOrganizationRole(['OWNER', 'ADMIN']),
  orgController.update
);

export default router;
