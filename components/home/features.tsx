import { Shield, BookOpen, ClipboardList, CheckCircle } from "lucide-react"

export default function Features() {
  return (
    <section className="container mx-auto py-24 px-6 sm:px-8 lg:px-12">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
          Streamlined Learning with Smart Role Management
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-gray-600">
          A unified platform for students, trainers, and administrators to collaborate, learn, and manage with ease.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Feature Cards */}
        <div className="group rounded-xl bg-pink-50 p-8 shadow-sm transition-all hover:shadow-md">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-pink-100 text-pink-600 transition-all group-hover:bg-pink-200">
            <Shield className="h-8 w-8" />
          </div>
          <h3 className="mb-4 text-xl font-bold text-pink-800">Role-Based Access Control</h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <CheckCircle className="mr-2 h-5 w-5 shrink-0 text-pink-500" />
              <span>Secure access levels</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="mr-2 h-5 w-5 shrink-0 text-pink-500" />
              <span>Customizable permissions</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="mr-2 h-5 w-5 shrink-0 text-pink-500" />
              <span>User management</span>
            </li>
          </ul>
        </div>

        <div className="group rounded-xl bg-amber-50 p-8 shadow-sm transition-all hover:shadow-md">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-amber-100 text-amber-600 transition-all group-hover:bg-amber-200">
            <BookOpen className="h-8 w-8" />
          </div>
          <h3 className="mb-4 text-xl font-bold text-amber-800">Dynamic Course Management</h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <CheckCircle className="mr-2 h-5 w-5 shrink-0 text-amber-500" />
              <span>Upload & distribute PDFs</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="mr-2 h-5 w-5 shrink-0 text-amber-500" />
              <span>Interactive quizzes</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="mr-2 h-5 w-5 shrink-0 text-amber-500" />
              <span>Progress tracking</span>
            </li>
          </ul>
        </div>

        <div className="group rounded-xl bg-green-50 p-8 shadow-sm transition-all hover:shadow-md">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-green-100 text-green-600 transition-all group-hover:bg-green-200">
            <ClipboardList className="h-8 w-8" />
          </div>
          <h3 className="mb-4 text-xl font-bold text-green-800">Task & Assignment Tracking</h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <CheckCircle className="mr-2 h-5 w-5 shrink-0 text-green-500" />
              <span>Assign & submit tasks</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="mr-2 h-5 w-5 shrink-0 text-green-500" />
              <span>Auto-graded assignments</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="mr-2 h-5 w-5 shrink-0 text-green-500" />
              <span>Bulk student progress</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}

