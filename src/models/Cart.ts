import { Schema, model, Types } from 'mongoose';
import { ICart, ICartItem } from '../types/cart.types';
import { IMeal } from '../types/meal.types';

const CartItemSchema = new Schema<ICartItem>(
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
      type: Number, // Price per unit at the time of adding to cart
      required: true,
      min: 0,
    },
  },
  { _id: false } // No separate _id for cart items, they are part of the Cart document
);

const CartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Assuming a User model exists or will be created
      required: true,
      unique: true, // Each user has only one cart
    },
    items: [CartItemSchema],
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt timestamps
);

// Middleware to calculate totalAmount before saving
CartSchema.pre<ICart>('save', function (next) {
  this.totalAmount = this.items.reduce((acc, item) => {
    return acc + item.quantity * item.price;
  }, 0);
  next();
});

// Optional: Virtual for totalAmount if you prefer not to store it
// CartSchema.virtual('totalAmount').get(function () {
//   return this.items.reduce((acc, item) => {
//     return acc + item.quantity * item.price;
//   }, 0);
// });

const Cart = model<ICart>('Cart', CartSchema);

export default Cart;
