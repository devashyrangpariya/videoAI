"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, File as FileIcon, Video } from "lucide-react";
import Image from "next/image";

interface FileUploadProps {
  value: File | undefined;
  onChange: (file: File | undefined) => void;
  dropzoneOptions?: {
    maxSize?: number;
    accept?: Record<string, string[]>;
  };
}

const FileUpload = ({ value, onChange, dropzoneOptions }: FileUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  // Generate thumbnail for video files
  const generateThumbnail = useCallback((file: File) => {
    if (!file.type.startsWith("video/")) return;

    const videoUrl = URL.createObjectURL(file);
    setPreview(videoUrl);

    // Create a video element to extract the thumbnail
    const video = document.createElement("video");
    video.src = videoUrl;
    video.currentTime = 1; // Seek to 1 second
    video.muted = true;

    // Once metadata is loaded, seek to the specified time
    video.onloadedmetadata = () => {
      video.currentTime = Math.min(1, video.duration / 2);
    };

    // When the video has seeked to the specified time, capture the thumbnail
    video.onseeked = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const thumbnailUrl = canvas.toDataURL("image/jpeg");
        setThumbnailPreview(thumbnailUrl);
      }
    };
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      onChange(file);

      // Create preview for video files
      if (file.type.startsWith("video/")) {
        generateThumbnail(file);
      }
    },
    [onChange, generateThumbnail]
  );

  // Clean up the object URL when the component unmounts or when the file changes
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      maxSize: dropzoneOptions?.maxSize || 100 * 1024 * 1024, // 100MB default
      accept: dropzoneOptions?.accept || {
        "video/*": [".mp4", ".mov", ".avi", ".wmv"],
      },
      multiple: false,
    });

  const removeFile = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
    setThumbnailPreview(null);
    onChange(undefined);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`p-6 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors
          ${
            isDragActive
              ? "border-purple-500 bg-purple-50 dark:bg-purple-900/10"
              : "border-gray-300 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-600"
          }
          ${
            value
              ? "bg-purple-50 dark:bg-gray-800"
              : "bg-white dark:bg-gray-900"
          }`}
      >
        <input {...getInputProps()} />

        {value ? (
          <div className="flex flex-col items-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              {value.type.startsWith("video/") ? (
                <Video className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              ) : (
                <FileIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              )}
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[200px]">
                {value.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {(value.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeFile();
              }}
              className="text-xs font-medium text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
            >
              Change file
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Upload className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {isDragActive ? "Drop the file here" : "Drag and drop a video"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                or click to browse (max{" "}
                {(
                  (dropzoneOptions?.maxSize || 100 * 1024 * 1024) /
                  (1024 * 1024)
                ).toFixed(0)}{" "}
                MB)
              </p>
            </div>
          </div>
        )}
      </div>

      {fileRejections.length > 0 && (
        <div className="text-sm text-red-500 dark:text-red-400">
          {fileRejections[0].errors.map((error) => (
            <p key={error.code}>{error.message}</p>
          ))}
        </div>
      )}

      {value?.type.startsWith("video/") && (
        <div className="space-y-4">
          {/* Video Thumbnail Preview */}
          {thumbnailPreview && (
            <div className="relative rounded-lg overflow-hidden">
              <div className="aspect-video relative">
                <Image
                  src={thumbnailPreview}
                  alt="Video thumbnail"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white bg-opacity-80 flex items-center justify-center">
                    <Video className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Video Player */}
          <div className="relative">
            <button
              type="button"
              onClick={removeFile}
              className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 rounded-full z-10"
            >
              <X className="h-4 w-4 text-white" />
            </button>
            <video
              src={preview || undefined}
              controls
              className="w-full rounded-lg"
              style={{ maxHeight: "200px" }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
