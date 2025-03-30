"use client"

import type React from "react"

import { useCallback, useState } from "react"
import { useUploadThing } from "@/lib/uploadthing-client"
import { Upload } from "lucide-react"

interface UploadButtonProps {
  onUploadComplete: (urls: string[]) => void
  onUploadError: (error: Error) => void
}

export function UploadButton({ onUploadComplete, onUploadError }: UploadButtonProps) {
  const [isUploading, setIsUploading] = useState(false)

  const { startUpload } = useUploadThing("streamAttachment", {
    onClientUploadComplete: (res) => {
      setIsUploading(false)
      const urls = res.map((file) => file.url)
      onUploadComplete(urls)
    },
    onUploadError: (error) => {
      setIsUploading(false)
      onUploadError(error)
    },
  })

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || e.target.files.length === 0) return

      setIsUploading(true)
      await startUpload(Array.from(e.target.files))
    },
    [startUpload],
  )

  return (
    <label className="flex items-center gap-2 cursor-pointer text-orange-600 hover:text-orange-800">
      <Upload size={20} aria-hidden="true" />
      <span>{isUploading ? "Uploading..." : "Add attachment"}</span>
      <input
        type="file"
        multiple
        className="hidden"
        onChange={handleFileChange}
        accept="image/*,.pdf,.doc,.docx,.ppt,.pptx"
        disabled={isUploading}
      />
    </label>
  )
}

