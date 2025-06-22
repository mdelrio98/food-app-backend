import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

interface DecodedToken {
  id: string;
}

/**
 * Authentication Middleware.
 * Verifies a JWT token, finds the user in the database, and attaches the user to the request.
 * It leverages declaration merging to add the 'user' property to the Express Request type.
 */
export const protect = async (
  req: Request, 
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
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({ message: 'Unauthorized Access' });
      }

      // Attach the authenticated user to the request object
      req.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(401).json({ message: 'Unauthorized Access' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized Access' });
  }
};
