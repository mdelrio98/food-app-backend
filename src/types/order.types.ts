import { Types } from 'mongoose';

export interface OrderItemPayload {
  mealId: Types.ObjectId;
  quantity: number;
}

export interface CreateOrderPayload {
  items: OrderItemPayload[];
}
