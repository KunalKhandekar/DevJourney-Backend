/**
 * Node modules
 */
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

/**
 * Custom modules
 */
import { logger } from '@/lib/winston';

/**
 * Models
 */
import Blog from '@/models/blog';
import User from '@/models/user';

/**
 * Types
 */
import type { Request, Response } from 'express';
import { IBlog } from '@/models/blog';

type BlogData = Partial<Pick<IBlog, 'title' | 'content' | 'banner' | 'status'>>;

/**
 * Purify the blog content to prevent XSS attacks
 */
const window = new JSDOM('').window;
const purify = DOMPurify(window);

const updateBlog = async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId;
  const { title, content, banner, status } = (req.body as BlogData) || {};
  const blogId = req.params.blogId;

  try {
    const user = await User.findById(userId).select('role').lean().exec();
    const blog = await Blog.findById(blogId).select('-__v').exec();

    if (!blog) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });
      return;
    }

    if (blog.author !== userId && user?.role !== 'admin') {
      res.status(403).json({
        code: 'AuthorizationError',
        message: 'Access denied, insufficient permissions',
      });

      logger.warn('A user tried to update a blog without permission', {
        userId,
        blog,
      });
      return;
    }

    if (title) blog.title = title;
    if (content) {
      const cleanContent = purify.sanitize(content);
      blog.content = cleanContent;
    }
    if (banner) blog.banner = banner;
    if (status) blog.status = status;

    await blog.save();

    res.status(200).json({
      blog,
    });

    logger.info('Blog updated', {
      blog,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
    });

    logger.error(`Error while updating blog: `, error);
  }
};

export default updateBlog;
