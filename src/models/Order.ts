import { Schema, model, Document, Types } from 'mongoose';
import { IMeal } from '../types/meal.types';
import { IUser } from '../types/user.types';

export interface OrderItem {
  meal: Types.ObjectId | IMeal;
  quantity: number;
  price: number;
}

export interface Order extends Document {
  user: Types.ObjectId | IUser;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<OrderItem>(
  {
    meal: {
      type: Schema.Types.ObjectId,
      ref: 'Meal',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const orderSchema = new Schema<Order>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [orderItemSchema],
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export default model<Order>('Order', orderSchema);
