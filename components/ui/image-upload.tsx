'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { ArrowUpTrayIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  onRemove?: () => void;
  disabled?: boolean;
  className?: string;
  maxSize?: number; // In MB
  accept?: string[];
  label?: string;
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  disabled = false,
  className,
  maxSize = 5, // Default 5MB
  accept = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
  label = 'Upload Image'
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setError(null);
      
      // Check if files exist
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      
      // Check file size (convert maxSize from MB to bytes)
      if (file.size > maxSize * 1024 * 1024) {
        setError(`File size exceeds ${maxSize}MB limit`);
        return;
      }

      try {
        setIsUploading(true);
        
        // Create a preview URL
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        
        // Here you'd typically upload to a server, for demo we'll simulate it
        // In a real app, replace with actual upload logic
        const mockServerUpload = () => {
          return new Promise<string>((resolve) => {
            setTimeout(() => {
              // This would be the URL returned from the server
              resolve(objectUrl);
            }, 1000);
          });
        };
        
        const uploadedUrl = await mockServerUpload();
        onChange(uploadedUrl);
      } catch (err: any) {
        setError(err.message || 'Failed to upload image');
        setPreview(null);
      } finally {
        setIsUploading(false);
      }
    },
    [maxSize, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    disabled: disabled || isUploading,
    maxFiles: 1,
  });

  const handleRemove = useCallback(() => {
    setPreview(null);
    onRemove?.();
    
    // Release object URL to prevent memory leaks
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
  }, [preview, onRemove]);

  return (
    <div className={cn('space-y-4', className)}>
      {preview ? (
        <div className="relative aspect-square rounded-md overflow-hidden">
          <div className="absolute top-2 right-2 z-10">
            <button
              onClick={handleRemove}
              disabled={disabled}
              type="button"
              className="rounded-full bg-black/70 p-1.5 text-white hover:bg-black/90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-purple-500"
            >
              <XMarkIcon className="h-4 w-4" />
              <span className="sr-only">Remove image</span>
            </button>
          </div>
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            'relative flex flex-col items-center justify-center border-2 border-dashed rounded-md p-6 transition-colors cursor-pointer',
            isDragActive 
              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
              : 'border-gray-300 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-600',
            disabled && 'opacity-50 cursor-not-allowed',
            isUploading && 'opacity-70 cursor-wait',
          )}
        >
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center justify-center text-center gap-2">
            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <ArrowUpTrayIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-purple-500" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Uploading...</p>
              </div>
            ) : (
              <>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Drag & drop or click to upload <br />
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    (Max. {maxSize}MB) 
                  </span>
                </p>
              </>
            )}
          </div>
        </div>
      )}
      
      {error && (
        <p className="text-sm text-red-500 mt-2">{error}</p>
      )}
    </div>
  );
} 
 