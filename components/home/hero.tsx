import { ArrowRight, Sparkles, Users, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-pink-50 to-white py-24 px-6 sm:px-8 lg:px-12">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-orange-200 to-pink-200 opacity-30 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-br from-blue-200 to-purple-200 opacity-20 blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-gradient-to-br from-yellow-100 to-orange-100 opacity-10 blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="container relative z-10 mx-auto grid grid-cols-1 items-center gap-12 md:grid-cols-2">
        <div className="space-y-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-100 to-pink-100 px-4 py-2 text-sm font-medium text-orange-700 shadow-sm border border-orange-200/50">
            <Sparkles className="h-4 w-4" />
            Learning Management System
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                Organized Learning,
              </span>
              <br />
              <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-orange-600 bg-clip-text text-transparent animate-gradient-x">
                Effortless Management!
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
              Transform your educational experience with our intelligent platform designed for seamless course distribution, structured assignments, and comprehensive progress tracking.
            </p>
          </div>

          {/* Feature highlights */}
          <div className="flex flex-wrap gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              <span>Real-time Analytics</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" style={{animationDelay: '0.5s'}}></div>
              <span>Secure & Scalable</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" style={{animationDelay: '1s'}}></div>
              <span>Easy Integration</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <Button className="group bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 px-8 py-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" asChild>
              <Link href="/dashboard" className="flex items-center">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>

            <Button variant="outline" className="group px-8 py-6 border-2 hover:bg-gray-50 transition-all duration-300 hover:border-orange-300" asChild>
              <Link href="/#demo" className="flex items-center">
                Watch Demo
                <div className="ml-2 h-2 w-2 rounded-full bg-orange-500 animate-pulse"></div>
              </Link>
            </Button>
          </div>
        </div>
        <div className="relative mb-10 hidden sm:block animate-fade-in-up" style={{animationDelay: '0.3s'}}>
          <div className="relative">
            {/* Enhanced floating elements */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-orange-200 to-pink-200 opacity-40 blur-3xl animate-pulse"></div>
            <div className="absolute -left-10 top-10 h-32 w-32 rounded-full bg-gradient-to-br from-blue-200 to-purple-200 opacity-30 blur-2xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
            
            {/* Main animation container with enhanced styling */}
            <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"></div>
              <div className="relative flex items-center justify-center">
                <iframe
                  src="https://lottie.host/embed/3d41a150-0c4c-4325-a594-974f881607df/7ZeCiZvnbs.lottie"
                  className="h-[450px] w-[450px] rounded-2xl"
                  style={{ border: "none" }}
                  title="Lottie Animation"
                ></iframe>
              </div>
              
              {/* Floating stats */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-3 shadow-lg border animate-bounce" style={{animationDelay: '2s'}}>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-semibold text-gray-700">10K+ Students</span>
                </div>
              </div>
              
              <div className="absolute -top-4 -right-4 bg-white rounded-xl p-3 shadow-lg border animate-bounce" style={{animationDelay: '2.5s'}}>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-semibold text-gray-700">500+ Courses</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
