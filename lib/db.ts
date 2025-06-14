/**
 * Database Connection Utility
 * 
 * This module provides a cached connection to MongoDB using Mongoose.
 * It ensures that we reuse connections across API routes for better performance.
 */

import mongoose, { Connection } from "mongoose";

// Validate MongoDB URI
if (!process.env.MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env");
}

const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
interface GlobalWithMongoose {
  mongoose: {
    conn: Connection | null;
    promise: Promise<Connection> | null;
  };
}

// Add mongoose to the global type
declare const global: GlobalWithMongoose;

// Initialize the connection cache
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Connect to the MongoDB database
 * 
 * @returns A Promise resolving to the Mongoose connection
 */
export async function connectToDatabase(): Promise<Connection> {
  // If we have a connection, return it
  if (cached.conn) {
    return cached.conn;
  }

  // If a connection is being established, wait for it
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose.connection;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
