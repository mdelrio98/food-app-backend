import { Schema, model } from 'mongoose';
import { IUser } from '../types/user.types';
// import bcrypt from 'bcryptjs'; // Uncomment if you add password hashing

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: false, // Set to true if password is mandatory for all users
      // select: false, // Optionally hide password by default when querying users
    },
    name: {
      type: String,
      trim: true,
    },
    // Define other user fields here
  },
  { timestamps: true } // Adds createdAt and updatedAt timestamps
);

// Example pre-save hook for password hashing (if you implement user registration)
// UserSchema.pre<IUser>('save', async function (next) {
//   if (!this.isModified('password') || !this.password) {
//     return next();
//   }
//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (error) {
//     // Ensure error is an instance of Error before passing to next
//     if (error instanceof Error) {
//        next(error);
//     } else {
//        next(new Error('An unknown error occurred during password hashing'));
//     }
//   }
// });

const User = model<IUser>('User', UserSchema);

export default User;
