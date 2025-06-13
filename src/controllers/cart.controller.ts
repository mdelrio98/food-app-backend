import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { transformResponse } from '../utils/responseTransformer';
import {
  getOrCreateCart,
  addItemToCart,
  removeItemFromCart,
  clearCart,
} from '../services/cart.service';



export const getUserCartHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const userId = req.user._id;
    const cart = await getOrCreateCart(userId);
    res.status(200).json(transformResponse(cart));
  } catch (error) {
    next(error);
  }
};

export const addItemToCartHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const userId = req.user._id;
    const { mealId, quantity } = req.body;

    if (!mealId || !quantity) {
      return res
        .status(400)
        .json({ message: 'Meal ID and quantity are required' });
    }

    // if (!Types.ObjectId.isValid(mealId)) { // <-- DISABLED FOR DUMMY DATA
    //   return res.status(400).json({ message: 'Invalid Meal ID format' });
    // }
    if (typeof quantity !== 'number' || quantity <= 0) {
      return res
        .status(400)
        .json({ message: 'Quantity must be a positive number' });
    }

    const cart = await addItemToCart(userId, mealId, quantity);
    res.status(200).json(transformResponse(cart));
  } catch (error) {
    next(error);
  }
};

export const removeItemFromCartHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const userId = req.user._id;
    const { mealId } = req.params;

    if (!mealId) {
      return res.status(400).json({ message: 'Meal ID is required' });
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
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const userId = req.user._id;
    const cart = await clearCart(userId);
    res.status(200).json(transformResponse(cart));
  } catch (error) {
    next(error);
  }
};

