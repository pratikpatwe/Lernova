"use client"

import { useState, useEffect } from "react"
import {
  File,
  ImageIcon,
  FileText,
  FileType2,
  Maximize,
  Minimize,
  ExternalLink,
  Download,
  ChevronDown,
} from "lucide-react"
import { database } from "@/lib/firebase"
import { ref as dbRef, onValue, get } from "firebase/database"
import { useUser } from "@clerk/nextjs"
import Image from "next/image"

interface FileAttachment {
  id: number
  name: string
  type: string
  size: number
  url: string
}

interface Post {
  id: string
  text: string
  attachments: FileAttachment[]
  timestamp: Date
  senderEmail: string
  senderName: string
  senderRole?: string
  batch: string
}

// Firebase data types
interface FirebasePostData {
  text?: string
  attachments?: FileAttachment[]
  timestamp: number
  senderEmail?: string
  senderName?: string
  trainerEmail?: string // Keep for backward compatibility
  trainerName?: string // Keep for backward compatibility
  senderRole?: string
  batch: string
}

// Update the component to fetch student data based on email
export default function StudentStream() {
  const { user } = useUser()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [previewFile, setPreviewFile] = useState<FileAttachment | null>(null)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const [studentBatches, setStudentBatches] = useState<string[]>([])
  const [selectedBatch, setSelectedBatch] = useState<string>("")
  const [isBatchDropdownOpen, setIsBatchDropdownOpen] = useState<boolean>(false)

  // Add fullscreen change event listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  // Fetch student data and batches
  useEffect(() => {
    if (!user?.primaryEmailAddress?.emailAddress) return

    const studentEmail = user.primaryEmailAddress.emailAddress
    const studentsRef = dbRef(database, "students")

    // We need to fetch all students and filter by email since Firebase Realtime DB
    // doesn't support querying nested properties directly
    const fetchStudentData = async () => {
      try {
        const snapshot = await get(studentsRef)

        if (snapshot.exists()) {
          const studentsData = snapshot.val()

          // Find the student with matching email
          const studentId = Object.keys(studentsData).find((key) => studentsData[key].email === studentEmail)

          if (studentId) {
            const studentData = studentsData[studentId]
            const batches = studentData.batches || []

            setStudentBatches(batches)

            // If student has batches, select the first one by default
            if (batches.length > 0) {
              setSelectedBatch(batches[0])
            } else {
              setError("You are not assigned to any batch.")
              setLoading(false)
            }
          } else {
            setError("Student record not found. Please contact your administrator.")
            setLoading(false)
          }
        } else {
          setError("No student data available.")
          setLoading(false)
        }
      } catch (error) {
        console.error("Error fetching student data:", error)
        setError("Failed to load student data: " + (error instanceof Error ? error.message : String(error)))
        setLoading(false)
      }
    }

    fetchStudentData()
  }, [user])

  // Fetch posts when batch is selected
  useEffect(() => {
    if (selectedBatch) {
      const postsRef = dbRef(database, `streams/${selectedBatch}`)
      const unsubscribe = onValue(
        postsRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const postsData = snapshot.val()
            const postsArray = Object.entries(postsData)
              .map(([id, data]) => {
                const postData = data as FirebasePostData
                return {
                  id,
                  text: postData.text || "",
                  attachments: postData.attachments || [],
                  timestamp: new Date(postData.timestamp || Date.now()),
                  senderEmail: postData.senderEmail || postData.trainerEmail || "",
                  senderName: postData.senderName || postData.trainerName || "Unknown Sender",
                  senderRole: postData.senderRole,
                  batch: postData.batch,
                }
              })
              .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

            setPosts(postsArray)
          } else {
            setPosts([])
          }
          setLoading(false)
        },
        (error) => {
          setError("Failed to load posts: " + error.message)
          setLoading(false)
        },
      )

      return () => unsubscribe()
    }
  }, [selectedBatch])

  const handleBatchSelect = (batch: string) => {
    setSelectedBatch(batch)
    setIsBatchDropdownOpen(false)
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("image")) return <ImageIcon className="text-orange-600" size={20} aria-hidden="true" />
    if (fileType.includes("pdf")) return <FileText className="text-orange-600" size={20} aria-hidden="true" />
    if (fileType.includes("word") || fileType.includes("document"))
      return <File className="text-orange-600" size={20} aria-hidden="true" />
    if (fileType.includes("presentation") || fileType.includes("powerpoint"))
      return <FileType2 className="text-orange-600" size={20} aria-hidden="true" />
    return <File className="text-orange-600" size={20} aria-hidden="true" />
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "Unknown size"
    if (bytes < 1024) return bytes + " bytes"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  const formatTimestamp = (date: Date): string => {
    try {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }).format(date)
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Invalid date"
    }
  }

  const isOfficeDocument = (file: FileAttachment): boolean => {
    return (
      file.type.includes("word") ||
      file.type.includes("document") ||
      file.type.includes("presentation") ||
      file.type.includes("powerpoint") ||
      file.url.toLowerCase().match(/\.(doc|docx|ppt|pptx|pptm|ppsx|pps)$/i) !== null
    )
  }

  const isPdfDocument = (file: FileAttachment): boolean => {
    return file.type.includes("pdf") || file.url.toLowerCase().endsWith(".pdf")
  }

  const isImageFile = (file: FileAttachment): boolean => {
    return file.type.includes("image") || file.url.toLowerCase().match(/\.(jpeg|jpg|png|gif|webp)$/i) !== null
  }

  const openFilePreview = (file: FileAttachment): void => {
    setPreviewFile(file)

    // For non-viewable files, just download them directly
    if (!isImageFile(file) && !isPdfDocument(file) && !isOfficeDocument(file)) {
      window.open(file.url, "_blank")
    }
  }

  const closeFilePreview = (): void => {
    setPreviewFile(null)

    // Exit fullscreen if active
    if (document.fullscreenElement) {
      document.exitFullscreen().catch((err) => {
        console.error(`Error attempting to exit fullscreen: ${err.message}`)
      })
    }
  }

  const toggleFullscreen = (): void => {
    const previewElement = document.getElementById("file-preview-container")

    if (!previewElement) return

    if (!document.fullscreenElement) {
      previewElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
    } else {
      document.exitFullscreen().catch((err) => {
        console.error(`Error attempting to exit fullscreen: ${err.message}`)
      })
    }
  }

  const handleExternalView = (file: FileAttachment): void => {
    // Open the file in a new tab directly
    window.open(file.url, "_blank")
  }

  if (loading) {
    return <div className="max-w-4xl mx-auto p-4 text-center">Loading class stream...</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-orange-600 mb-6">Class Stream</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-4">
          {error}
          <button className="ml-2 font-bold" onClick={() => setError(null)} aria-label="Dismiss error">
            ×
          </button>
        </div>
      )}

      {/* Batch selection dropdown (only if student has multiple batches) */}
      {studentBatches.length > 1 && (
        <div className="mb-6">
          <div className="relative">
            <button
              type="button"
              className="bg-white border border-orange-200 p-3 rounded-lg w-full text-left flex justify-between items-center"
              onClick={() => setIsBatchDropdownOpen(!isBatchDropdownOpen)}
            >
              <span>{selectedBatch ? `Batch: ${selectedBatch}` : "Select a Batch"}</span>
              <ChevronDown
                size={20}
                className={`text-orange-600 transition-transform ${isBatchDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isBatchDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-orange-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {studentBatches.map((batch) => (
                  <button
                    key={batch}
                    className="w-full text-left p-3 hover:bg-orange-50 focus:bg-orange-50"
                    onClick={() => handleBatchSelect(batch)}
                  >
                    {batch}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stream posts */}
      <div className="space-y-4">
        {selectedBatch && <h2 className="text-xl font-semibold mb-4">{selectedBatch} - Stream</h2>}

        {posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center border border-orange-100">
            <p className="text-gray-500">No posts yet in your class stream.</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md p-4 border border-orange-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-orange-200 flex items-center justify-center text-orange-600 font-bold">
                  {post.senderName && post.senderName.length > 0 ? post.senderName.charAt(0) : "?"}
                </div>
                <div>
                  <div className="font-medium">{post.senderName}</div>
                  <div className="text-xs text-gray-500">
                    {post.senderRole && <span className="mr-2">{post.senderRole}</span>}
                    {formatTimestamp(post.timestamp)}
                  </div>
                </div>
              </div>

              {post.text && <p className="mb-4 whitespace-pre-wrap">{post.text}</p>}

              {post.attachments && post.attachments.length > 0 && (
                <div className="space-y-2 mt-3">
                  {post.attachments.map((file) => (
                    <button
                      key={file.id}
                      onClick={() => openFilePreview(file)}
                      className="w-full flex items-center p-3 border border-orange-100 rounded-lg hover:bg-orange-50 transition-colors"
                    >
                      {getFileIcon(file.type)}
                      <div className="ml-3 text-left">
                        <div className="text-sm font-medium text-gray-800">{file.name}</div>
                        <div className="text-xs text-gray-500">{formatFileSize(file.size)}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* File preview modal - Modified to handle different file types */}
      {previewFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 md:p-8">
          <div
            id="file-preview-container"
            className="bg-white rounded-lg shadow-lg w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden"
          >
            <div className="flex justify-between items-center p-4 border-b">
              <div className="flex items-center gap-2">
                {getFileIcon(previewFile.type)}
                <h3 className="font-medium truncate max-w-xs">{previewFile.name}</h3>
              </div>
              <div className="flex gap-2">
                {isImageFile(previewFile) && (
                  <button
                    onClick={toggleFullscreen}
                    className="text-gray-500 hover:text-gray-700 p-1.5 rounded-md hover:bg-gray-100"
                    aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                    title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                  >
                    {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
                  </button>
                )}

                <button
                  onClick={() => handleExternalView(previewFile)}
                  className="text-gray-500 hover:text-gray-700 p-1.5 rounded-md hover:bg-gray-100"
                  aria-label="Open in new tab"
                  title="Open in new tab"
                >
                  <ExternalLink size={18} />
                </button>

                <a
                  href={previewFile.url}
                  download
                  className="text-gray-500 hover:text-gray-700 p-1.5 rounded-md hover:bg-gray-100"
                  aria-label="Download file"
                  title="Download file"
                >
                  <Download size={18} />
                </a>

                <button
                  onClick={closeFilePreview}
                  className="text-gray-500 hover:text-gray-700 p-1.5 rounded-md hover:bg-gray-100"
                  aria-label="Close preview"
                  title="Close preview"
                >
                  &times;
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto h-full bg-gray-100 p-4 flex items-center justify-center">
              {isImageFile(previewFile) ? (
                <div className="relative max-w-full max-h-full">
                  {/* Using Next.js Image component with proper alt text */}
                  <Image
                    src={previewFile.url || "/placeholder.svg"}
                    alt={`Preview of ${previewFile.name}`}
                    width={800}
                    height={600}
                    className="object-contain"
                    style={{ maxWidth: "100%", height: "auto" }}
                    unoptimized={previewFile.url.startsWith("http")} // For external URLs
                  />
                </div>
              ) : (
                <div className="text-center p-8 max-w-lg mx-auto">
                  <div className="mb-4">
                    {getFileIcon(previewFile.type)}
                    <h3 className="text-xl font-semibold mt-2">{previewFile.name}</h3>
                    <p className="text-gray-500 mt-1">{formatFileSize(previewFile.size)}</p>
                  </div>

                  <p className="mb-6 text-gray-700">This file type requires external viewing.</p>

                  <div className="space-y-3">
                    <a
                      href={previewFile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors inline-flex items-center gap-2"
                    >
                      <ExternalLink size={18} />
                      Open File
                    </a>

                    <a
                      href={previewFile.url}
                      download
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors inline-flex items-center gap-2 ml-2"
                    >
                      <Download size={18} />
                      Download
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

