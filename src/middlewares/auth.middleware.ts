import { Request, Response, NextFunction } from 'express';
import { IUser } from '../types/user.types';

// Extend Express Request type to include 'user' property
export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

/**
 * Placeholder Authentication Middleware.
 * In a real application, this would verify a JWT or session token
 * and attach the user object to req.user.
 */
export const protect = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  // For demonstration purposes, we'll mock a user object.
  // In a real app, this would verify a JWT, find the user in the DB, and attach them to the request.
  const MOCK_USER_ID = '605c72ef1e8ab221f00b1234';

  console.warn('Protect Middleware: Using MOCK_USER. Implement proper authentication.');

  // Create a mock user object that satisfies the IUser interface.
  req.user = {
    _id: MOCK_USER_ID,
    email: 'mock@example.com',
    name: 'Mock User',
  } as IUser;

  next();
};
