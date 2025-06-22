import { Document } from 'mongoose';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export interface IUser extends Document {
  email: string;
  password?: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}