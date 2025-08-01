import { Router } from 'express';
import {
  getUserCartHandler,
  addItemToCartHandler,
  removeItemFromCartHandler,
  clearCartHandler,
} from '../controllers/cart.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: User's shopping cart management
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Cart:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The cart ID.
 *           example: '642b3e3e1c9d440000e3b0c1'
 *         user:
 *           type: string
 *           description: The user ID.
 *           example: '642b3e3e1c9d440000e3b0c0'
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               meal:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   price:
 *                     type: number
 *               quantity:
 *                 type: integer
 *         totalPrice:
 *           type: number
 * security:
 *   - bearerAuth: []
 */

// All cart routes are protected
router.use(protect);

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Retrieve the user's shopping cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: The user's cart.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       '401':
 *         description: Unauthorized, token is missing or invalid.
 *       '500':
 *         description: Internal server error.
 */
router.get('/', getUserCartHandler);

/**
 * @swagger
 * /cart/items:
 *   post:
 *     summary: Add an item to the shopping cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mealId
 *               - quantity
 *             properties:
 *               mealId:
 *                 type: string
 *                 description: The ID of the meal to add.
 *                 example: '642b3e3e1c9d440000e3b0b1'
 *               quantity:
 *                 type: integer
 *                 description: The number of units to add.
 *                 example: 2
 *     responses:
 *       '200':
 *         description: The updated cart.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       '400':
 *         description: Bad request (e.g., missing fields, invalid quantity).
 *       '401':
 *         description: Unauthorized.
 *       '404':
 *         description: Meal not found.
 *       '500':
 *         description: Internal server error.
 */
router.post('/items', addItemToCartHandler);

/**
 * @swagger
 * /cart/items/{mealId}:
 *   delete:
 *     summary: Remove one unit of a specific item from the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: mealId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the meal to remove.
 *     responses:
 *       '200':
 *         description: The updated cart.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       '400':
 *         description: Bad request (e.g., missing mealId).
 *       '401':
 *         description: Unauthorized.
 *       '404':
 *         description: Item not found in cart.
 *       '500':
 *         description: Internal server error.
 */
router.delete('/items/:mealId', removeItemFromCartHandler);

/**
 * @swagger
 * /cart:
 *   delete:
 *     summary: Clear all items from the shopping cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: The emptied cart.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       '401':
 *         description: Unauthorized.
 *       '500':
 *         description: Internal server error.
 */
router.delete('/', clearCartHandler);

export default router;
