import { Document, Types } from 'mongoose';

export interface IMeal extends Document {
  _id: Types.ObjectId;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  // Add other meal-specific fields here
}
