"use client"

import { useState, useEffect, type FormEvent } from "react"
import { File, Image, FileText, FileType2, ChevronDown, Trash2, Maximize, Minimize, ExternalLink, Download } from "lucide-react"
import { database } from "@/lib/firebase" // Adjust the path based on your project structure
import { ref as dbRef, onValue, push, set, serverTimestamp, remove } from "firebase/database"
import { UploadButton } from "@/components/ui/upload-button"

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
  trainerEmail: string
  trainerName: string
  batch: string
}

interface Trainer {
  id: string
  name: string
  email: string
  batches: string[]
  subject: string
}

// Firebase data types
interface FirebaseTrainerData {
  name: string
  creatorEmail?: string
  batches?: Record<string, boolean> | Record<string, string>
  subject?: string
}

interface FirebasePostData {
  text?: string
  attachments?: FileAttachment[]
  timestamp: number
  trainerEmail: string
  trainerName: string
  batch: string
}

export default function AdminStream() {
  // State declarations remain the same
  const [trainers, setTrainers] = useState<Trainer[]>([])
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null)
  const [selectedBatch, setSelectedBatch] = useState<string>("")
  const [posts, setPosts] = useState<Post[]>([])
  const [newPost, setNewPost] = useState<string>("")
  const [files, setFiles] = useState<FileAttachment[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [uploading, setUploading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [isTrainerDropdownOpen, setIsTrainerDropdownOpen] = useState<boolean>(false)
  const [isBatchDropdownOpen, setIsBatchDropdownOpen] = useState<boolean>(false)
  const [previewFile, setPreviewFile] = useState<FileAttachment | null>(null)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)

  // Fetch trainers on component mount
  useEffect(() => {
    const trainersRef = dbRef(database, "trainers")
    const unsubscribe = onValue(
      trainersRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const trainersData = snapshot.val()
          const trainersArray = Object.entries(trainersData).map(([id, data]) => {
            const trainerData = data as FirebaseTrainerData

            // Extract batch values instead of keys
            let batchesArray: string[] = []
            if (trainerData.batches) {
              // Check if batches are stored as Record<string, boolean> or Record<string, string>
              batchesArray = Object.entries(trainerData.batches).map(([key, value]) => {
                return typeof value === 'string' ? value : key
              })
            }

            return {
              id,
              name: trainerData.name,
              email: trainerData.creatorEmail || "unknown@example.com",
              batches: batchesArray,
              subject: trainerData.subject || "Unknown Subject",
            }
          })
          setTrainers(trainersArray)
        } else {
          setTrainers([])
        }
        setLoading(false)
      },
      (error) => {
        setError("Failed to load trainers: " + error.message)
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [])

  // Fetch posts when trainer and batch are selected
  useEffect(() => {
    if (selectedTrainer && selectedBatch) {
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
                  trainerEmail: postData.trainerEmail,
                  trainerName: postData.trainerName,
                  batch: postData.batch,
                }
              })
              .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

            setPosts(postsArray)
          } else {
            setPosts([])
          }
        },
        (error) => {
          setError("Failed to load posts: " + error.message)
        },
      )

      return () => unsubscribe()
    }
  }, [selectedTrainer, selectedBatch])

  // Add fullscreen change event listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  const handleTrainerSelect = (trainer: Trainer) => {
    try {
      setSelectedTrainer(trainer)
      setSelectedBatch("")
      setIsTrainerDropdownOpen(false)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      setError(`Failed to sign in as trainer: ${errorMessage}`)
    }
  }

  const handleBatchSelect = (batch: string) => {
    setSelectedBatch(batch)
    setIsBatchDropdownOpen(false)
  }

  const handleUploadComplete = (urls: string[]) => {
    // Create file attachments from the uploaded URLs
    const newFiles = urls.map((url, index) => {
      // Extract file name from URL
      const fileName = url.split("/").pop() || `file-${index}`

      // Determine file type from URL or extension
      let fileType = "application/octet-stream"
      if (url.match(/\.(jpeg|jpg|png|gif|webp)$/i)) fileType = "image"
      else if (url.match(/\.(pdf)$/i)) fileType = "application/pdf"
      else if (url.match(/\.(doc|docx)$/i)) fileType = "application/msword"
      else if (url.match(/\.(ppt|pptx|pps|ppsx|pptm)$/i)) fileType = "application/vnd.ms-powerpoint"

      return {
        id: Date.now() + Math.random(),
        name: fileName,
        type: fileType,
        size: 0, // Size is unknown from URL
        url: url,
      }
    })

    setFiles([...files, ...newFiles])
  }

  const handleUploadError = (error: Error) => {
    setError(`Upload failed: ${error.message}`)
  }

  const handlePostSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    if (!selectedTrainer || !selectedBatch) {
      setError("Please select a trainer and batch first")
      return
    }

    if (newPost.trim() === "" && files.length === 0) {
      setError("Please add some text or attach a file")
      return
    }

    try {
      setUploading(true)
      setError(null)

      // Create post in Firebase Realtime Database
      const postsRef = dbRef(database, `streams/${selectedBatch}`)
      const newPostRef = push(postsRef)

      const postData = {
        text: newPost,
        attachments: files.length > 0 ? files : null,
        timestamp: serverTimestamp(),
        trainerEmail: selectedTrainer.email,
        trainerName: selectedTrainer.name,
        batch: selectedBatch,
      }

      await set(newPostRef, postData)

      setNewPost("")
      setFiles([])
      setUploading(false)
    } catch (error) {
      console.error("Post creation error:", error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      setError(`Failed to create post: ${errorMessage}`)
      setUploading(false)
    }
  }

  const deletePost = async (postId: string): Promise<void> => {
    if (!selectedBatch) return

    try {
      const postRef = dbRef(database, `streams/${selectedBatch}/${postId}`)
      await remove(postRef)
    } catch (error) {
      console.error("Delete error:", error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      setError(`Failed to delete post: ${errorMessage}`)
    }
  }

  const removeFile = (fileId: number): void => {
    setFiles(files.filter((file) => file.id !== fileId))
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("image")) return <Image className="text-orange-600" size={20} aria-hidden="true" />
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
    return file.type.includes("pdf") || file.url.toLowerCase().endsWith('.pdf')
  }

  const isImageFile = (file: FileAttachment): boolean => {
    return file.type.includes('image') || file.url.toLowerCase().match(/\.(jpeg|jpg|png|gif|webp)$/i) !== null
  }

  // Modified to handle file preview directly instead of using iframes
  const openFilePreview = (file: FileAttachment): void => {
    setPreviewFile(file)

    // For non-viewable files, just download them directly
    if (!isImageFile(file) && !isPdfDocument(file) && !isOfficeDocument(file)) {
      window.open(file.url, '_blank')
    }
  }

  const closeFilePreview = (): void => {
    setPreviewFile(null)

    // Exit fullscreen if active
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => {
        console.error(`Error attempting to exit fullscreen: ${err.message}`)
      })
    }
  }

  const toggleFullscreen = (): void => {
    const previewElement = document.getElementById('file-preview-container')

    if (!previewElement) return

    if (!document.fullscreenElement) {
      previewElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
    } else {
      document.exitFullscreen().catch(err => {
        console.error(`Error attempting to exit fullscreen: ${err.message}`)
      })
    }
  }

  const handleExternalView = (file: FileAttachment): void => {
    // Open the file in a new tab directly
    window.open(file.url, '_blank')
  }

  if (loading && trainers.length === 0) {
    return <div className="max-w-4xl mx-auto p-4 text-center">Loading trainers...</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-orange-600 mb-6">Trainer Stream</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-4">
          {error}
          <button className="ml-2 font-bold" onClick={() => setError(null)} aria-label="Dismiss error">
            ×
          </button>
        </div>
      )}

      {/* Trainer selection dropdown */}
      <div className="mb-4">
        <div className="relative">
          <button
            type="button"
            className="bg-white border border-orange-200 p-3 rounded-lg w-full text-left flex justify-between items-center"
            onClick={() => setIsTrainerDropdownOpen(!isTrainerDropdownOpen)}
          >
            <span>{selectedTrainer ? selectedTrainer.name : "Select a Trainer"}</span>
            <ChevronDown
              size={20}
              className={`text-orange-600 transition-transform ${isTrainerDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isTrainerDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-orange-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {trainers.map((trainer) => (
                <button
                  key={trainer.id}
                  className="w-full text-left p-3 hover:bg-orange-50 focus:bg-orange-50"
                  onClick={() => handleTrainerSelect(trainer)}
                >
                  <div className="font-medium">{trainer.name}</div>
                  <div className="text-sm text-gray-500">{trainer.subject}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Batch selection dropdown (only visible if trainer is selected) */}
      {selectedTrainer && (
        <div className="mb-6">
          <div className="relative">
            <button
              type="button"
              className="bg-white border border-orange-200 p-3 rounded-lg w-full text-left flex justify-between items-center"
              onClick={() => setIsBatchDropdownOpen(!isBatchDropdownOpen)}
              disabled={selectedTrainer.batches.length === 0}
            >
              <span>
                {selectedBatch
                  ? `Batch: ${selectedBatch}`
                  : selectedTrainer.batches.length === 0
                    ? "No batches available"
                    : "Select a Batch"}
              </span>
              <ChevronDown
                size={20}
                className={`text-orange-600 transition-transform ${isBatchDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isBatchDropdownOpen && selectedTrainer.batches.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-orange-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {selectedTrainer.batches.map((batch) => (
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

      {/* Create post form (only visible if both trainer and batch are selected) */}
      {selectedTrainer && selectedBatch && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 border border-orange-200">
          <form onSubmit={handlePostSubmit}>
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder={`Share something with ${selectedBatch} batch...`}
              className="w-full p-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none mb-3"
              rows={3}
            />

            {/* File upload previews */}
            {files.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="bg-orange-50 rounded p-2 flex items-center gap-2 border border-orange-200"
                  >
                    {getFileIcon(file.type)}
                    <span className="text-sm text-gray-700 max-w-xs truncate">{file.name}</span>
                    <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
                    <button
                      type="button"
                      onClick={() => removeFile(file.id)}
                      className="text-orange-500 hover:text-orange-700"
                      aria-label={`Remove ${file.name}`}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between items-center">
              <UploadButton onUploadComplete={handleUploadComplete} onUploadError={handleUploadError} />
              <button
                type="submit"
                className={`bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={uploading}
              >
                {uploading ? "Posting..." : "Post"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stream posts */}
      {selectedTrainer && selectedBatch && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">{selectedBatch} - Stream</h2>

          {posts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center border border-orange-100">
              <p className="text-gray-500">No posts yet for this batch. Be the first to share something!</p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-md p-4 border border-orange-100">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-200 flex items-center justify-center text-orange-600 font-bold">
                      {post.trainerName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium">{post.trainerName}</div>
                      <div className="text-xs text-gray-500">{formatTimestamp(post.timestamp)}</div>
                    </div>
                  </div>

                  {/* Delete post button */}
                  <button
                    onClick={() => deletePost(post.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Delete post"
                    title="Delete post"
                  >
                    <Trash2 size={18} />
                  </button>
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
      )}

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
                <img
                  src={previewFile.url}
                  alt={previewFile.name}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="text-center p-8 max-w-lg mx-auto">
                  <div className="mb-4">
                    {getFileIcon(previewFile.type)}
                    <h3 className="text-xl font-semibold mt-2">{previewFile.name}</h3>
                    <p className="text-gray-500 mt-1">{formatFileSize(previewFile.size)}</p>
                  </div>

                  <p className="mb-6 text-gray-700">
                    This file type requires external viewing.
                  </p>

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