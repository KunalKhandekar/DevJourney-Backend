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

/**
 * Types
 */
import type { Request, Response } from 'express';
import { IBlog } from '@/models/blog';

type BlogData = Pick<IBlog, 'title' | 'content' | 'banner' | 'status'>

/**
 * Purify the blog content to prevent XSS attacks
*/
const window = new JSDOM('').window;
const purify = DOMPurify(window);

const createBlog = async (req: Request, res: Response): Promise<void> => {
    const { title, content, banner, status } = (req.body as BlogData) || {};
    const userId = req.userId;
  try {
    const cleanContent = purify.sanitize(content);
    const newBlog = await Blog.create({
        title,
        content: cleanContent,
        banner,
        status,
        author: userId,
    });

    logger.info("New blog created", newBlog);

    res.status(201).json({
        newBlog
    })
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
    });

    logger.error(`Error while creating blog: `, error);
  }
};

export default createBlog;
