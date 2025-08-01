import { Router } from 'express';
import { createOrderHandler } from '../controllers/order.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       properties:
 *         meal:
 *           type: string
 *           description: The ID of the meal.
 *         quantity:
 *           type: integer
 *           description: The quantity of the meal ordered.
 *         price:
 *           type: number
 *           description: The price of the meal at the time of order.
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The order ID.
 *         user:
 *           type: string
 *           description: The ID of the user who placed the order.
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         total:
 *           type: number
 *           description: The total price of the order.
 *         status:
 *           type: string
 *           description: The current status of the order.
 *           enum: [pending, completed, cancelled]
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time the order was created.
 *     CreateOrderPayload:
 *       type: object
 *       required:
 *         - items
 *       properties:
 *         items:
 *           type: array
 *           description: A list of items to include in the order.
 *           items:
 *             type: object
 *             required:
 *               - mealId
 *               - quantity
 *             properties:
 *               mealId:
 *                 type: string
 *                 description: The ID of the meal.
 *                 example: '642c4b5f1b3b3b3b3b3b3b3b'
 *               quantity:
 *                 type: integer
 *                 description: The quantity of the meal.
 *                 example: 2
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order from the user's cart items
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderPayload'
 *     responses:
 *       '201':
 *         description: Order created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       '400':
 *         description: Bad request (e.g., order must have at least one item).
 *       '401':
 *         description: Unauthorized, token is missing or invalid.
 *       '404':
 *         description: Not found (e.g., one or more meals do not exist).
 *       '500':
 *         description: Internal server error.
 */
router.post('/', protect, createOrderHandler);

export default router;
