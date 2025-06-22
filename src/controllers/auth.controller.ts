import { Request, Response } from 'express';
import User, { IUserDocument } from '../models/User';
import { generateToken } from '../utils/jwt';
import { transformResponse } from '../utils/responseTransformer';

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Log the received email for debugging
    console.log('Attempting to register with email:', email, '| Type:', typeof email);

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password.' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: 'User already exists.' });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
    });

    // Generate token
    const token = generateToken(user._id.toString());

    // Transform user object for response
    const userResponse = transformResponse(user);

    // Respond with user data and token
    res.status(201).json({
      ...userResponse,
      token,
    });
  } catch (error: any) {
    // Log the full error for better diagnostics
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Error during registration.', error: error.message });
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password.' });
    }

    // Find user by email, explicitly including the password
    const user = await User.findOne({ email }).select('+password');

    // Check if user exists and password is correct
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Generate token
    const token = generateToken(user._id.toString());

    // Transform user object for response (password will be excluded by schema's toJSON)
    const userResponse = transformResponse(user);

    // Respond with user data and token
    res.status(200).json({
      ...userResponse,
      token,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error during login.', error: error.message });
  }
};
