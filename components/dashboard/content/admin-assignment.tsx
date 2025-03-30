'use client'

import { useState, useEffect, useRef } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { database } from '@/lib/firebase'
import { ref as dbRef, onValue, update, serverTimestamp } from 'firebase/database'
import { File, FileText, Image, FileType2, Download, CheckCircle, MessageSquare, Search, ArrowUpDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

interface Trainer {
  id: string
  name: string
  email: string
  subject: string
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
  trainerName: string
  trainerEmail: string
  feedback?: {
    text: string
    timestamp: number
    trainerName: string
  }[]
}

type SortField = 'submittedAt' | 'studentName' | 'fileName'
type SortDirection = 'asc' | 'desc'

export default function AdminAssignments() {
  const [trainers, setTrainers] = useState<Trainer[]>([])
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null)
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState<SortField>('submittedAt')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false)
  const [feedbackText, setFeedbackText] = useState('')
  const [submittingFeedback, setSubmittingFeedback] = useState(false)
  const feedbackRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const trainersRef = dbRef(database, 'trainers')
    const unsubscribe = onValue(trainersRef, (snapshot) => {
      if (snapshot.exists()) {
        const trainersData = snapshot.val() as Record<string, { name: string; email: string; subject: string }>
        const trainersArray = Object.entries(trainersData).map(([id, data]) => ({
          id,
          name: data.name,
          email: data.email,
          subject: data.subject || 'Not specified'
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
            submittedAt: typeof data.submittedAt === 'object' ? Date.now() : data.submittedAt
          }))
          setAssignments(assignmentsArray)
        } else {
          setAssignments([])
        }
      })

      return () => unsubscribe()
    }
  }, [selectedTrainer])

  useEffect(() => {
    if (feedbackDialogOpen && feedbackRef.current) {
      feedbackRef.current.focus()
    }
  }, [feedbackDialogOpen])

  const handleMarkAsChecked = async (assignment: Assignment) => {
    if (!selectedTrainer) return

    try {
      const assignmentRef = dbRef(database, `assignments/${selectedTrainer.id}/${assignment.id}`)
      await update(assignmentRef, { status: 'checked' })
      setSuccess(`Assignment "${assignment.fileName}" marked as checked`)
      setTimeout(() => setSuccess(null), 3000)
    } catch (error) {
      console.error('Error updating assignment status:', error)
      setError('Failed to update assignment status')
    }
  }

  const handleOpenFeedbackDialog = (assignment: Assignment) => {
    setSelectedAssignment(assignment)
    setFeedbackDialogOpen(true)
    setFeedbackText('')
  }

  const handleSubmitFeedback = async () => {
    if (!selectedTrainer || !selectedAssignment || !feedbackText.trim()) return

    try {
      setSubmittingFeedback(true)
      const assignmentRef = dbRef(database, `assignments/${selectedTrainer.id}/${selectedAssignment.id}`)

      const newFeedback = {
        text: feedbackText.trim(),
        timestamp: serverTimestamp(),
        trainerName: selectedTrainer.name
      }

      const updatedFeedback = selectedAssignment.feedback
        ? [...selectedAssignment.feedback, newFeedback]
        : [newFeedback]

      await update(assignmentRef, {
        feedback: updatedFeedback,
        status: 'checked'
      })

      setFeedbackDialogOpen(false)
      setSuccess('Feedback submitted successfully')
      setTimeout(() => setSuccess(null), 3000)
    } catch (error) {
      console.error('Error submitting feedback:', error)
      setError('Failed to submit feedback')
    } finally {
      setSubmittingFeedback(false)
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
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    })
  }

  const filteredAssignments = assignments
    .filter(assignment => {
      if (!searchQuery) return true

      const lowerQuery = searchQuery.toLowerCase()
      return (
        assignment.fileName.toLowerCase().includes(lowerQuery) ||
        assignment.studentName.toLowerCase().includes(lowerQuery) ||
        assignment.studentEmail.toLowerCase().includes(lowerQuery)
      )
    })
    .sort((a, b) => {
      if (sortField === 'submittedAt') {
        return sortDirection === 'asc'
          ? a.submittedAt - b.submittedAt
          : b.submittedAt - a.submittedAt
      } else {
        const valueA = a[sortField].toLowerCase()
        const valueB = b[sortField].toLowerCase()

        if (sortDirection === 'asc') {
          return valueA.localeCompare(valueB)
        } else {
          return valueB.localeCompare(valueA)
        }
      }
    })

  const pendingAssignments = filteredAssignments.filter(a => a.status === 'pending')
  const checkedAssignments = filteredAssignments.filter(a => a.status === 'checked')

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
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

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 p-3 rounded-lg mb-4">
          {success}
          <button className="ml-2 font-bold" onClick={() => setSuccess(null)}>×</button>
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
        <>
          <div className="mb-4 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
              <Input
                placeholder="Search by file name or student..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <ArrowUpDown size={16} />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => toggleSort('submittedAt')}>
                  Date {sortField === 'submittedAt' && (sortDirection === 'asc' ? '↑' : '↓')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleSort('studentName')}>
                  Student Name {sortField === 'studentName' && (sortDirection === 'asc' ? '↑' : '↓')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleSort('fileName')}>
                  File Name {sortField === 'fileName' && (sortDirection === 'asc' ? '↑' : '↓')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Tabs defaultValue="check" className="w-full">
            <TabsList className="flex space-x-2 mb-4">
              <TabsTrigger value="check" className="flex-1 py-2 px-4 rounded-lg bg-white border border-gray-200">
                Check Assignments {pendingAssignments.length > 0 && `(${pendingAssignments.length})`}
              </TabsTrigger>
              <TabsTrigger value="history" className="flex-1 py-2 px-4 rounded-lg bg-white border border-gray-200">
                History {checkedAssignments.length > 0 && `(${checkedAssignments.length})`}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="check" className="space-y-4">
              {pendingAssignments.length === 0 && (
                <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-500">No pending assignments to check</p>
                </div>
              )}

              {pendingAssignments.map((assignment) => (
                <div key={assignment.id} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getFileIcon(assignment.fileType)}
                      <div>
                        <h4 className="font-medium">{assignment.fileName}</h4>
                        <p className="text-sm text-gray-500">Submitted: {formatDate(assignment.submittedAt)}</p>
                        <p className="text-sm text-gray-500">Student: {assignment.studentName} ({assignment.studentEmail})</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <a
                        href={assignment.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-600 hover:text-orange-800 p-1 rounded-full hover:bg-orange-50"
                        aria-label={`Download ${assignment.fileName}`}
                        title="Download file"
                      >
                        <Download size={20} />
                      </a>
                      <button
                        onClick={() => handleOpenFeedbackDialog(assignment)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50"
                        aria-label="Provide feedback"
                        title="Provide feedback"
                      >
                        <MessageSquare size={20} />
                      </button>
                      <button
                        onClick={() => handleMarkAsChecked(assignment)}
                        className="text-green-600 hover:text-green-800 p-1 rounded-full hover:bg-green-50"
                        aria-label="Mark as checked"
                        title="Mark as checked"
                      >
                        <CheckCircle size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              {checkedAssignments.length === 0 && (
                <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-500">No checked assignments</p>
                </div>
              )}

              {checkedAssignments.map((assignment) => (
                <div key={assignment.id} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getFileIcon(assignment.fileType)}
                      <div>
                        <h4 className="font-medium">{assignment.fileName}</h4>
                        <p className="text-sm text-gray-500">Submitted: {formatDate(assignment.submittedAt)}</p>
                        <p className="text-sm text-gray-500">Student: {assignment.studentName} ({assignment.studentEmail})</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <a
                        href={assignment.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-600 hover:text-orange-800 p-1 rounded-full hover:bg-orange-50"
                        aria-label={`Download ${assignment.fileName}`}
                        title="Download file"
                      >
                        <Download size={20} />
                      </a>
                    </div>
                  </div>

                  {assignment.feedback && assignment.feedback.length > 0 && (
                    <div className="border-t pt-3 mt-3">
                      <h5 className="font-medium flex items-center gap-2 mb-2">
                        <MessageSquare size={16} />
                        Feedback
                      </h5>
                      <div className="space-y-3">
                        {assignment.feedback.map((feedback, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm font-medium text-gray-700">{feedback.trainerName}</p>
                            <p className="text-sm text-gray-600 whitespace-pre-wrap">{feedback.text}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {feedback.timestamp ? formatDate(feedback.timestamp) : 'Recently added'}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-3 flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-blue-600"
                      onClick={() => handleOpenFeedbackDialog(assignment)}
                    >
                      <MessageSquare size={16} className="mr-1" />
                      Add Feedback
                    </Button>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </>
      )}

      <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Feedback</DialogTitle>
            <DialogDescription>
              {selectedAssignment && (
                <div className="mt-2">
                  <p><span className="font-medium">File:</span> {selectedAssignment.fileName}</p>
                  <p><span className="font-medium">Student:</span> {selectedAssignment.studentName}</p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>

          <Textarea
            ref={feedbackRef}
            placeholder="Provide feedback on this assignment..."
            className="min-h-[150px]"
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setFeedbackDialogOpen(false)}>Cancel</Button>
            <Button
              disabled={!feedbackText.trim() || submittingFeedback}
              onClick={handleSubmitFeedback}
            >
              {submittingFeedback ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}