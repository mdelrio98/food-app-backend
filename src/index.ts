import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import connectDB from './config/database';
import cartRoutes from './routes/cart.routes';
import mealRoutes from './routes/meal.routes'; // Import meal routes
import orderRoutes from './routes/order.routes';
import authRoutes from './routes/auth.routes';
import errorHandler from './middlewares/error.middleware';

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app: Application = express();
const PORT = parseInt(process.env.PORT || '3001', 10);
const API_PREFIX = process.env.API_PREFIX || '/api/v1';
const LISTEN_HOST = '0.0.0.0';

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount Routes
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/cart`, cartRoutes);
app.use(`${API_PREFIX}/meals`, mealRoutes); // Use meal routes
app.use(`${API_PREFIX}/orders`, orderRoutes);

// Basic API Health Check
app.get(`${API_PREFIX}/health`, (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP', message: 'Food App Backend is healthy' });
});

// Catch-all for undefined API routes
app.use(`${API_PREFIX}/*`, (req: Request, res: Response) => {
  res.status(404).json({ message: 'API route not found' });
});

// Global error handler - MUST be the last middleware
app.use(errorHandler);

app.listen(PORT, LISTEN_HOST, () => {
  console.log(`Server listening on host ${LISTEN_HOST} and port ${PORT}`);
  console.log(`Using API prefix: ${API_PREFIX}`);

  if (process.env.NODE_ENV === 'production') {
    console.log('Server running in PRODUCTION mode.');
  } else {
    console.log('Server running in DEVELOPMENT mode.');
    const displayHost = LISTEN_HOST === '0.0.0.0' ? 'localhost' : LISTEN_HOST;
    console.log(`  Development URL: http://${displayHost}:${PORT}`);
    console.log(`  Development API URL: http://${displayHost}:${PORT}${API_PREFIX}`);
  }
});

export default app;
