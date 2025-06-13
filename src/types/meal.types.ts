import { Document } from 'mongoose';

export interface IMeal extends Document {
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  // Add other meal-specific fields here
}
