import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { sendError } from '../utils/response';
import { User } from '../models/User';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendError(res, 'No token provided', 'Authentication required', 401);
      return;
    }

    const token = authHeader.substring(7);

    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded.userId);

    if (!user) {
      sendError(res, 'User not found', 'Invalid token', 401);
      return;
    }

    req.user = user;
    req.userId = user._id.toString();

    next();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'TokenExpiredError') {
        sendError(res, 'Token expired', 'Please refresh your token', 401);
        return;
      }
      if (error.name === 'JsonWebTokenError') {
        sendError(res, 'Invalid token', error.message, 401);
        return;
      }
    }
    sendError(res, 'Authentication failed', 'Server error', 500);
  }
};
