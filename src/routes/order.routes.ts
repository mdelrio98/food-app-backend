import { Router } from 'express';
import { createOrderHandler } from '../controllers/order.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
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
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Bad request (e.g., empty cart)
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
router.post('/', protect, createOrderHandler);

export default router;
