/**
 * MongoDB Connection Utility
 * 
 * This module provides a cached connection to MongoDB using Mongoose.
 * It ensures that we reuse connections across API routes for better performance.
 * 
 * Note: This file is an alias for db.ts and is kept for backward compatibility.
 * New code should use connectToDatabase from db.ts directly.
 */

import mongoose, { Connection } from 'mongoose';
import { connectToDatabase } from './db';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Connect to the MongoDB database
 * 
 * @returns A Promise resolving to the Mongoose connection
 */
export async function connectToDB() {
  return connectToDatabase();
} 