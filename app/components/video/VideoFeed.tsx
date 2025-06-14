"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import VideoCard from "@/app/components/VideoCard";

interface Video {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  userId: string;
  createdAt: string;
  user?: {
    name: string;
  };
}

interface VideoFeedProps {
  initialVideos?: Video[];
}

export default function VideoFeed({ initialVideos = [] }: VideoFeedProps) {
  const [videos, setVideos] = useState<Video[]>(initialVideos);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchVideos = async (pageNum = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/videos?page=${pageNum}&limit=12`);

      if (!response.ok) {
        throw new Error("Failed to fetch videos");
      }

      const data = await response.json();

      if (pageNum === 1) {
        setVideos(data.videos);
      } else {
        setVideos((prev) => [...prev, ...data.videos]);
      }

      setHasMore(data.videos.length === 12);
      setPage(pageNum);
    } catch (err) {
      console.error("Error fetching videos:", err);
      setError("Failed to load videos. Please try again later.");
      toast.error("Failed to load videos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialVideos.length === 0) {
      fetchVideos();
    } else {
      setHasMore(initialVideos.length === 12);
    }
  }, [initialVideos]);

  const loadMore = () => {
    fetchVideos(page + 1);
  };

  return (
    <div className="w-full">
      {error && (
        <div className="bg-red-50 p-4 rounded-lg mb-6 text-red-600">
          {error}
        </div>
      )}

      {videos.length === 0 && !loading ? (
        <div className="text-center py-10">
          <h3 className="text-xl font-medium text-gray-700">No videos found</h3>
          <p className="text-gray-500 mt-2">Be the first to upload a video!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}

      {loading && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      )}

      {hasMore && videos.length > 0 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}
