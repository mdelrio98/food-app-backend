import { Document } from 'mongoose';

export interface IUser extends Document {
  // Basic user fields - expand as needed
  email: string;
  password?: string; // Password will likely be hashed and not always present
  name?: string;
  // Add other user-specific fields here (e.g., roles, address, etc.)
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Represents the user object attached to an authenticated request.
 * It is based on the Mongoose Document and excludes sensitive fields.
 */
export interface IAuthenticatedUser extends Document {
  _id: string;
  name: string;
  email: string;
  // Note: 'password' is intentionally excluded.
}
