import { Document, Types } from 'mongoose';
import { IProduct } from './product.types';

// Interface for an item within the cart
export interface ICartItem {
  product: Types.ObjectId | IProduct; // Can be populated or just an ID
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
