import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// Interface describing the properties for creating a new User
export interface IUser {
  name: string;
  email: string;
  password: string;
}

// Interface describing the User document returned by Mongoose (includes methods)
export interface IUserDocument extends IUser, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please use a valid email address.'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false, // Do not return password on queries by default
    },
  },
  { timestamps: true }
);

// Pre-save middleware to hash password
UserSchema.pre<IUserDocument>('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  // Hash the password with a salt round of 12
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method to compare candidate password with the user's password
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  // 'this.password' is accessible here because 'select: false' does not apply to instance methods
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = model<IUserDocument>('User', UserSchema);

export default User;