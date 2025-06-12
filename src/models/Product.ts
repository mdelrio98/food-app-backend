import { Schema, model } from 'mongoose';
import { IProduct } from '../types/product.types';

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    // Define other product fields here
  },
  { timestamps: true } // Adds createdAt and updatedAt timestamps
);

const Product = model<IProduct>('Product', ProductSchema);

export default Product;
