import { Response } from 'express';
import * as OrderService from '../services/order.service';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { handleAsync } from '../utils/handleAsync';
import { AppError } from '../utils/AppError';

export const createOrderHandler = handleAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?._id;

    if (!userId) {
      throw new AppError('Authentication error: User ID not found.', 401);
    }

    const order = await OrderService.createOrder(userId, req.body);

    res.status(201).json({
      message: 'Order created successfully',
      data: order,
    });
  }
);
