"use client";

import { useState } from "react";
import ImageUpload from "@/app/components/ui/ImageUpload";
import { toast } from "react-hot-toast";

export default function ImageUploadDemo() {
  const [image, setImage] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const handleImageChange = (file: File | null) => {
    setImage(file);
  };

  const handleUpload = (url: string) => {
    setUploadedUrl(url);
    toast.success("Image uploaded successfully!");
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Image Upload Demo
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Upload an Image</h2>

          <ImageUpload
            value={image}
            onChange={handleImageChange}
            onUpload={handleUpload}
            maxSize={10 * 1024 * 1024} // 10MB
            dropzoneText="Drop your image here or click to browse"
          />

          {uploadedUrl && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Uploaded Image URL:</h3>
              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded break-all">
                <code className="text-sm">{uploadedUrl}</code>
              </div>
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Selected Image:</h3>
            {image ? (
              <div className="text-sm">
                <p>
                  <strong>Name:</strong> {image.name}
                </p>
                <p>
                  <strong>Size:</strong> {(image.size / 1024).toFixed(2)} KB
                </p>
                <p>
                  <strong>Type:</strong> {image.type}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No image selected
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
