import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, BookOpen, Clock } from "lucide-react"

export default function StudentHome() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Student Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Upcoming Assignments</CardTitle>
            <BookOpen className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-gray-500">Due this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Next Class</CardTitle>
            <CalendarDays className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Web Development</div>
            <p className="text-xs text-gray-500">Today, 2:00 PM</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Study Time</CardTitle>
            <Clock className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.5 hrs</div>
            <p className="text-xs text-gray-500">This week</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-4">Recent Announcements</h2>
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="font-medium">Course Schedule Update</h3>
              <p className="text-sm text-gray-500 mt-1">
                The JavaScript workshop has been rescheduled to Friday at 3:00 PM.
              </p>
              <p className="text-xs text-gray-400 mt-2">Posted 2 hours ago</p>
            </div>
            <div className="border-b pb-4">
              <h3 className="font-medium">New Learning Resources Available</h3>
              <p className="text-sm text-gray-500 mt-1">
                Additional resources for React have been uploaded to the learning portal.
              </p>
              <p className="text-xs text-gray-400 mt-2">Posted yesterday</p>
            </div>
            <div>
              <h3 className="font-medium">Upcoming Guest Lecture</h3>
              <p className="text-sm text-gray-500 mt-1">
                Join us for a special guest lecture on UI/UX design principles next Monday.
              </p>
              <p className="text-xs text-gray-400 mt-2">Posted 3 days ago</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

