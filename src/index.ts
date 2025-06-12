import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import connectDB from './config/database';
import cartRoutes from './routes/cart.routes'; // Import cart routes
import productRoutes from './routes/product.routes'; // Import product routes
import orderRoutes from './routes/order.routes'; // Import order routes

console.log(`[DEBUG] Initial process.env.PORT: ${process.env.PORT}`);

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app: Application = express();
const PORT = parseInt(process.env.PORT || '3001', 10); // Default to 3001, ensure it's a number
const API_PREFIX = process.env.API_PREFIX || '/api/v1';
const LISTEN_HOST = '0.0.0.0'; // Standard for allowing connections from any interface

// Middlewares
app.use(cors()); // Enable CORS - configure origins in production
app.use(helmet()); // Set security-related HTTP headers
app.use(morgan('dev')); // HTTP request logger
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Mount cart routes
app.use(`${API_PREFIX}/cart`, cartRoutes);

// Mount product routes
app.use(`${API_PREFIX}/products`, productRoutes);

// Mount order routes
app.use(`${API_PREFIX}/orders`, orderRoutes);

// Basic API route
app.get(`${API_PREFIX}/health`, (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP', message: 'Food App Backend is healthy' });
});

// Catch-all for undefined routes under the API prefix
app.use(`${API_PREFIX}/*`, (req: Request, res: Response) => {
  res.status(404).json({ message: 'API route not found' });
});

// Global error handler (basic example, can be expanded)
app.use((err: Error, req: Request, res: Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

app.listen(PORT, LISTEN_HOST, () => {
  console.log(`Server listening on host ${LISTEN_HOST} and port ${PORT}`);
  console.log(`Using API prefix: ${API_PREFIX}`);
  
  if (process.env.NODE_ENV === 'production') {
    console.log('Server running in PRODUCTION mode.');
    // In production, the application is typically accessed via a public URL through a reverse proxy or load balancer.
    // These logs confirm the internal listening configuration.
  } else {
    console.log('Server running in DEVELOPMENT mode.');
    // For local development, you can typically access the server via localhost:
    const displayHost = LISTEN_HOST === '0.0.0.0' ? 'localhost' : LISTEN_HOST;
    console.log(`  Development URL: http://${displayHost}:${PORT}`);
    console.log(`  Development API URL: http://${displayHost}:${PORT}${API_PREFIX}`);
  }
});

export default app;
