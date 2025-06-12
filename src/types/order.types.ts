import { Types } from 'mongoose';

export interface OrderItemPayload {
  productId: Types.ObjectId;
  quantity: number;
}

export interface CreateOrderPayload {
  items: OrderItemPayload[];
}
