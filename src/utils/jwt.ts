import jwt, { SignOptions } from 'jsonwebtoken';

const DEFAULT_EXPIRES_IN = '30d';

/**
 * Generates a JSON Web Token (JWT) for a given user ID.
 * @param userId - The ID of the user to sign the token for.
 * @returns The generated JWT.
 */
export const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = (process.env.JWT_EXPIRES_IN || DEFAULT_EXPIRES_IN) as SignOptions['expiresIn'];

  if (!secret) {
    console.error('JWT_SECRET is not defined in environment variables.');
    throw new Error('Server configuration error: JWT secret is missing.');
  }

  const options: SignOptions = {
    expiresIn,
  };

  return jwt.sign({ id: userId }, secret, options);
};

