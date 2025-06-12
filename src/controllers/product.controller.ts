// src/controllers/product.controller.ts
import { Request, Response, NextFunction } from 'express';
// import Product from '../models/Product'; // We'll comment this out for now

const DUMMY_MEALS = [
  {
    id: 'm1',
    name: 'Sushi',
    description: 'Finest fish and veggies',
    price: 22.99,
  },
  {
    id: 'm2',
    name: 'Schnitzel',
    description: 'A german specialty!',
    price: 16.50,
  },
  {
    id: 'm3',
    name: 'Barbecue Burger',
    description: 'American, raw, meaty',
    price: 12.99,
  },
  {
    id: 'm4',
    name: 'Green Bowl',
    description: 'Healthy...and green...',
    price: 18.99,
  },
];

export const getAllProductsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // const products = await Product.find({}); // Fetch all products - Commented out
    res.status(200).json({ meals: DUMMY_MEALS }); // Return dummy data as { meals: [...] }
  } catch (error) {
    next(error); // Pass errors to the global error handler
  }
};

// We can add more handlers here later (e.g., getProductById, createProduct, etc.)
