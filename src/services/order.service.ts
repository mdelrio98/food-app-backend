import { Types } from 'mongoose';
import OrderModel, { Order, OrderItem } from '../models/Order';
import Meal from '../models/Meal';
import { CreateOrderPayload } from '../types/order.types';
import { IMeal } from '../types/meal.types';
import { ApiError } from '../utils/ApiError';

export const createOrder = async (
  userId: Types.ObjectId,
  payload: CreateOrderPayload
): Promise<Order> => {
  const { items } = payload;

  if (!items || items.length === 0) {
    throw new ApiError('Order must have at least one item', 400);
  }

  // Get unique meal IDs from the payload to perform a robust validation.
  const uniqueMealIds = [...new Set(items.map((item) => item.mealId))];
  const meals = await Meal.find({ _id: { $in: uniqueMealIds } });

  // Validate that every unique meal ID from the payload corresponds to a meal in the database.
  if (meals.length !== uniqueMealIds.length) {
    throw new ApiError('One or more meals specified in the order do not exist.', 404);
  }

  // Create a Map of meals for efficient lookup, avoiding a nested loop.
  const mealMap = new Map(meals.map((meal) => [meal._id.toString(), meal]));

  let total = 0;
  const orderItems: OrderItem[] = items.map((item) => {
    // We can safely assume the meal exists due to the prior validation.
    // The non-null assertion (!) is safe to use here.
    const meal = mealMap.get(item.mealId.toString())!;

    const price = meal.price;
    total += price * item.quantity;

    return {
      meal: meal._id,
      quantity: item.quantity,
      price: price,
    };
  });

  const newOrder = new OrderModel({
    user: userId,
    items: orderItems,
    total,
    status: 'pending',
  });

  await newOrder.save();

  // Here you might want to clear the user's cart
  // For example: await CartService.clearCart(userId);

  return newOrder;
};
