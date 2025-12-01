/**
 * Node modules
*/
import { body } from 'express-validator';
import { Router } from 'express';

/**
 * Middlewares
 */
import authenticate from '@/middlewares/authenticate';
import authorize from '@/middlewares/authorize';
import ValidationError from '@/middlewares/validationError';

/**
 * Validators
 */
import { mongoIdValidator } from '@/validators/v1';

/**
 * Controllers
 */
import likeBlog from '@/controllers/v1/like/like_blog';
import unlikeBlog from '@/controllers/v1/like/unlike_blog';

const router = Router();

router.post(
  '/blog/:blogId',
  authenticate,
  authorize(['admin', 'user']),
  mongoIdValidator('blogId'),
  body('userId')
    .notEmpty()
    .withMessage('User id is required')
    .isMongoId()
    .withMessage(`Invalid user id`),
  ValidationError,
  likeBlog,
);

router.delete(
  '/blog/:blogId',
  authenticate,
  authorize(['admin', 'user']),
  mongoIdValidator('blogId'),
  body('userId')
    .notEmpty()
    .withMessage('User id is required')
    .isMongoId()
    .withMessage(`Invalid user id`),
  ValidationError,
  unlikeBlog,
);

export default router;
