import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs'; // Import fs module
import Meal from '../models/Meal'; // Changed from Product
import connectDB from '../config/database';

// Load env vars specific to seeder if necessary, or ensure .env is in root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Read meals from JSON file
const mealsFilePath = path.resolve(__dirname, 'data', 'meals.json');
const mealsToSeed = JSON.parse(fs.readFileSync(mealsFilePath, 'utf-8'));


const importData = async () => {
  try {
    await connectDB();
    console.log('MongoDB Connected for seeding...');

    // Optional: Clear existing meals
    // await Meal.deleteMany();
    // console.log('Existing meals cleared.');

    await Meal.insertMany(mealsToSeed); // Changed from Product
    console.log('Meals Imported Successfully!'); // Changed from Products
    process.exit(0);
  } catch (error) {
    console.error('Error with data import:', error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    console.log('MongoDB Connected for destroying data...');

    await Meal.deleteMany(); // Changed from Product
    console.log('Meals Destroyed Successfully!'); // Changed from Products
    process.exit(0);
  } catch (error) {
    console.error('Error with data destruction:', error);
    process.exit(1);
  }
};

// Process command line arguments
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
