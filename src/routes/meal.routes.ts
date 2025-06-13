import { Router } from 'express';
import {
  createMealHandler,
  getAllMealsHandler,
  getMealByIdHandler,
  updateMealHandler,
  deleteMealHandler,
} from '../controllers/meal.controller';
import { protect } from '../middlewares/auth.middleware'; // Renamed to 'protect' as per actual export

const router = Router();

// Public routes
router.get('/', getAllMealsHandler);
router.get('/:mealId', getMealByIdHandler);

// Private routes (example: protected by authMiddleware, add admin checks as needed)
router.post('/', protect, createMealHandler); // Example: only authenticated users can create
router.put('/:mealId', protect, updateMealHandler); // Example: only authenticated users can update
router.delete('/:mealId', protect, deleteMealHandler); // Example: only authenticated users can delete

export default router;
