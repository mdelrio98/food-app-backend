import { Response, Request, NextFunction } from 'express';
import { Types } from 'mongoose';
import * as OrderService from '../services/order.service';

import { ApiError } from '../utils/ApiError';
import { transformResponse } from '../utils/responseTransformer';



export const createOrderHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return next(new ApiError('Authentication error: User ID not found.', 401));
    }

    const order = await OrderService.createOrder(
      new Types.ObjectId(userId),
      req.body
    );

    res.status(201).json({
      message: 'Order created successfully',
      data: transformResponse(order),
    });
  } catch (error) {
    next(error);
  }
};
