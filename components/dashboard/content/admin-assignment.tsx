'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { database } from '@/lib/firebase'
import { ref as dbRef, onValue, update } from 'firebase/database'
import { File, FileText, Image, FileType2, Download, CheckCircle } from 'lucide-react'

interface Trainer {
  id: string
  name: string
  email: string
}

interface Assignment {
  id: string
  fileName: string
  fileUrl: string
  fileType: string
  status: 'pending' | 'checked'
  submittedAt: number
  studentName: string
  studentEmail: string
}

export default function AdminAssignments() {
  const [trainers, setTrainers] = useState<Trainer[]>([])
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null)
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const trainersRef = dbRef(database, 'trainers')
    const unsubscribe = onValue(trainersRef, (snapshot) => {
      if (snapshot.exists()) {
        const trainersData = snapshot.val() as Record<string, { name: string; email: string }>
        const trainersArray = Object.entries(trainersData).map(([id, data]) => ({
          id,
          name: data.name,
          email: data.email,
        }))
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
          const assignmentsData = snapshot.val() as Record<string, Omit<Assignment, 'id'>>
          const assignmentsArray = Object.entries(assignmentsData).map(([id, data]) => ({
            id,
            ...data,
          }))
          setAssignments(assignmentsArray)
        } else {
          setAssignments([])
        }
      })

      return () => unsubscribe()
    }
  }, [selectedTrainer])

  const handleMarkAsChecked = async (assignmentId: string) => {
    if (!selectedTrainer) return

    try {
      const assignmentRef = dbRef(database, `assignments/${selectedTrainer.id}/${assignmentId}`)
      await update(assignmentRef, { status: 'checked' })
    } catch (error) {
      console.error('Error updating assignment status:', error)
      setError('Failed to update assignment status')
    }
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('image')) return <Image className="text-orange-600" size={20} aria-label="Image file" />
    if (fileType.includes('pdf')) return <FileText className="text-orange-600" size={20} aria-label="PDF file" />
    if (fileType.includes('word') || fileType.includes('document')) return <File className="text-orange-600" size={20} aria-label="Word file" />
    if (fileType.includes('presentation') || fileType.includes('powerpoint')) return <FileType2 className="text-orange-600" size={20} aria-label="Presentation file" />
    return <File className="text-orange-600" size={20} aria-label="Generic file" />
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    })
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-orange-600 mb-6">Admin Assignments</h1>

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
              {trainer.name}
            </option>
          ))}
        </select>
      </div>

      {selectedTrainer && (
        <Tabs defaultValue="check" className="w-full">
          <TabsList className="flex space-x-2 mb-4">
            <TabsTrigger value="check" className="flex-1 py-2 px-4 rounded-lg bg-white border border-gray-200">
              Check Assignments
            </TabsTrigger>
            <TabsTrigger value="history" className="flex-1 py-2 px-4 rounded-lg bg-white border border-gray-200">
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="check" className="space-y-4">
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
                        <p className="text-sm text-gray-500">Student: {assignment.studentName}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <a
                        href={assignment.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-600 hover:text-orange-800"
                        aria-label={`Download ${assignment.fileName}`}
                      >
                        <Download size={20} />
                      </a>
                      <button
                        onClick={() => handleMarkAsChecked(assignment.id)}
                        className="text-green-600 hover:text-green-800"
                        aria-label="Mark as checked"
                      >
                        <CheckCircle size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {assignments
              .filter(a => a.status === 'checked')
              .map((assignment) => (
                <div key={assignment.id} className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getFileIcon(assignment.fileType)}
                      <div>
                        <h4 className="font-medium">{assignment.fileName}</h4>
                        <p className="text-sm text-gray-500">Submitted: {formatDate(assignment.submittedAt)}</p>
                        <p className="text-sm text-gray-500">Student: {assignment.studentName}</p>
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
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
