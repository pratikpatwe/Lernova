import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, UserCheck } from "lucide-react";

const AdminHome = () => {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Trainers Card */}
      <Card className="shadow-lg border border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Total Trainers</CardTitle>
          <UserCheck className="text-orange-500 w-8 h-8" />
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-gray-700">12</p>
        </CardContent>
      </Card>

      {/* Total Students Card */}
      <Card className="shadow-lg border border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Total Students</CardTitle>
          <Users className="text-orange-500 w-8 h-8" />
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-gray-700">230</p>
        </CardContent>
      </Card>

      {/* Total Subjects Card */}
      <Card className="shadow-lg border border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Total Subjects</CardTitle>
          <BookOpen className="text-orange-500 w-8 h-8" />
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-gray-700">8</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminHome;