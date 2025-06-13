import { Types } from 'mongoose';
import OrderModel, { Order, OrderItem } from '../models/Order';
import Meal from '../models/Meal';
import { CreateOrderPayload } from '../types/order.types';
import { IMeal } from '../types/meal.types';
import { AppError } from '../utils/AppError';

export const createOrder = async (
  userId: Types.ObjectId,
  payload: CreateOrderPayload
): Promise<Order> => {
  const { items } = payload;

  if (!items || items.length === 0) {
    throw new AppError('Order must have at least one item', 400);
  }

  const mealIds = items.map((item) => item.mealId);
  const meals = await Meal.find({ _id: { $in: mealIds } });

  if (meals.length !== mealIds.length) {
    throw new AppError('One or more meals not found', 404);
  }

  let total = 0;
  const orderItems: OrderItem[] = items.map((item) => {
        const meal = meals.find((m: IMeal) => m._id.equals(item.mealId));
    if (!meal) {
      // This case should theoretically not be reached due to the check above
      throw new AppError(`Meal with id ${item.mealId} not found`, 404);
    }

    const price = meal.price;
    total += price * item.quantity;

    return {
      product: meal._id, // Assuming OrderItem uses 'product' field, will verify
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
