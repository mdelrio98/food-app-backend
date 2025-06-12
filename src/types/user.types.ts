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
