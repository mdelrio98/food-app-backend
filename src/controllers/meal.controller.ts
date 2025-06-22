import { Request, Response, NextFunction } from 'express';
import { transformResponse } from '../utils/responseTransformer';
import { ApiError } from '../utils/ApiError';
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

        // Validate input: name must be a non-empty string, and price must be a non-negative number.
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return next(new ApiError('Name is required and cannot be empty', 400));
    }

    if (price === undefined || typeof price !== 'number' || price < 0) {
      return next(new ApiError('Price must be a non-negative number', 400));
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
      return next(new ApiError('Invalid Meal ID format', 400));
    }

    const meal = await Meal.findById(mealId);
    if (!meal) {
      return next(new ApiError('Meal not found', 404));
    }

    const { name, price, description, imageUrl } = req.body;

    // Validate incoming data only if it was provided in the request
    if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
      return next(new ApiError('Name, if provided, cannot be an empty string', 400));
    }
    if (price !== undefined && (typeof price !== 'number' || price < 0)) {
      return next(new ApiError('Price, if provided, must be a non-negative number', 400));
    }

    // Apply updates only for the fields that were actually provided in the request body
    if (name !== undefined) meal.name = name;
    if (price !== undefined) meal.price = price;
    if (description !== undefined) meal.description = description;
    if (imageUrl !== undefined) meal.imageUrl = imageUrl;

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
