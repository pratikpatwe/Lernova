"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

interface HeaderProps {
  isScrolled: boolean;
}

export default function Header({ isScrolled }: HeaderProps) {
  return (
    <header
      className={`fixed w-full top-0 left-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 shadow-lg backdrop-blur-sm mx-4 mt-2 rounded-xl max-w-[calc(100%-32px)]"
          : "bg-transparent"
      }`}
      style={{
        left: isScrolled ? "16px" : "0",
        right: isScrolled ? "16px" : "0",
        width: isScrolled ? "calc(100% - 32px)" : "100%",
        marginLeft: isScrolled ? "auto" : "0",
        marginRight: isScrolled ? "auto" : "0",
      }}
    >
      <nav className="flex items-center justify-between px-6 py-4 md:px-8">
        {/* Logo and App Name */}
        <div className="flex items-center gap-2">
          <img src="/Lernova.svg" alt="Lernova Logo" className="w-10 h-10" />
          <span className="text-2xl font-semibold text-gray-900 font-momo">
            Lernova
          </span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-gray-700 hover:text-[#FF5F02] transition-colors font-medium text-sm"
          >
            Features
          </a>
          <a
            href="#pricing"
            className="text-gray-700 hover:text-[#FF5F02] transition-colors font-medium text-sm"
          >
            Pricing
          </a>
          <a
            href="#faqs"
            className="text-gray-700 hover:text-[#FF5F02] transition-colors font-medium text-sm"
          >
            FAQs
          </a>
          <a
            href="#contact"
            className="text-gray-700 hover:text-[#FF5F02] transition-colors font-medium text-sm"
          >
            Contact
          </a>
        </div>

        {/* Login Button */}
        <div>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-6 py-2 bg-gray-100 text-gray-900 font-medium text-sm hover:bg-[#FF5F02] hover:text-white rounded-lg transition-colors hover:cursor-pointer">
                Log In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
}