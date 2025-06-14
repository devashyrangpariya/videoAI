"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { formatDistance } from "date-fns";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import VideoPlayer from "@/app/components/VideoPlayer";

interface VideoData {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  userId: string;
  createdAt: string;
  user?: {
    name: string;
    image?: string;
  };
}

export default function VideoDetailPage() {
  const params = useParams();
  const videoId = params.id as string;

  const [video, setVideo] = useState<VideoData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVideo() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/videos/${videoId}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Video not found");
          }
          throw new Error("Failed to fetch video");
        }

        const data = await response.json();
        setVideo(data);
      } catch (err) {
        console.error("Error fetching video:", err);
        setError(err instanceof Error ? err.message : "Failed to load video");
        toast.error(
          err instanceof Error ? err.message : "Failed to load video"
        );
      } finally {
        setIsLoading(false);
      }
    }

    if (videoId) {
      fetchVideo();
    }
  }, [videoId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg text-center">
          <h2 className="text-xl font-semibold text-red-700 dark:text-red-400 mb-2">
            Error
          </h2>
          <p className="text-red-600 dark:text-red-300">{error}</p>
          <Link
            href="/video"
            className="mt-4 inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            <ChevronLeft size={16} className="mr-1" />
            Back to videos
          </Link>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Video not found</h2>
        <Link
          href="/video"
          className="mt-4 inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back to videos
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link
        href="/video"
        className="inline-flex items-center px-3 py-1 mb-6 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
      >
        <ChevronLeft size={16} className="mr-1" />
        Back to videos
      </Link>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="aspect-video relative w-full">
          <VideoPlayer
            src={video.videoUrl}
            poster={video.thumbnailUrl}
            title={video.title}
          />
        </div>

        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
            {video.title}
          </h1>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-sm font-medium overflow-hidden">
                {video.user?.image ? (
                  <Image
                    src={video.user.image}
                    alt={video.user.name || "User"}
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                ) : (
                  video.user?.name?.charAt(0) || "?"
                )}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                {video.user?.name || "Anonymous"}
              </span>
            </div>

            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatDistance(new Date(video.createdAt), new Date(), {
                addSuffix: true,
              })}
            </span>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              Description
            </h3>
            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
              {video.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
