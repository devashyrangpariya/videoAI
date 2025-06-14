"use client"

import * as React from "react"
import { useDropzone, type DropzoneOptions } from "react-dropzone"
import { twMerge } from "tailwind-merge"
import { UploadCloudIcon, X } from "lucide-react"

const variants = {
  base: "relative rounded-md flex justify-center items-center flex-col cursor-pointer min-h-[150px] border border-dashed border-gray-400 transition-colors duration-200 ease-in-out",
  image: "border-0 p-0 min-h-0 flex-row",
  active: "border-2",
  disabled: "bg-gray-200 cursor-default pointer-events-none",
  accept: "border border-blue-500 bg-blue-50",
  reject: "border border-red-500 bg-red-50",
}

type InputProps = {
  width?: number | string
  height?: number | string
  className?: string
  value?: File | string
  onChange?: (file?: File) => void | Promise<void>
  disabled?: boolean
  dropzoneOptions?: Omit<DropzoneOptions, "disabled">
}

const ERROR_MESSAGES = {
  fileTooLarge(maxSize: number) {
    return `The file is too large. Max size is ${formatFileSize(maxSize)}.`
  },
  fileInvalidType() {
    return "Invalid file type."
  },
  tooManyFiles(maxFiles: number) {
    return `You can only add ${maxFiles} file(s).`
  },
  fileNotSupported() {
    return "The file is not supported."
  },
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) {
    return bytes + " bytes"
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(2) + " KB"
  } else if (bytes < 1024 * 1024 * 1024) {
    return (bytes / (1024 * 1024)).toFixed(2) + " MB"
  } else {
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB"
  }
}

export const FileUpload = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      dropzoneOptions,
      width,
      height,
      value,
      className,
      disabled,
      onChange,
      ...props
    },
    ref
  ) => {
    const imageUrl = React.useMemo(() => {
      if (typeof value === "string") {
        return value
      } else if (value) {
        return URL.createObjectURL(value)
      }
      return null
    }, [value])

    const {
      getRootProps,
      getInputProps,
      acceptedFiles,
      fileRejections,
      isFocused,
      isDragAccept,
      isDragReject,
    } = useDropzone({
      accept: {
        "video/*": [".mp4", ".avi", ".mov", ".wmv"],
      },
      multiple: false,
      disabled,
      onDrop: (acceptedFiles) => {
        const file = acceptedFiles[0]
        if (file) {
          onChange?.(file)
        }
      },
      ...dropzoneOptions,
    })

    const dropzoneClassName = React.useMemo(() => {
      const defaultClasses = variants.base
      const variantClasses = imageUrl ? variants.image : ""
      const activeClasses =
        isFocused || isDragAccept ? variants.active : variants.disabled
      const rejectClasses = isDragReject ? variants.reject : ""
      const acceptClasses = isDragAccept ? variants.accept : ""

      return twMerge(
        defaultClasses,
        variantClasses,
        disabled ? variants.disabled : activeClasses,
        rejectClasses,
        acceptClasses,
        className
      )
    }, [
      isFocused,
      isDragAccept,
      isDragReject,
      disabled,
      imageUrl,
      className,
    ])

    const errorMessage = React.useMemo(() => {
      if (fileRejections[0]) {
        const { errors } = fileRejections[0]
        if (errors[0]?.code === "file-too-large") {
          return ERROR_MESSAGES.fileTooLarge(dropzoneOptions?.maxSize ?? 0)
        } else if (errors[0]?.code === "file-invalid-type") {
          return ERROR_MESSAGES.fileInvalidType()
        } else if (errors[0]?.code === "too-many-files") {
          return ERROR_MESSAGES.tooManyFiles(dropzoneOptions?.maxFiles ?? 0)
        } else {
          return ERROR_MESSAGES.fileNotSupported()
        }
      }
      return undefined
    }, [fileRejections, dropzoneOptions])

    return (
      <div className="w-full">
        <div
          {...getRootProps({
            className: dropzoneClassName,
            style: {
              width,
              height,
            },
          })}
        >
          <input ref={ref} {...getInputProps()} {...props} />
          
          {imageUrl ? (
            <div className="relative w-full h-auto overflow-hidden rounded-md">
              <video
                className="w-full h-auto object-contain"
                controls
                src={imageUrl}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onChange?.(undefined)
                  }}
                  className="p-1.5 rounded-full bg-red-600 text-white opacity-90 hover:opacity-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-3 p-5 text-center">
              <div className="p-3 bg-gray-100 rounded-full">
                <UploadCloudIcon className="w-10 h-10 text-gray-600" />
              </div>
              <div className="space-y-1">
                <p className="text-base font-medium text-gray-700">
                  Drag and drop your video
                </p>
                <p className="text-sm text-gray-500">
                  or click to browse (MP4, AVI, MOV, WMV up to 100MB)
                </p>
              </div>
            </div>
          )}
        </div>
        {errorMessage && <p className="mt-1 text-sm text-red-500">{errorMessage}</p>}
      </div>
    )
  }
)

FileUpload.displayName = "FileUpload"
