/**
 * Node modules
 */
import { Router } from 'express';
import multer from 'multer';

/**
 * Middlewares
 */
import ValidationError from '@/middlewares/validationError';
import authenticate from '@/middlewares/authenticate';
import authorize from '@/middlewares/authorize';
import uploadBlogBanner from '@/middlewares/uploadBlogBanner';

/**
 * Controllers
 */
import createBlog from '@/controllers/v1/blog/create_blog';

/**
 * Validators
*/
import { createBlogValidations } from '@/validators/v1/blog';

const upload = multer();

const router = Router();

router.post(
  '/',
  authenticate,
  authorize(['admin']),
  upload.single('banner_image'),
  createBlogValidations,
  ValidationError,
  uploadBlogBanner('post'),
  createBlog,
);

export default router;
