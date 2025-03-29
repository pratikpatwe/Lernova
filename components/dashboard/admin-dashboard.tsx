'use client';
import { SignedIn, SignedOut, RedirectToSignIn, SignOutButton, useUser } from '@clerk/nextjs';
import { Button } from "@/components/ui/button";
import { Home, Users, GraduationCap, BookOpen, List, MessageSquareText, LogOut } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';
import { useState } from 'react';
import ManageTrainersDash from "@/components/dashboard/content/manage-trainer";

// Import your components here

// import ManageStudentsDash from './ManageStudentsDash';
// import AssignmentsStream from './AssignmentsStream';
// import AssignmentsList from './AssignmentsList';
// import HomeDashboard from './HomeDashboard';

export default function AdminDashboard() {
  const { user } = useUser();
  const [activeComponent, setActiveComponent] = useState('home');
  const [assignmentTab, setAssignmentTab] = useState('stream');

  // Render the active component based on selection
  const renderComponent = () => {
    switch (activeComponent) {
      case 'trainers':
        // return <div className="p-6">ManageTrainersDash component will render here</div>;
        return <ManageTrainersDash />;
      case 'students':
        return <div className="p-6">ManageStudentsDash component will render here</div>;
      // return <ManageStudentsDash />;
      case 'assignments':
        if (assignmentTab === 'stream') {
          return <div className="p-6">AssignmentsStream component will render here</div>;
          // return <AssignmentsStream />;
        } else {
          return <div className="p-6">AssignmentsList component will render here</div>;
          // return <AssignmentsList />;
        }
      case 'home':
      default:
        return <div className="p-6">HomeDashboard component will render here</div>;
      // return <HomeDashboard />;
    }
  };

  return (
    <section>
      <SignedIn>
        <div className="flex h-screen">
          {/* Sidebar */}
          <div className="w-64 bg-gray-800 text-gray-200 flex flex-col">
            {/* Logo and Header */}
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-xl font-bold flex items-center">
                <UserButton />
                <span className="text-white ml-4">ADMIN</span>
              </h2>
              <p className="text-xs mt-1 text-gray-400 ">{user?.primaryEmailAddress?.emailAddress}</p>
            </div>

            {/* Navigation */}
            <div className="flex-1 p-4">
              <ul className="space-y-2">
                <li>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-left pl-3 flex items-center gap-3 text-gray-200 bg-gray-700 hover:bg-white hover:text-gray-800 ${activeComponent === 'home' ? 'bg-orange-500 text-white' : ''} cursor-pointer`}
                    onClick={() => setActiveComponent('home')}
                  >
                    <Home className="w-5 h-5" />
                    Home
                  </Button>
                </li>
                <li>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-left pl-3 flex items-center gap-3 text-gray-200 bg-gray-700 hover:bg-white hover:text-gray-800 ${activeComponent === 'trainers' ? 'bg-orange-500 text-white' : ''} cursor-pointer`}
                    onClick={() => setActiveComponent('trainers')}
                  >
                    <Users className="w-5 h-5" />
                    Manage Trainers
                  </Button>
                </li>
                <li>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-left pl-3 flex items-center gap-3 text-gray-200 bg-gray-700 hover:bg-white hover:text-gray-800 ${activeComponent === 'students' ? 'bg-orange-500 text-white' : ''} cursor-pointer`}
                    onClick={() => setActiveComponent('students')}
                  >
                    <GraduationCap className="w-5 h-5" />
                    Manage Students
                  </Button>
                </li>
                <li>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-left pl-3 flex items-center gap-3 text-gray-200 bg-gray-700 hover:bg-white hover:text-gray-800 ${activeComponent === 'assignments' ? 'bg-orange-500 text-white' : ''} cursor-pointer`}
                    onClick={() => setActiveComponent('assignments')}
                  >
                    <BookOpen className="w-5 h-5" />
                    Manage Assignments
                  </Button>

                  {/* Assignment Subtabs */}
                  {activeComponent === 'assignments' && (
                    <div className="ml-6 mt-2 space-y-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`w-full justify-start text-left pl-3 py-1 text-sm flex items-center gap-2 ${assignmentTab === 'stream' ? 'bg-orange-500 text-white' : 'text-gray-300 bg-gray-700 hover:bg-white hover:text-gray-800'} cursor-pointer`}
                        onClick={() => setAssignmentTab('stream')}
                      >
                        <MessageSquareText className="w-4 h-4" />
                        Stream
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`w-full justify-start text-left pl-3 py-1 text-sm flex items-center gap-2 ${assignmentTab === 'assignments' ? 'bg-orange-500 text-white' : 'text-gray-300 bg-gray-700 hover:bg-white hover:text-gray-800'} cursor-pointer`}
                        onClick={() => setAssignmentTab('assignments')}
                      >
                        <List className="w-4 h-4" />
                        Assignments
                      </Button>
                    </div>
                  )}
                </li>
              </ul>
            </div>

            {/* Logout Button at bottom */}
            <div className="p-4 border-t border-gray-700">
              <SignOutButton>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left pl-3 flex items-center gap-3 text-gray-200 bg-gray-700 hover:bg-red-500 hover:text-white cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </Button>
              </SignOutButton>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 bg-gray-100 overflow-auto">
            {renderComponent()}
          </div>
        </div>
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn redirectUrl="/sign-in" />
      </SignedOut>
    </section>
  );
}