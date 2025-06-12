import { Types } from 'mongoose';
import OrderModel, { Order, OrderItem } from '../models/Order';
import ProductModel from '../models/Product';
import { CreateOrderPayload } from '../types/order.types';
import { IProduct } from '../types/product.types';
import { AppError } from '../utils/AppError';

export const createOrder = async (
  userId: Types.ObjectId,
  payload: CreateOrderPayload
): Promise<Order> => {
  const { items } = payload;

  if (!items || items.length === 0) {
    throw new AppError('Order must have at least one item', 400);
  }

  const productIds = items.map((item) => item.productId);
  const products = await ProductModel.find({ _id: { $in: productIds } });

  if (products.length !== productIds.length) {
    throw new AppError('One or more products not found', 404);
  }

  let total = 0;
  const orderItems: OrderItem[] = items.map((item) => {
        const product = products.find((p: IProduct) => p._id.equals(item.productId));
    if (!product) {
      // This case should theoretically not be reached due to the check above
      throw new AppError(`Product with id ${item.productId} not found`, 404);
    }

    const price = product.price;
    total += price * item.quantity;

    return {
      product: product._id,
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
