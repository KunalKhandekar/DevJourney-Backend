import { verifyAccessToken } from '@/lib/jwt';
import { logger } from '@/lib/winston';
import type { NextFunction, Request, Response } from 'express';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { Types } from 'mongoose';

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return next();
  }
  // Split out token from the 'Bearer' prefix
  const [_, token] = authHeader.split(' ');
  try {
    // Verify the token and extract the userId from the payload.
    const payload = verifyAccessToken(token) as { userId: Types.ObjectId };

    // Attach the userId to the request object for later use.
    req.userId = payload.userId;
    return next();
  } catch (error) {
    // Handle token expiry error
    if (error instanceof TokenExpiredError) {
      res.status(401).json({
        code: 'AuthenticationError',
        message: 'Access token expired, request a new with refresh token',
      });
      return;
    }

    // Handle invalid token error
    if (error instanceof JsonWebTokenError) {
      res.status(401).json({
        code: 'AuthenticationError',
        message: 'Access token invalid ',
      });
      return;
    }

    // Catch-all for other errors
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: error,
    });

    logger.error('Error during authentication', error);
  }
};
