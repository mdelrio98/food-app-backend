import { Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  // Add other product-specific fields here
}
