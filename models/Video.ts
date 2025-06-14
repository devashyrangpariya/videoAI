
import mongoose, { Schema, Document, Types } from 'mongoose';

export const VIDEO_DIMENSIONS = {
  width: 1080,
  height: 1920,
} as const;

export interface IVideo {
  _id?: Types.ObjectId;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  userId: Types.ObjectId | string;
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

export type VideoDocument = IVideo & Document;

const VideoSchema = new Schema<VideoDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    videoUrl: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    controls: {
      type: Boolean,
      default: true,
    },
    transformation: {
      height: { type: Number, default: VIDEO_DIMENSIONS.height },
      width: { type: Number, default: VIDEO_DIMENSIONS.width },
      quality: { type: Number, min: 1, max: 100 },
    },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

VideoSchema.index({ title: 'text', description: 'text' });
VideoSchema.index({ userId: 1 });
VideoSchema.index({ createdAt: -1 });

const Video = mongoose.models.Video || mongoose.model<VideoDocument>('Video', VideoSchema);

export default Video;
