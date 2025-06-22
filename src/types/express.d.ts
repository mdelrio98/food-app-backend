import { IAuthenticatedUser } from './user.types';

// This file uses TypeScript's declaration merging to extend the global Express namespace.
// It adds a custom 'user' property to the 'Request' interface.
// This makes the authenticated user's data available on the request object in a type-safe manner
// across the entire application, wherever Express's Request type is used.

// We export an empty object to ensure this file is treated as a module.
export {};

declare global {
  namespace Express {
    export interface Request {
      // The 'user' property is optional because not all routes will be authenticated.
      // For protected routes, the 'protect' middleware ensures this property is set.
      user: IAuthenticatedUser;
    }
  }
}
