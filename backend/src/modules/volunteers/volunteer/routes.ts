import { Router } from 'express';
import {
  createVolunteer,
  getVolunteer,
  getVolunteers,
  updateVolunteer,
  deleteVolunteer,
  getMe,
  updateMe,
} from './controller';
import { authenticate } from '../../../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, createVolunteer);
router.get('/', getVolunteers);

// Me endpoints
router.get('/me', authenticate, getMe);
router.patch('/me', authenticate, updateMe);

router.get('/:id', getVolunteer);
router.patch('/:id', updateVolunteer);
router.delete('/:id', deleteVolunteer);

export default router;
