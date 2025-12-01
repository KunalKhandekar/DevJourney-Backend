/**
 * Custom modules
 */
import uploadToCloudinary from '@/lib/cloudinary';
import { logger } from '@/lib/winston';

/**
 * Models
 */
import Blog from '@/models/blog';

/**
 * Types
 */
import { UploadApiErrorResponse } from 'cloudinary';
import type { Request, Response, NextFunction } from 'express';

// Constants
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

/**
 * Middleware to upload blog banner to Cloudinary
 * @description This middleware uploads the blog banner to Cloudinary
 * and adds the banner data to the request body
 *
 * @param method - HTTP method (post or put)
 * @returns Middleware function
 */
const uploadBlogBanner = (method: 'post' | 'put') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (method === 'put' && !req.file) {
      next();
      return;
    }

    if (!req.file) {
      res.status(400).json({
        code: 'ValidationError',
        message: 'Blog banner is required',
      });
      return;
    }

    if (req.file?.size > MAX_FILE_SIZE) {
      res.status(413).json({
        code: 'ValidationError',
        message: 'File size must be less than 2 MB',
      });
      return;
    }

    try {
      const { blogId } = req.params;
      const blog = await Blog.findById(blogId).select('banner.publicId').exec();

      const data = await uploadToCloudinary(
        req.file.buffer,
        blog?.banner.publicId.replace('blog-banners/', ''),
      );

      if (!data) {
        res.status(500).json({
          code: 'ServerError',
          message: 'Internal server error',
        });
        logger.error('Error while uploading blog banner to cloudinary', {
          blogId,
          publicId: blog?.banner.publicId,
        });
        return;
      }

      const newBanner = {
        publicId: data.public_id,
        url: data.secure_url,
        width: data.width,
        height: data.height,
      };

      logger.info('Blog banner uploaded to cloudinary', {
        blogId,
        banner: newBanner,
      });

      req.body.banner = newBanner;
      next();
    } catch (error: UploadApiErrorResponse | any) {
      res.status(error.http_code).json({
        code: error.http_code < 500 ? 'ValidationError' : error.name,
        message: error.message,
      });

      logger.error('Error while uploading blog banner to Cloudinary', error);
    }
  };
};

export default uploadBlogBanner;
