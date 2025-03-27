import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-white py-20 px-6 sm:px-8 lg:px-12">
      <div className="container mx-auto grid grid-cols-1 items-center gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div className="inline-block rounded-full bg-orange-100 px-4 py-1 text-sm font-medium text-orange-600">
            Learning Management System
          </div>
          <h2 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            Organized Learning,
            <br />
            <span className="text-orange-500">Effortless Management!</span>
          </h2>
          <p className="text-lg text-gray-600">
            A smart platform for seamless course material distribution, structured assignments, and real-time student progress tracking.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button className="group bg-orange-500 px-6 py-6 text-white transition-all hover:bg-orange-600">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="outline" className="px-6 py-6">
              Watch Demo
            </Button>
          </div>
        </div>
        <div className="relative mb-10 hidden sm:block">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-orange-100 opacity-50 blur-3xl"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <iframe
              src="https://lottie.host/embed/3d41a150-0c4c-4325-a594-974f881607df/7ZeCiZvnbs.lottie"
              className="h-[500px] w-[500px]"
              style={{ border: "none" }}
              title="Lottie Animation"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-pink-100 opacity-30 blur-3xl"></div>
    </section>
  )
}

