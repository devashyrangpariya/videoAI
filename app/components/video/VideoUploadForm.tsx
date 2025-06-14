"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import FileUpload from "@/app/components/ui/FileUpload";

interface VideoUploadFormProps {
  onUploadComplete?: (url: string) => void;
  userId?: string;
}

export default function VideoUploadForm({
  onUploadComplete,
  userId,
}: VideoUploadFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoFile, setVideoFile] = useState<File | undefined>(undefined);
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    videoFile?: string;
  }>({});

  const validateForm = () => {
    const newErrors: {
      title?: string;
      description?: string;
      videoFile?: string;
    } = {};
    let isValid = true;

    if (!title.trim()) {
      newErrors.title = "Title is required";
      isValid = false;
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    }

    if (!videoFile) {
      newErrors.videoFile = "Please select a video file";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleUploadSuccess = async (res: any) => {
    try {
      if (!userId) {
        toast.error("User authentication error. Please log in again.");
        setIsUploading(false);
        return;
      }

      if (!res || !res.url) {
        toast.error("Upload failed: Missing video URL from response");
        setIsUploading(false);
        return;
      }

      const videoData = {
        title: title.trim(),
        description: description.trim(),
        videoUrl: res.url,
        thumbnailUrl: res.thumbnailUrl || res.url,
        userId,
      };

      const response = await fetch("/api/videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(videoData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save video data");
      }

      toast.success("Video uploaded successfully!");
      router.refresh();
      if (onUploadComplete) {
        onUploadComplete(res.url);
      }

      // Reset form after successful upload
      setTitle("");
      setDescription("");
      setVideoFile(undefined);
      setErrors({});
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save video data"
      );
      console.error("Error saving video:", error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleUploadError = (err: any) => {
    toast.error("Failed to upload video");
    console.error("Upload error:", err);
    setIsUploading(false);
    setUploadProgress(0);
  };

  const handleUploadProgress = (
    evt: ProgressEvent<XMLHttpRequestEventTarget>
  ) => {
    const progress = Math.round((evt.loaded * 100) / evt.total);
    setUploadProgress(progress);
  };

  const uploadVideo = () => {
    if (!validateForm() || !videoFile) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsUploading(true);

    // Create a FormData object and append the video file
    const formData = new FormData();
    formData.append("file", videoFile);

    // Use mock data for demo purposes if ImageKit isn't configured
    // In a real app, you'd upload to a service like ImageKit, Cloudinary, etc.
    setTimeout(() => {
      // Mock successful upload
      const mockVideoUrl = URL.createObjectURL(videoFile);

      handleUploadSuccess({
        url: mockVideoUrl,
        thumbnailUrl: mockVideoUrl,
      });
    }, 2000);

    // Update progress indicator to simulate upload
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 100);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Upload Video</h2>

      <form className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (e.target.value.trim()) {
                setErrors({ ...errors, title: undefined });
              }
            }}
            className={`mt-1 block w-full rounded-lg border ${
              errors.title ? "border-red-500" : "border-gray-300"
            } shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-colors duration-200`}
            required
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (e.target.value.trim()) {
                setErrors({ ...errors, description: undefined });
              }
            }}
            rows={4}
            className={`mt-1 block w-full rounded-lg border ${
              errors.description ? "border-red-500" : "border-gray-300"
            } shadow-sm focus:border-purple-500 focus:ring-purple-500 transition-colors duration-200`}
            required
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Video File <span className="text-red-500">*</span>
          </label>
          <FileUpload
            value={videoFile}
            onChange={(file) => {
              setVideoFile(file);
              if (file) {
                setErrors({ ...errors, videoFile: undefined });
              }
            }}
            dropzoneOptions={{
              maxSize: 100 * 1024 * 1024, // 100MB
              accept: {
                "video/*": [".mp4", ".mov", ".avi", ".wmv"],
              },
            }}
          />
          {errors.videoFile && (
            <p className="mt-1 text-sm text-red-500">{errors.videoFile}</p>
          )}
        </div>

        {isUploading && (
          <div className="mt-4">
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-600 bg-purple-200">
                    Upload Progress
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-purple-600">
                    {uploadProgress}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200">
                <div
                  style={{ width: `${uploadProgress}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500 transition-all duration-500"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={uploadVideo}
            disabled={isUploading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isUploading ? "Uploading..." : "Upload Video"}
          </button>
        </div>
      </form>
    </div>
  );
}
