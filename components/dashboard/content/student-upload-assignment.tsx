'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { database } from '@/lib/firebase'
import { ref as dbRef, onValue, push, set, serverTimestamp } from 'firebase/database'
import { UploadButton } from '@/components/ui/upload-button'
import { File, FileText, Image, FileType2, MessageSquare, Download, Loader2 } from 'lucide-react'

interface Trainer {
  id: string
  name: string
  email: string
  subject: string
  batches: string[]
}

interface FirebaseTrainerData {
  name: string
  email: string
  subject: string
  batches: string[] | Record<string, boolean>
}

interface FirebaseAssignmentData {
  fileName: string
  fileUrl: string
  fileType: string
  status: 'pending' | 'checked'
  submittedAt: number
  feedback?: {
    text: string
    timestamp: number
    trainerName: string
  }[]
  trainerEmail: string
  trainerName: string
  studentEmail: string
  studentName: string
}

interface Assignment {
  id: string
  fileName: string
  fileUrl: string
  fileType: string
  status: 'pending' | 'checked'
  submittedAt: number
  feedback?: {
    text: string
    timestamp: number
    trainerName: string
  }[]
  trainerEmail: string
  trainerName: string
  studentEmail: string
  studentName: string
}

export default function StudentAssignment() {
  const [trainers, setTrainers] = useState<Trainer[]>([])
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null)
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const trainersRef = dbRef(database, 'trainers')
    const unsubscribe = onValue(trainersRef, (snapshot) => {
      if (snapshot.exists()) {
        const trainersData = snapshot.val()
        const trainersArray = Object.entries(trainersData).map(([id, data]) => {
          const trainerData = data as FirebaseTrainerData
          return {
            id,
            name: trainerData.name,
            email: trainerData.email,
            subject: trainerData.subject,
            batches: Array.isArray(trainerData.batches) ? trainerData.batches : Object.keys(trainerData.batches || {})
          }
        })
        setTrainers(trainersArray)
      }
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (selectedTrainer) {
      const assignmentsRef = dbRef(database, `assignments/${selectedTrainer.id}`)
      const unsubscribe = onValue(assignmentsRef, (snapshot) => {
        if (snapshot.exists()) {
          const assignmentsData = snapshot.val()
          const assignmentsArray = Object.entries(assignmentsData).map(([id, data]) => {
            const assignmentData = data as FirebaseAssignmentData
            return {
              id,
              ...assignmentData
            }
          })
          setAssignments(assignmentsArray)
        } else {
          setAssignments([])
        }
      })

      return () => unsubscribe()
    }
  }, [selectedTrainer])

  const handleUploadComplete = async (urls: string[]) => {
    if (!selectedTrainer) {
      setError('Please select a trainer first')
      return
    }

    try {
      setUploading(true)
      setError(null)

      const assignmentsRef = dbRef(database, `assignments/${selectedTrainer.id}`)
      const newAssignmentRef = push(assignmentsRef)

      const url = urls[0]
      const fileName = url.split('/').pop() || 'unknown'
      let fileType = 'application/octet-stream'

      if (url.match(/\.(jpeg|jpg|png|gif|webp)$/i)) fileType = 'image'
      else if (url.match(/\.(pdf)$/i)) fileType = 'application/pdf'
      else if (url.match(/\.(doc|docx)$/i)) fileType = 'application/msword'
      else if (url.match(/\.(ppt|pptx|pps|ppsx|pptm)$/i)) fileType = 'application/vnd.ms-powerpoint'

      const assignmentData = {
        fileName,
        fileUrl: url,
        fileType,
        status: 'pending',
        submittedAt: serverTimestamp(),
        trainerEmail: selectedTrainer.email,
        trainerName: selectedTrainer.name,
        studentEmail: 'current.student@example.com', // Replace with actual student email
        studentName: 'Current Student', // Replace with actual student name
      }

      await set(newAssignmentRef, assignmentData)
      setUploading(false)
    } catch (error) {
      console.error('Upload error:', error)
      setError('Failed to upload assignment')
      setUploading(false)
    }
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('image')) return <Image className="text-orange-600" size={20} />
    if (fileType.includes('pdf')) return <FileText className="text-orange-600" size={20} />
    if (fileType.includes('word') || fileType.includes('document')) return <File className="text-orange-600" size={20} />
    if (fileType.includes('presentation') || fileType.includes('powerpoint')) return <FileType2 className="text-orange-600" size={20} />
    return <File className="text-orange-600" size={20} />
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    })
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-orange-600 mb-6">Student Assignments</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-4">
          {error}
          <button className="ml-2 font-bold" onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Trainer</label>
        <select
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          value={selectedTrainer?.id || ''}
          onChange={(e) => setSelectedTrainer(trainers.find(t => t.id === e.target.value) || null)}
        >
          <option value="">Choose a trainer</option>
          {trainers.map((trainer) => (
            <option key={trainer.id} value={trainer.id}>
              {trainer.name} - {trainer.subject}
            </option>
          ))}
        </select>
      </div>

      {selectedTrainer && (
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="flex space-x-2 mb-4">
            <TabsTrigger value="upload" className="flex-1 py-2 px-4 rounded-lg bg-white border border-gray-200">
              Upload Assignment
            </TabsTrigger>
            <TabsTrigger value="checked" className="flex-1 py-2 px-4 rounded-lg bg-white border border-gray-200">
              Checked Assignments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Upload New Assignment</h3>
              <UploadButton
                onUploadComplete={handleUploadComplete}
                onUploadError={(error) => setError(error.message)}
              />
              {uploading && (
                <div className="mt-4 flex items-center text-orange-600">
                  <Loader2 className="animate-spin mr-2" size={20} />
                  <span>Uploading assignment...</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Pending Assignments</h3>
              {assignments
                .filter(a => a.status === 'pending')
                .map((assignment) => (
                  <div key={assignment.id} className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getFileIcon(assignment.fileType)}
                        <div>
                          <h4 className="font-medium">{assignment.fileName}</h4>
                          <p className="text-sm text-gray-500">Submitted: {formatDate(assignment.submittedAt)}</p>
                        </div>
                      </div>
                      <a
                        href={assignment.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-600 hover:text-orange-800"
                        aria-label={`Download ${assignment.fileName}`}
                      >
                        <Download size={20} />
                      </a>
                    </div>
                  </div>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="checked" className="space-y-4">
            {assignments
              .filter(a => a.status === 'checked')
              .map((assignment) => (
                <div key={assignment.id} className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {getFileIcon(assignment.fileType)}
                      <div>
                        <h4 className="font-medium">{assignment.fileName}</h4>
                        <p className="text-sm text-gray-500">Submitted: {formatDate(assignment.submittedAt)}</p>
                      </div>
                    </div>
                    <a
                      href={assignment.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-600 hover:text-orange-800"
                      aria-label={`Download ${assignment.fileName}`}
                    >
                      <Download size={20} />
                    </a>
                  </div>

                  <div className="border-t pt-4">
                    <h5 className="font-medium flex items-center gap-2 mb-2">
                      <MessageSquare size={16} />
                      Feedback
                    </h5>
                    {assignment.feedback?.map((f, i) => (
                      <div key={i} className="mb-2 text-sm">
                        <p className="font-medium">{f.trainerName}</p>
                        <p className="text-gray-600">{f.text}</p>
                        <p className="text-xs text-gray-500">{formatDate(f.timestamp)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}