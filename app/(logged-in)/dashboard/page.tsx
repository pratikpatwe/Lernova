import AdminDashboard from "@/components/dashboard/admin-dashboard";
// import TrainerDashboard from "@/components/dashboard/trainer-dashboard";
// import StudentDashboard from "@/components/dashboard/student-dashboard";

export default function Dashboard() {
  return (
    <section className="h-[100vh]">
      <AdminDashboard />
    </section>
  );
}