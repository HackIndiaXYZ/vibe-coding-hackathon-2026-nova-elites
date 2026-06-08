import { Router } from 'express';
import { getVolunteersController, getVolunteerController, createVolunteerController, updateVolunteerController, assignVolunteerController, getOrganizationAssignmentsController } from '../controllers/volunteer.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, getVolunteersController);
router.get('/assignments', authenticate, getOrganizationAssignmentsController);
router.get('/:id', authenticate, getVolunteerController);
router.post('/', authenticate, createVolunteerController);
router.patch('/:id', authenticate, updateVolunteerController);
router.post('/:id/assignments', authenticate, assignVolunteerController);

export default router;
