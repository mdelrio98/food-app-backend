import { Request, Response, NextFunction } from 'express';
import { transformResponse } from '../utils/responseTransformer';
import { ApiError } from '../utils/ApiError';
import {
  initializeCart,
  addItemToCart,
  removeItemFromCart,
  clearCart,
} from '../services/cart.service';

export const getUserCartHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id; // Use non-null assertion as 'protect' middleware guarantees user
    const cart = await initializeCart(userId);
    res.status(200).json(transformResponse(cart));
  } catch (error) {
    next(error);
  }
};

export const addItemToCartHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id; // Use non-null assertion as 'protect' middleware guarantees user
    const { mealId, quantity } = req.body;

    if (!mealId || !quantity) {
      throw new ApiError('Meal ID and quantity are required', 400);
    }

    // if (!Types.ObjectId.isValid(mealId)) { // <-- DISABLED FOR DUMMY DATA
    //   return res.status(400).json({ message: 'Invalid Meal ID format' });
    // }
    if (typeof quantity !== 'number' || quantity <= 0) {
      throw new ApiError('Quantity must be a positive number', 400);
    }

    const cart = await addItemToCart(userId, mealId, quantity);
    res.status(200).json(transformResponse(cart));
  } catch (error) {
    next(error);
  }
};

export const removeItemFromCartHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id; // Use non-null assertion as 'protect' middleware guarantees user
    const { mealId } = req.params;

    if (!mealId) {
      throw new ApiError('Meal ID is required', 400);
    }
    // if (!Types.ObjectId.isValid(mealId)) { // <-- DISABLED FOR DUMMY DATA
    //   return res.status(400).json({ message: 'Invalid Meal ID format' });
    // }

    const cart = await removeItemFromCart(userId, mealId);
    res.status(200).json(transformResponse(cart));
  } catch (error) {
    next(error);
  }
};

export const clearCartHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id; // Use non-null assertion as 'protect' middleware guarantees user
    const cart = await clearCart(userId);
    res.status(200).json(transformResponse(cart));
  } catch (error) {
    next(error);
  }
};

