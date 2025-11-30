/**
 * Node modules
 */
import { Router } from 'express';

/**
 * Middlewares
 */
import authenticate from '@/middlewares/authenticate';
import authorize from '@/middlewares/authorize';
import ValidationError from '@/middlewares/validationError';

/**
 * Controllers
 */
import getCurrentUser from '@/controllers/v1/user/get_current_user';

/**
 * Models
 */
import User from '@/models/user';

const router = Router();

router.get(
  '/current',
  authenticate,
  authorize(['admin', 'user']),
  getCurrentUser,
);

export default router;
