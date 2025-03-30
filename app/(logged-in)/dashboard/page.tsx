"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { getDatabase, ref, get, child } from "firebase/database";

import AdminDashboard from "@/components/dashboard/admin-dashboard";
import StudentDashboard from "@/components/dashboard/student-dashboard";

export default function Dashboard() {
  const [role, setRole] = useState<"admin" | "student" | null>(null);
  const { user } = useUser();

  useEffect(() => {
    const fetchUserRole = async () => {
      const userEmail = user?.primaryEmailAddress?.emailAddress;

      if (!userEmail) return;

      const db = getDatabase();
      const dbRef = ref(db);

      try {
        // Check if the user is an admin
        const adminSnapshot = await get(child(dbRef, "admin"));
        if (adminSnapshot.exists() && adminSnapshot.val().includes(userEmail)) {
          setRole("admin");
          return; // Exit early if admin
        }

        // Check if the user is a student
        const studentsSnapshot = await get(child(dbRef, "students"));
        if (studentsSnapshot.exists()) {
          const students: Record<string, { email: string }> = studentsSnapshot.val();
          const isStudent = Object.values(students).some(
            (student) => student.email === userEmail
          );
          if (isStudent) {
            setRole("student");
          }
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchUserRole();
  }, [user]);

  if (role === "admin") {
    return (
      <section className="h-[100vh]">
        <AdminDashboard />
      </section>
    );
  }

  if (role === "student") {
    return (
      <section className="h-[100vh]">
        <StudentDashboard />
      </section>
    );
  }

  return (
    <div className="flex items-center justify-center h-[100vh]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500 border-solid"></div>
    </div>
  );
}