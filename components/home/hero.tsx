import { ChevronRight } from "lucide-react";
import { SignInButton } from "@clerk/nextjs";

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen bg-white pt-24 pb-16 px-6 md:px-12 flex flex-col items-center justify-center">
      {/* Background gradient effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-100 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-50 rounded-full opacity-20 blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="relative">
          {/* Background SVG */}
          <img
            src="/HeroLernova.svg"
            alt="Decorative background"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-auto opacity-50 -z-10"
          />

          {/* Heading */}
          <h1 className="relative z-0 text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-2">
            Transform Learning
          </h1>

          {/* Subheading with Momo Signature font */}
          <div className="relative z-0 mb-6">
            <p className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
              with{" "}
              <span className="font-momo text-[#FF5F02] font-medium">
                Lernova
              </span>
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-10">
          Effortlessly manage learning progress,
          <br />
          enhancing engagement and student success.
        </p>

        {/* CTA Button */}
        <SignInButton>
          <button className="group bg-[#FF5F02] hover:bg-[#E54E00] text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 mb-16 shadow-lg hover:shadow-xl hover:cursor-pointer">
            <span className="flex items-center justify-center">
              Get Started
              <ChevronRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </span>
          </button>
        </SignInButton>

        {/* Screenshot with curved corners */}
        <div className="w-full max-w-6xl mx-auto">
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
            <img
              src="/dashboard.gif"
              alt="Lernova LMS Dashboard"
              className="w-full h-auto"
            />
          </div>
        </div>
.
      </div>
    </section>
  );
}