"use client";

import React, { useState, useEffect } from "react";
import VideoFeed from "@/app/components/video/VideoFeed";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

export default function VideoPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchInitialVideos = async () => {
      try {
        const response = await fetch("/api/videos?page=1&limit=12");

        if (!response.ok) {
          throw new Error("Failed to fetch videos");
        }

        const data = await response.json();
        setVideos(data.videos || []);
      } catch (error) {
        console.error("Error fetching videos:", error);
        toast.error("Failed to load videos");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialVideos();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Video Gallery
        </h1>
        <Link
          href="/video/upload"
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Upload Video
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <VideoFeed initialVideos={videos} />
      )}
    </div>
  );
}
