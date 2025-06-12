import { Request, Response, NextFunction } from 'express';
import {
  getOrCreateCart,
  addItemToCart,
  removeItemFromCart,
  clearCart,
} from '../services/cart.service';
import { Types } from 'mongoose';

// Extend Express Request type to include 'user' property if not already present
interface AuthenticatedRequest extends Request {
  user?: {
    id: string; // Assuming user ID is a string (e.g., MongoDB ObjectId string)
    // Add other user properties if needed
  };
}

export const getUserCartHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const userId = req.user.id;
    const cart = await getOrCreateCart(userId);
    res.status(200).json(cart);
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
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res
        .status(400)
        .json({ message: 'Product ID and quantity are required' });
    }

    // if (!Types.ObjectId.isValid(productId)) { // <-- DISABLED FOR DUMMY DATA
    //   return res.status(400).json({ message: 'Invalid Product ID format' });
    // }
    if (typeof quantity !== 'number' || quantity <= 0) {
      return res
        .status(400)
        .json({ message: 'Quantity must be a positive number' });
    }

    const cart = await addItemToCart(userId, productId, quantity);
    res.status(200).json(cart);
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
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const userId = req.user.id;
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }
    // if (!Types.ObjectId.isValid(productId)) { // <-- DISABLED FOR DUMMY DATA
    //   return res.status(400).json({ message: 'Invalid Product ID format' });
    // }

    const cart = await removeItemFromCart(userId, productId);
    res.status(200).json(cart);
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
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const userId = req.user.id;
    const cart = await clearCart(userId);
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

