/**
 * User Model
 * 
 * Defines the schema for users in the application.
 * Used for authentication and user management.
 */

import mongoose, { Schema, Document } from 'mongoose';

/**
 * User interface defining the structure of a user document
 */
export interface IUser extends Document {
  name?: string;
  email: string;
  image?: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User schema definition
 */
const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    image: {
      type: String,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

// Use existing model or create a new one
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
