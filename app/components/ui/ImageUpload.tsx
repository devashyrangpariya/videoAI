"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  value: File | string | null;
  onChange: (value: File | null) => void;
  onUpload?: (url: string) => void;
  className?: string;
  maxSize?: number; // in bytes
  aspectRatio?: number; // width / height
  dropzoneText?: string;
}

export default function ImageUpload({
  value,
  onChange,
  onUpload,
  className = "",
  maxSize = 5 * 1024 * 1024, // 5MB default
  aspectRatio,
  dropzoneText = "Drag & drop an image here, or click to select",
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(
    typeof value === "string" ? value : null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      onChange(file);

      // Create preview
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      setError(null);

      // Simulate upload if onUpload is provided
      if (onUpload) {
        simulateUpload(file);
      }
    },
    [onChange, onUpload]
  );

  const simulateUpload = (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);

          // Simulate a server response with the file URL
          if (onUpload) {
            const mockUrl = URL.createObjectURL(file);
            onUpload(mockUrl);
          }

          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: {
        "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
      },
      maxSize,
      multiple: false,
    });

  const removeImage = () => {
    onChange(null);
    if (preview && typeof value !== "string") {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
  };

  // Show errors from file rejections
  const fileRejectionError = fileRejections[0]?.errors[0]?.message;
  if (fileRejectionError && !error) {
    setError(fileRejectionError);
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {!preview ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors ${
            isDragActive
              ? "border-purple-500 bg-purple-50 dark:bg-purple-900/10"
              : "border-gray-300 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-600"
          }`}
        >
          <input {...getInputProps()} />
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30">
              <Upload className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="mt-3 text-center sm:mt-5">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                {isDragActive ? "Drop the image here" : dropzoneText}
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  PNG, JPG, GIF up to {Math.round(maxSize / (1024 * 1024))}MB
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden">
          <div className="aspect-square w-full relative">
            <Image src={preview} alt="Preview" fill className="object-cover" />
          </div>
          <div className="absolute top-2 right-2 flex space-x-2">
            <button
              onClick={removeImage}
              type="button"
              className="p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {isUploading && (
        <div className="w-full">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-purple-700 dark:text-purple-400">
              Uploading...
            </span>
            <span className="text-xs font-medium text-purple-700 dark:text-purple-400">
              {uploadProgress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
