"use client"
import { useState, useEffect } from "react"
import {
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  Users,
  BookOpen,
  Tag,
  AlertTriangle,
  Loader2,
  Mail,
  Phone,
  UserRound,
  GraduationCap,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Firebase imports
import { initializeApp, getApps } from "firebase/app"
import { getDatabase, ref, onValue, set, update, remove, push } from "firebase/database"

// Your Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FB_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FB_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_DB_URL,
  projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE,
  messagingSenderId: process.env.NEXT_PUBLIC_FB_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FB_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FB_MEASUREMENT_ID,
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
const database = getDatabase(app)

// Student type definition
type Student = {
  id: string
  name: string
  email: string
  phone: string
  address: string
  fatherName: string
  fatherPhone: string
  motherName: string
  motherPhone: string
  studentId: string
  batches: string[]
  creatorEmail: string
  createdAt?: string
}

type Trainer = {
  id: string
  name: string
  email: string
  subject: string
  batches: string[]
}

// Define FirebaseStudentData type
type FirebaseStudentData = {
  name: string
  email: string
  phone: string
  address: string
  fatherName: string
  fatherPhone: string
  motherName: string
  motherPhone: string
  studentId: string
  batches?: Record<string, string>
  creatorEmail: string
  createdAt?: string
}

// Batch type definition
type Batch = {
  id: string
  name: string
  students: Student[]
}

export default function StudentManagementDash() {
  // State for user email (in a real app, this would come from authentication)
  const [userEmail] = useState("admin@example.com")

  // Students and batches state
  const [students, setStudents] = useState<Student[]>([])
  const [batches, setBatches] = useState<Batch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Add these state variables
  const [trainers, setTrainers] = useState<Trainer[]>([])
  const [subjects, setSubjects] = useState<string[]>([])
  const [selectedSubject, setSelectedSubject] = useState<string>("")
  const [filteredBatches, setFilteredBatches] = useState<string[]>([])

  // UI state
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all-students")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null)
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add")
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null)
  const [isBatchDialogOpen, setIsBatchDialogOpen] = useState(false)

  // Form state
  const [currentStudent, setCurrentStudent] = useState<Student>({
    id: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    fatherName: "",
    fatherPhone: "",
    motherName: "",
    motherPhone: "",
    studentId: "",
    batches: [],
    creatorEmail: "",
  })
  const [editableBatches, setEditableBatches] = useState<string[]>([])

  // Notifications
  const [saveLoading, setSaveLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null)

  // Fetch students from Firebase
  useEffect(() => {
    const studentsRef = ref(database, "students")

    setLoading(true)
    const unsubscribe = onValue(
      studentsRef,
      (snapshot) => {
        try {
          if (snapshot.exists()) {
            const studentsData = snapshot.val()
            // Map Firebase data to Student array
            const studentsArray: Student[] = Object.entries(studentsData).map(([id, data]) => {
              // Type assertion for the unknown data
              const studentData = data as FirebaseStudentData

              return {
                id,
                name: studentData.name,
                email: studentData.email,
                phone: studentData.phone,
                address: studentData.address,
                fatherName: studentData.fatherName,
                fatherPhone: studentData.fatherPhone,
                motherName: studentData.motherName,
                motherPhone: studentData.motherPhone,
                studentId: studentData.studentId,
                batches: studentData.batches ? Object.values(studentData.batches) : [],
                creatorEmail: studentData.creatorEmail || "Unknown",
                createdAt: studentData.createdAt || "",
              }
            })
            setStudents(studentsArray)

            // Process batches
            const batchMap = new Map<string, Batch>()

            // First, collect all unique batch names
            studentsArray.forEach((student) => {
              student.batches.forEach((batchName) => {
                if (!batchMap.has(batchName)) {
                  batchMap.set(batchName, {
                    id: batchName,
                    name: batchName,
                    students: [],
                  })
                }
              })
            })

            // Then, add students to their respective batches
            studentsArray.forEach((student) => {
              student.batches.forEach((batchName) => {
                const batch = batchMap.get(batchName)
                if (batch) {
                  batch.students.push(student)
                }
              })
            })

            setBatches(Array.from(batchMap.values()))
          } else {
            setStudents([])
            setBatches([])
          }
          setError(null)
        } catch (err) {
          console.error("Error fetching students:", err)
          setError("Failed to load students. Please try again later.")
        } finally {
          setLoading(false)
        }
      },
      (error) => {
        console.error("Database error:", error)
        setError("Failed to connect to the database. Please check your connection.")
        setLoading(false)
      },
    )

    // Clean up subscription on unmount
    return () => unsubscribe()
  }, [])

  // Fetch trainers from Firebase
  useEffect(() => {
    const trainersRef = ref(database, "trainers")

    const unsubscribe = onValue(
      trainersRef,
      (snapshot) => {
        try {
          if (snapshot.exists()) {
            const trainersData = snapshot.val()
            // Map Firebase data to Trainer array
            const trainersArray: Trainer[] = Object.entries(trainersData).map(([id, data]: [string, unknown]) => {
              const trainerData = data as {
                name?: string
                email?: string
                subject?: string
                batches?: Record<string, string>
              }

              return {
                id,
                name: trainerData.name || "",
                email: trainerData.email || "",
                subject: trainerData.subject || "",
                batches: trainerData.batches ? Object.values(trainerData.batches) : [],
              }
            })
            setTrainers(trainersArray)

            // Extract unique subjects
            const uniqueSubjects = Array.from(new Set(trainersArray.map((trainer) => trainer.subject).filter(Boolean)))
            setSubjects(uniqueSubjects)
          } else {
            setTrainers([])
            setSubjects([])
          }
        } catch (err) {
          console.error("Error fetching trainers:", err)
        }
      },
      (error) => {
        console.error("Database error for trainers:", error)
      },
    )

    // Clean up subscription on unmount
    return () => unsubscribe()
  }, [])

  const handleSubjectChange = (subject: string) => {
    setSelectedSubject(subject)

    // Filter batches based on selected subject
    const relevantTrainers = trainers.filter((trainer) => trainer.subject === subject)
    const availableBatches = Array.from(new Set(relevantTrainers.flatMap((trainer) => trainer.batches))).filter(Boolean)

    setFilteredBatches(availableBatches)

    // Clear previously selected batches
    setEditableBatches([])
  }

  const openAddDialog = () => {
    setDialogMode("add")
    setCurrentStudent({
      id: "",
      name: "",
      email: "",
      phone: "",
      address: "",
      fatherName: "",
      fatherPhone: "",
      motherName: "",
      motherPhone: "",
      studentId: "",
      batches: [],
      creatorEmail: userEmail || "Unknown",
    })
    setEditableBatches([])
    setIsDialogOpen(true)
  }

  const openEditDialog = (student: Student) => {
    setDialogMode("edit")
    setCurrentStudent({ ...student })
    setEditableBatches(student.batches ? [...student.batches] : [])
    setIsDialogOpen(true)
  }

  const removeBatch = (batch: string) => {
    setEditableBatches(editableBatches.filter((b) => b !== batch))
    setNotification({ type: "success", message: `Batch ${batch} removed successfully` })
  }

  const saveStudent = async () => {
    try {
      setSaveLoading(true)

      // Get current timestamp
      const timestamp = new Date().toISOString()

      // Prepare creator email
      const creatorEmail = dialogMode === "add" ? userEmail || "Unknown" : currentStudent.creatorEmail

      // Prepare student data
      const studentData: FirebaseStudentData = {
        name: currentStudent.name,
        email: currentStudent.email,
        phone: currentStudent.phone,
        address: currentStudent.address,
        fatherName: currentStudent.fatherName,
        fatherPhone: currentStudent.fatherPhone,
        motherName: currentStudent.motherName,
        motherPhone: currentStudent.motherPhone,
        studentId: currentStudent.studentId,
        batches: editableBatches.reduce(
          (acc, batch, index) => {
            acc[index] = batch
            return acc
          },
          {} as Record<number, string>,
        ),
        creatorEmail: creatorEmail,
        createdAt: dialogMode === "add" ? timestamp : currentStudent.createdAt || timestamp,
      }

      if (dialogMode === "add") {
        // Create new student
        const newStudentRef = push(ref(database, "students"))
        await set(newStudentRef, studentData)
        setNotification({ type: "success", message: "Student added successfully!" })
      } else {
        // Update existing student
        await update(ref(database, `students/${currentStudent.id}`), studentData)
        setNotification({ type: "success", message: "Student updated successfully!" })
      }
    } catch (err) {
      console.error("Error saving student:", err)
      setNotification({ type: "error", message: "Failed to save student. Please try again." })
    } finally {
      setSaveLoading(false)
      setIsDialogOpen(false)

      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000)
    }
  }

  const confirmDeleteStudent = (id: string) => {
    setStudentToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const deleteStudent = async () => {
    if (!studentToDelete) return

    try {
      setDeleteLoading(true)
      await remove(ref(database, `students/${studentToDelete}`))
      setNotification({ type: "success", message: "Student deleted successfully!" })
    } catch (err) {
      console.error("Error deleting student:", err)
      setNotification({ type: "error", message: "Failed to delete student. Please try again." })
    } finally {
      setDeleteLoading(false)
      setIsDeleteDialogOpen(false)
      setStudentToDelete(null)

      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000)
    }
  }

  // Format date from ISO string
  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.phone.includes(searchQuery) ||
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.batches.some((batch) => batch.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const openBatchDialog = (batch: Batch) => {
    setSelectedBatch(batch)
    setIsBatchDialogOpen(true)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Student Management</h1>
        <Button onClick={openAddDialog} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600">
          <Plus size={16} />
          Add Student
        </Button>
      </div>

      {/* Global notification */}
      {notification && (
        <Alert
          className={`mb-4 ${notification.type === "success" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}
        >
          <AlertDescription>{notification.message}</AlertDescription>
        </Alert>
      )}

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          className="pl-10 w-full border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
          placeholder="Search students by name, email, phone, ID, or batch"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Tabs for different views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2 md:grid-cols-2">
          <TabsTrigger value="all-students" className="px-4">
            <Users size={16} className="mr-2" />
            All Students
          </TabsTrigger>
          <TabsTrigger value="batches" className="px-4">
            <BookOpen size={16} className="mr-2" />
            Batches
          </TabsTrigger>
        </TabsList>

        {/* Loading state */}
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12">
            <Loader2 className="h-12 w-12 animate-spin text-orange-500 mb-4" />
            <p className="text-lg text-gray-600">Loading students...</p>
          </div>
        ) : error ? (
          <Alert className="bg-red-50 text-red-700 border-red-200 mt-4">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <>
            {/* All Students Tab */}
            <TabsContent value="all-students" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStudents.map((student) => (
                  <Card
                    key={student.id}
                    className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-gray-200 rounded-lg"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-center">
                        <GraduationCap className="text-orange-500 mr-3" size={24} />
                        <CardTitle className="text-xl font-bold text-gray-800">{student.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2 pb-4">
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <FileText className="text-orange-400 mr-2" size={16} />
                          <span className="text-sm font-medium text-gray-500 mr-2">ID:</span>
                          <span className="text-gray-800 font-medium">{student.studentId}</span>
                        </div>
                        <div className="flex items-center">
                          <Mail className="text-orange-400 mr-2" size={16} />
                          <span className="text-sm font-medium text-gray-500 mr-2">Email:</span>
                          <span className="text-gray-800">{student.email}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="text-orange-400 mr-2" size={16} />
                          <span className="text-sm font-medium text-gray-500 mr-2">Phone:</span>
                          <span className="text-gray-800">{student.phone}</span>
                        </div>
                        <div>
                          <div className="flex items-center mb-2">
                            <Tag className="text-orange-400 mr-2" size={16} />
                            <span className="text-sm font-medium text-gray-500">Batches:</span>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-1 pl-6">
                            {student.batches && student.batches.length > 0 ? (
                              student.batches.map((batch) => (
                                <Badge
                                  key={batch}
                                  variant="secondary"
                                  className="px-3 py-1.5 rounded-full bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors border border-orange-100"
                                >
                                  {batch}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-sm text-gray-400 italic">No batches assigned</span>
                            )}
                          </div>
                        </div>
                        {student.createdAt && (
                          <div className="text-xs text-gray-400 mt-1">Added on {formatDate(student.createdAt)}</div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 pt-4 pb-4 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-300 hover:bg-orange-50 hover:border-orange-200 transition-colors"
                        onClick={() => openEditDialog(student)}
                      >
                        <Edit size={14} className="mr-1.5 text-orange-500" /> Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                        onClick={() => confirmDeleteStudent(student.id)}
                      >
                        <Trash2 size={14} className="mr-1.5" /> Delete
                      </Button>
                    </CardFooter>
                  </Card>
                ))}

                {filteredStudents.length === 0 && !loading && !error && (
                  <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <Users size={56} className="mb-4 opacity-40 text-gray-400" />
                    <p className="text-lg mb-2">No students found</p>
                    <p className="text-sm text-gray-400">Try different search criteria or add a new student.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Batches Tab */}
            <TabsContent value="batches" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {batches.length > 0 ? (
                  batches
                    .filter(
                      (batch) =>
                        batch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        batch.students.some(
                          (student) =>
                            student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            student.studentId.toLowerCase().includes(searchQuery.toLowerCase()),
                        ),
                    )
                    .map((batch) => (
                      <Card
                        key={batch.id}
                        className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-gray-200 rounded-lg"
                      >
                        <CardHeader className="pb-4 bg-orange-50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <BookOpen className="text-orange-500 mr-3" size={24} />
                              <CardTitle className="text-xl font-bold text-gray-800">{batch.name}</CardTitle>
                            </div>
                            <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200">
                              {batch.students.length} {batch.students.length === 1 ? "Student" : "Students"}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-4 pb-4">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <Users className="text-orange-400 mr-2" size={18} />
                              <span className="font-medium">
                                {batch.students.length} {batch.students.length === 1 ? "Student" : "Students"}
                              </span>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-orange-200 text-orange-600 hover:bg-orange-50"
                              onClick={() => openBatchDialog(batch)}
                            >
                              View Students
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <BookOpen size={56} className="mb-4 opacity-40 text-gray-400" />
                    <p className="text-lg mb-2">No batches found</p>
                    <p className="text-sm text-gray-400">Add students to batches to see them here.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>

      {/* Add/Edit Student Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{dialogMode === "add" ? "Add New Student" : "Edit Student"}</DialogTitle>
            {dialogMode === "add" && userEmail && (
              <DialogDescription className="mt-2">You will be recorded as the creator ({userEmail})</DialogDescription>
            )}
          </DialogHeader>

          <div className="space-y-4 my-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Student Name</Label>
                <Input
                  id="name"
                  value={currentStudent.name}
                  onChange={(e) => setCurrentStudent({ ...currentStudent, name: e.target.value })}
                  placeholder="Enter student name"
                  className="border-gray-300 focus:border-orange-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                  id="studentId"
                  value={currentStudent.studentId}
                  onChange={(e) => setCurrentStudent({ ...currentStudent, studentId: e.target.value })}
                  placeholder="Enter student ID"
                  className="border-gray-300 focus:border-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={currentStudent.email}
                  onChange={(e) => setCurrentStudent({ ...currentStudent, email: e.target.value })}
                  placeholder="Enter student email"
                  className="border-gray-300 focus:border-orange-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={currentStudent.phone}
                  onChange={(e) => setCurrentStudent({ ...currentStudent, phone: e.target.value })}
                  placeholder="Enter student phone"
                  className="border-gray-300 focus:border-orange-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={currentStudent.address}
                onChange={(e) => setCurrentStudent({ ...currentStudent, address: e.target.value })}
                placeholder="Enter student address"
                className="border-gray-300 focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fatherName">Father&#39;s Name</Label>
                <Input
                  id="fatherName"
                  value={currentStudent.fatherName}
                  onChange={(e) => setCurrentStudent({ ...currentStudent, fatherName: e.target.value })}
                  placeholder="Enter father's name"
                  className="border-gray-300 focus:border-orange-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fatherPhone">Father&#39;s Phone</Label>
                <Input
                  id="fatherPhone"
                  value={currentStudent.fatherPhone}
                  onChange={(e) => setCurrentStudent({ ...currentStudent, fatherPhone: e.target.value })}
                  placeholder="Enter father's phone"
                  className="border-gray-300 focus:border-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="motherName">Mother&#39;s Name</Label>
                <Input
                  id="motherName"
                  value={currentStudent.motherName}
                  onChange={(e) => setCurrentStudent({ ...currentStudent, motherName: e.target.value })}
                  placeholder="Enter mother's name"
                  className="border-gray-300 focus:border-orange-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="motherPhone">Mother&#39;s Phone</Label>
                <Input
                  id="motherPhone"
                  value={currentStudent.motherPhone}
                  onChange={(e) => setCurrentStudent({ ...currentStudent, motherPhone: e.target.value })}
                  placeholder="Enter mother's phone"
                  className="border-gray-300 focus:border-orange-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Subject</Label>
                <Select value={selectedSubject} onValueChange={handleSubjectChange}>
                  <SelectTrigger className="border-gray-300 focus:border-orange-500">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.length > 0 ? (
                      subjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="loading" disabled>
                        No subjects available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Batches</Label>
                {selectedSubject ? (
                  <>
                    <Select
                      value={editableBatches.length === 1 ? editableBatches[0] : ""}
                      onValueChange={(batch) => {
                        if (batch && !editableBatches.includes(batch)) {
                          setEditableBatches([...editableBatches, batch])
                        }
                      }}
                    >
                      <SelectTrigger className="border-gray-300 focus:border-orange-500">
                        <SelectValue placeholder="Select a batch" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredBatches.length > 0 ? (
                          filteredBatches.map((batch) => (
                            <SelectItem key={batch} value={batch}>
                              {batch}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="none" disabled>
                            No batches available for this subject
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>

                    <div className="mt-4">
                      <Label className="mb-2 block">Selected Batches: </Label>
                      <div className="flex flex-wrap gap-2 p-3 border rounded-md min-h-16">
                        {editableBatches.length > 0 ? (
                          editableBatches.map((batch) => (
                            <Badge
                              key={batch}
                              variant="secondary"
                              className="flex items-center gap-1 px-3 py-1.5 bg-orange-50 text-orange-600 border border-orange-100"
                            >
                              {batch}
                              <span title={`Remove ${batch}`}>
                                <X
                                  size={14}
                                  className="cursor-pointer ml-1 hover:text-red-500"
                                  onClick={() => removeBatch(batch)}
                                  aria-label={`Remove batch ${batch}`}
                                />
                              </span>
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-gray-400 italic">No batches selected</span>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-3 border rounded-md bg-gray-50 text-gray-500 text-sm">
                    Please select a subject first to view available batches
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-gray-300">
              Cancel
            </Button>
            <Button
              onClick={saveStudent}
              disabled={!currentStudent.name || !currentStudent.email || !currentStudent.phone || saveLoading}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {saveLoading ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  {dialogMode === "add" ? "Add Student" : "Save Changes"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle size={18} />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription className="pt-2">
              Are you sure you want to delete this student? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-gray-300"
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button onClick={deleteStudent} className="bg-red-500 hover:bg-red-600 text-white" disabled={deleteLoading}>
              {deleteLoading ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 size={16} className="mr-2" />
                  Delete Student
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Batch Students Dialog */}
      <Dialog open={isBatchDialogOpen} onOpenChange={setIsBatchDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="text-orange-500" size={20} />
              {selectedBatch?.name} - Student List
            </DialogTitle>
            <DialogDescription>
              Showing {selectedBatch?.students.length}{" "}
              {selectedBatch?.students && selectedBatch.students.length === 1 ? "student" : "students"} in this batch
            </DialogDescription>
          </DialogHeader>

          <div className="my-4">
            <ScrollArea className="h-[60vh] pr-4">
              <div className="space-y-4">
                {selectedBatch?.students.map((student) => (
                  <Card key={student.id} className="overflow-hidden border-gray-200">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <GraduationCap className="text-orange-500 mr-3" size={20} />
                          <CardTitle className="text-lg font-bold text-gray-800">{student.name}</CardTitle>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 border-gray-300 hover:bg-orange-50 hover:border-orange-200"
                            onClick={() => {
                              setIsBatchDialogOpen(false)
                              openEditDialog(student)
                            }}
                          >
                            <Edit size={14} className="mr-1.5 text-orange-500" /> Edit
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2 pb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center">
                          <FileText className="text-orange-400 mr-2" size={16} />
                          <span className="text-sm font-medium text-gray-500 mr-2">ID:</span>
                          <span className="text-gray-800 font-medium">{student.studentId}</span>
                        </div>
                        <div className="flex items-center">
                          <Mail className="text-orange-400 mr-2" size={16} />
                          <span className="text-sm font-medium text-gray-500 mr-2">Email:</span>
                          <span className="text-gray-800">{student.email}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="text-orange-400 mr-2" size={16} />
                          <span className="text-sm font-medium text-gray-500 mr-2">Phone:</span>
                          <span className="text-gray-800">{student.phone}</span>
                        </div>
                        <div className="flex items-center">
                          <UserRound className="text-orange-400 mr-2" size={16} />
                          <span className="text-sm font-medium text-gray-500 mr-2">Parent:</span>
                          <span className="text-gray-800">
                            {student.fatherName || student.motherName || "Not specified"}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="flex items-center mb-1">
                          <Tag className="text-orange-400 mr-2" size={16} />
                          <span className="text-sm font-medium text-gray-500">Other Batches:</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-1 pl-6">
                          {student.batches && student.batches.length > 0 ? (
                            student.batches
                              .filter((b) => b !== selectedBatch?.name)
                              .map((batch) => (
                                <Badge
                                  key={batch}
                                  variant="secondary"
                                  className="px-3 py-1 rounded-full bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors border border-orange-100"
                                >
                                  {batch}
                                </Badge>
                              ))
                          ) : (
                            <span className="text-sm text-gray-400 italic">No other batches</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>

          <DialogFooter>
            <Button onClick={() => setIsBatchDialogOpen(false)} className="bg-orange-500 hover:bg-orange-600">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

