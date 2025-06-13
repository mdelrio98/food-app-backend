import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { IAuthenticatedUser } from '../types/user.types';

// Extend Express Request type to include 'user' property
export interface AuthenticatedRequest extends Request {
  user?: IAuthenticatedUser;
}

interface DecodedToken {
  id: string;
}

/**
 * Authentication Middleware.
 * Verifies a JWT token, finds the user in the database, and attaches the user to the request.
 */
export const protect = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

      // Get user from the token
      req.user = (await User.findById(decoded.id).select('-password')) as IAuthenticatedUser | undefined;

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};
