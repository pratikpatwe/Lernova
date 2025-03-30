"use client"
import { SignedIn, SignedOut, RedirectToSignIn, SignOutButton, useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Home, Upload, MessageSquareText, LogOut, PanelRightOpen, PanelRightClose, BotMessageSquare } from "lucide-react"
import { UserButton } from "@clerk/nextjs"
import { useState, useEffect } from "react"

// Import your student dashboard components
import StudentHome from "@/components/dashboard/content/student-home"
import StudentStream from "@/components/dashboard/content/student-stream"
import UploadAssignment from "@/components/dashboard/content/student-upload-assignment"

export default function StudentDashboard() {
  const { user } = useUser()
  const [activeComponent, setActiveComponent] = useState("home")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // Check if screen is mobile size
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }

    // Set initial state
    checkIfMobile()

    // Add event listener
    window.addEventListener("resize", checkIfMobile)

    // Clean up
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Handle navigation click - centralizing the logic
  const handleNavClick = (component: string) => {
    setActiveComponent(component)
    if (isMobile) {
      setSidebarOpen(false)
    }
  }

  // Render the active component based on selection
  const renderComponent = () => {
    switch (activeComponent) {
      case "stream":
        return <StudentStream />
      case "upload":
        return <UploadAssignment />
      case "agent":
        return <h2 className="m-2">AI agent for student help</h2>
      case "home":
      default:
        return <StudentHome />
    }
  }

  return (
    <section>
      <SignedIn>
        <div className="flex h-screen relative bg-color-800">
          {/* Mobile Sidebar Toggle Button */}
          {isMobile && (
            <Button
              variant="ghost"
              onClick={toggleSidebar}
              className="fixed bottom-4 left-4 z-50 bg-white text-gray-800 hover:bg-gray-200 p-2 rounded-md shadow-md"
              size="sm"
            >
              {sidebarOpen ? <PanelRightClose className="w-5 h-5" /> : <PanelRightOpen className="w-5 h-5" />}
            </Button>
          )}

          {/* Sidebar */}
          <div
            className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"
              } transition-transform duration-300 ease-in-out md:translate-x-0 w-64 bg-white border-r border-gray-200 text-gray-800 flex flex-col fixed h-full z-40 md:relative`}
          >
            {/* Logo and Header */}
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold flex items-center">
                <UserButton />
                <span className="text-gray-800 ml-4">STUDENT</span>
              </h2>
              <p className="text-xs mt-1 text-gray-600">{user?.primaryEmailAddress?.emailAddress}</p>
            </div>

            {/* Navigation */}
            <div className="flex-1 p-4">
              <ul className="space-y-2">
                <li>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-left pl-3 flex items-center gap-3 text-gray-700 hover:bg-gray-100 ${activeComponent === "home" ? "bg-orange-500 text-white" : ""} cursor-pointer`}
                    onClick={() => handleNavClick("home")}
                  >
                    <Home className="w-5 h-5" />
                    Home
                  </Button>
                </li>
                <li>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-left pl-3 flex items-center gap-3 text-gray-700 hover:bg-gray-100 ${activeComponent === "stream" ? "bg-orange-500 text-white" : ""} cursor-pointer`}
                    onClick={() => handleNavClick("stream")}
                  >
                    <MessageSquareText className="w-5 h-5" />
                    Stream
                  </Button>
                </li>
                <li>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-left pl-3 flex items-center gap-3 text-gray-700 hover:bg-gray-100 ${activeComponent === "upload" ? "bg-orange-500 text-white" : ""} cursor-pointer`}
                    onClick={() => handleNavClick("upload")}
                  >
                    <Upload className="w-5 h-5" />
                    Upload Assignment
                  </Button>
                </li>
                <li>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-left pl-3 flex items-center gap-3 text-gray-700 hover:bg-gray-100 ${activeComponent === "agent" ? "bg-orange-500 text-white" : ""} cursor-pointer`}
                    onClick={() => handleNavClick("agent")}
                  >
                    <BotMessageSquare className="w-5 h-5" />
                    LernoBot
                  </Button>
                </li>
              </ul>
            </div>

            {/* Logout Button at bottom */}
            <div className="p-4 border-t border-gray-200">
              <SignOutButton>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left pl-3 flex items-center gap-3 text-gray-700 hover:bg-red-500 hover:text-white cursor-pointer bg-gray-100"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </Button>
              </SignOutButton>
            </div>
          </div>

          {/* Overlay for mobile when sidebar is open */}
          {isMobile && sidebarOpen && (
            <div className="fixed inset-0 bg-white bg-opacity-70 z-30" onClick={() => setSidebarOpen(false)}></div>
          )}

          {/* Main Content Area */}
          <div className={`flex-1 bg-gray-100 overflow-auto ${isMobile ? "w-full" : ""}`}>
            {/* Add padding to bottom on mobile to account for the toggle button */}
            <div className={`${isMobile ? "pb-16" : ""} h-full`}>{renderComponent()}</div>
          </div>
        </div>
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn redirectUrl="/sign-in" />
      </SignedOut>
    </section>
  )
}

