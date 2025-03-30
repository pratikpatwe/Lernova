"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

interface UploadButtonProps {
  onUploadComplete: (urls: string[]) => void
  onUploadError: (error: Error) => void
  className?: string
}

export function UploadButton({ onUploadComplete, onUploadError, className }: UploadButtonProps) {
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)

    try {
      // In a real app, you would upload to your storage service here
      // For this example, we'll simulate a successful upload with a timeout
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate fake URLs for the uploaded files
      const urls = Array.from(files).map(
        (file, index) => `https://example.com/uploads/${Date.now()}-${index}-${file.name}`,
      )

      onUploadComplete(urls)
    } catch (error) {
      onUploadError(error instanceof Error ? error : new Error("Upload failed"))
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className={className}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isUploading}
        onClick={() => document.getElementById("file-upload")?.click()}
      >
        {isUploading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Uploading...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4 mr-2" />
            Upload File
          </>
        )}
      </Button>
      <input
        id="file-upload"
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx,.zip,.jpg,.jpeg,.png"
      />
    </div>
  )
}

