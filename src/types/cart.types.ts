import { Document, Types } from 'mongoose';
import { IMeal } from './meal.types';

// Interface for an item within the cart
export interface ICartItem {
  meal: Types.ObjectId | IMeal; // Can be populated or just an ID
  quantity: number;
  price: number; // Price of the product at the time of adding to cart (snapshot)
}

// Interface for the Cart document
export interface ICart extends Document {
  user: Types.ObjectId; // Reference to the User model
  items: ICartItem[];
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}
