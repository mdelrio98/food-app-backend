import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Ensure environment variables are loaded from .env in the project root

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI is not defined in the .env file. Please add it and ensure .env is in the project root.');
  process.exit(1); // Exit the process with an error code
}

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('MongoDB Connection Error:', errorMessage);
    // It's often better to throw the error or handle it in a way that allows the application 
    // to attempt a graceful shutdown or retry, rather than just exiting.
    // For now, we'll keep process.exit(1) for simplicity during setup.
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
