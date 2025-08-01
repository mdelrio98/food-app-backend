import { Router } from 'express';
import {
  createMealHandler,
  getAllMealsHandler,
  getMealByIdHandler,
  updateMealHandler,
  deleteMealHandler,
} from '../controllers/meal.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Meals
 *   description: Meal management
 * components:
 *   schemas:
 *     Meal:
 *       type: object
 *       required:
 *         - name
 *         - price
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the meal
 *         name:
 *           type: string
 *           description: The name of the meal
 *         price:
 *           type: number
 *           description: The price of the meal
 *         description:
 *           type: string
 *           description: A short description of the meal
 *         imageUrl:
 *           type: string
 *           description: URL of an image for the meal
 *       example:
 *         id: '642c4b5f1b3b3b3b3b3b3b3b'
 *         name: 'Classic Burger'
 *         price: 9.99
 *         description: 'A delicious classic beef burger.'
 *         imageUrl: 'http://example.com/images/burger.jpg'
 */

/**
 * @swagger
 * /meals:
 *   get:
 *     summary: Retrieve a list of all meals
 *     tags: [Meals]
 *     responses:
 *       '200':
 *         description: A list of meals.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 meals:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Meal'
 *       '500':
 *         description: Internal server error.
 */
router.get('/', getAllMealsHandler);

/**
 * @swagger
 * /meals/{mealId}:
 *   get:
 *     summary: Retrieve a single meal by its ID
 *     tags: [Meals]
 *     parameters:
 *       - in: path
 *         name: mealId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the meal to retrieve.
 *     responses:
 *       '200':
 *         description: The requested meal.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Meal'
 *       '400':
 *         description: Invalid Meal ID format.
 *       '404':
 *         description: Meal not found.
 *       '500':
 *         description: Internal server error.
 */
router.get('/:mealId', getMealByIdHandler);

/**
 * @swagger
 * /meals:
 *   post:
 *     summary: Create a new meal
 *     tags: [Meals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Meal'
 *     responses:
 *       '201':
 *         description: The meal was successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Meal'
 *       '400':
 *         description: Bad request (e.g., missing name or price).
 *       '401':
 *         description: Unauthorized.
 *       '500':
 *         description: Internal server error.
 */
router.post('/', protect, createMealHandler);

/**
 * @swagger
 * /meals/{mealId}:
 *   put:
 *     summary: Update an existing meal
 *     tags: [Meals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: mealId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the meal to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *     responses:
 *       '200':
 *         description: The updated meal.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Meal'
 *       '400':
 *         description: Bad request (e.g., invalid ID or data).
 *       '401':
 *         description: Unauthorized.
 *       '404':
 *         description: Meal not found.
 *       '500':
 *         description: Internal server error.
 */
router.put('/:mealId', protect, updateMealHandler);

/**
 * @swagger
 * /meals/{mealId}:
 *   delete:
 *     summary: Delete a meal
 *     tags: [Meals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: mealId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the meal to delete.
 *     responses:
 *       '200':
 *         description: Meal deleted successfully.
 *       '400':
 *         description: Invalid Meal ID format.
 *       '401':
 *         description: Unauthorized.
 *       '404':
 *         description: Meal not found.
 *       '500':
 *         description: Internal server error.
 */
router.delete('/:mealId', protect, deleteMealHandler);

export default router;
