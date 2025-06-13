import { Router } from 'express';
import {
  getUserCartHandler,
  addItemToCartHandler,
  removeItemFromCartHandler,
  clearCartHandler,
} from '../controllers/cart.controller';
import { protect } from '../middlewares/auth.middleware'; // Placeholder auth middleware

const router = Router();

// All cart routes should be protected by authentication
router.use(protect);

// GET /api/v1/cart - Get the current user's cart
router.get('/', getUserCartHandler);


// POST /api/v1/cart/items - Add an item to the cart
// Expects { productId: string, quantity: number } in the body
router.post('/items', addItemToCartHandler);

// DELETE /api/v1/cart/items/:mealId - Remove one unit of an item from the cart
router.delete('/items/:mealId', removeItemFromCartHandler);

// DELETE /api/v1/cart - Clear all items from the cart
router.delete('/', clearCartHandler);

export default router;
