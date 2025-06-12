// src/routes/product.routes.ts
import { Router } from 'express';
import { getAllProductsHandler } from '../controllers/product.controller';
// import { authMiddleware } from '../middlewares/auth.middleware'; // Optional: if listing products requires auth

const router = Router();

// GET /api/v1/products - Get all available products
// If you want this route to be protected, uncomment and use the authMiddleware
// router.use(authMiddleware); 
router.get('/', getAllProductsHandler);

// We can add more product-specific routes here later (e.g., GET /:productId)

export default router;
