import { Schema, model } from 'mongoose';
import { IMeal } from '../types/meal.types';

const MealSchema = new Schema<IMeal>(
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
    // Define other meal fields here
  },
  { timestamps: true } // Adds createdAt and updatedAt timestamps
);

const Meal = model<IMeal>('Meal', MealSchema);

export default Meal;
