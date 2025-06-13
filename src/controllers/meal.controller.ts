import { Request, Response, NextFunction } from 'express';
import { transformResponse } from '../utils/responseTransformer';
import Meal from '../models/Meal';
import { IMeal } from '../types/meal.types';
import { Types } from 'mongoose';

// @desc    Create a new meal
// @route   POST /api/v1/meals
// @access  Private (requires admin or specific role - assuming auth middleware handles this)
export const createMealHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, price, description, imageUrl } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ message: 'Name and price are required' });
    }
    if (typeof price !== 'number' || price < 0) {
      return res.status(400).json({ message: 'Price must be a non-negative number' });
    }

    const mealData: Partial<IMeal> = { name, price, description, imageUrl };
    const meal = await Meal.create(mealData);
    res.status(201).json(transformResponse(meal));
  } catch (error) {
    next(error);
  }
};

// @desc    Get all meals
// @route   GET /api/v1/meals
// @access  Public
export const getAllMealsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const mealsArray = await Meal.find({});
    const transformedMeals = transformResponse(mealsArray);
    res.status(200).json({ meals: transformedMeals });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single meal by ID
// @route   GET /api/v1/meals/:mealId
// @access  Public
export const getMealByIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { mealId } = req.params;
    if (!Types.ObjectId.isValid(mealId)) {
      return res.status(400).json({ message: 'Invalid Meal ID format' });
    }

    const meal = await Meal.findById(mealId);
    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }
    res.status(200).json(transformResponse(meal));
  } catch (error) {
    next(error);
  }
};

// @desc    Update a meal
// @route   PUT /api/v1/meals/:mealId
// @access  Private (requires admin or specific role)
export const updateMealHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { mealId } = req.params;
    if (!Types.ObjectId.isValid(mealId)) {
      return res.status(400).json({ message: 'Invalid Meal ID format' });
    }

    const meal = await Meal.findById(mealId);
    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }

    const { name, price, description, imageUrl } = req.body;

    // Basic validation for price if provided
    if (price !== undefined && (typeof price !== 'number' || price < 0)) {
      return res.status(400).json({ message: 'Price must be a non-negative number' });
    }

    meal.name = name || meal.name;
    meal.price = price === undefined ? meal.price : price;
    meal.description = description === undefined ? meal.description : description;
    meal.imageUrl = imageUrl === undefined ? meal.imageUrl : imageUrl;

    const updatedMeal = await meal.save();
    res.status(200).json(transformResponse(updatedMeal));
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a meal
// @route   DELETE /api/v1/meals/:mealId
// @access  Private (requires admin or specific role)
export const deleteMealHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { mealId } = req.params;
    if (!Types.ObjectId.isValid(mealId)) {
      return res.status(400).json({ message: 'Invalid Meal ID format' });
    }

    const meal = await Meal.findById(mealId);
    if (!meal) {
      return res.status(404).json(transformResponse({ message: 'Meal not found' }));
    }

    await Meal.findByIdAndDelete(mealId);
    res.status(200).json(transformResponse({ message: 'Meal removed successfully' }));
  } catch (error) {
    next(error);
  }
};
