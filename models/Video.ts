/**
 * Video Model
 * 
 * Defines the schema for videos in the application.
 * Used for storing video metadata and relationships to users.
 */

import mongoose, { Schema, Document } from 'mongoose';

export const VIDEO_DIMENSIONS = {
  width: 1080,
  height: 1920,
} as const;

/**
 * Video interface defining the structure of a video document
 */
export interface IVideo extends Document {
  _id?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  userId: mongoose.Types.ObjectId | string;
  controls?: boolean;
  transformation?: {
    width: number;
    height: number;
    quality?: number;
  };
  views: number;
  likes: number;
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Video schema definition
 */
const VideoSchema = new Schema<IVideo>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [5000, 'Description cannot be more than 5000 characters'],
    },
    videoUrl: {
      type: String,
      required: [true, 'Video URL is required'],
    },
    thumbnailUrl: {
      type: String,
      required: [true, 'Thumbnail URL is required'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    controls: {
      type: Boolean,
      default: true,
    },
    transformation: {
      height: {
        type: Number,
        default: VIDEO_DIMENSIONS.height,
      },
      width: {
        type: Number,
        default: VIDEO_DIMENSIONS.width,
      },
      quality: {
        type: Number,
        min: 1,
        max: 100,
      },
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for faster queries
VideoSchema.index({ title: 'text', description: 'text' });
VideoSchema.index({ userId: 1 });
VideoSchema.index({ createdAt: -1 });

// Use existing model or create a new one
const Video = mongoose.models.Video || mongoose.model<IVideo>('Video', VideoSchema);

export default Video;
