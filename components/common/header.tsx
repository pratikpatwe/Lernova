"use client"

import { useState, useEffect } from "react"
import { Menu, X, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? "bg-white/95 shadow-sm backdrop-blur-sm" : "bg-transparent"}`}
    >

      <div className="container mx-auto flex items-center justify-between py-6 px-6 sm:px-8 lg:px-12">
        <Link href="/" className="flex items-center cursor-pointer group">
          <h1 className="text-xl font-bold uppercase tracking-wider text-gray-800">LERNOVA</h1>
          <div className="relative ml-2 h-1 w-8 bg-red-500 transition-all duration-300 group-hover:opacity-0"></div>
          <ChevronLeft
            className="absolute ml-25 h-5 w-5 text-red-500 opacity-0 transition-all duration-300 group-hover:opacity-100"
          />
        </Link>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">

          <SignedOut>
            <Button size="sm" className="bg-orange-500 text-white hover:bg-orange-600">
              <Link href="/sign-in">
                Sign In
              </Link>
            </Button>
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>

          <button className="ml-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-4 md:flex">

          <Button variant="link" size="sm" className="text-xs font-medium hover:no-underline hover:bg-gray-100" asChild>
            <Link href="/help">
              Help
            </Link>
          </Button>

          <Button variant="link" size="sm" className="text-xs font-medium hover:no-underline hover:bg-gray-100" asChild>
            <Link href="/#features">
              Features
            </Link>
          </Button>

          <Button variant="link" size="sm" className="text-xs font-medium hover:no-underline hover:bg-gray-100" asChild>
            <Link href="/#faq">
              FAQ
            </Link>
          </Button>


          <SignedOut>
            <Button size="sm" className="bg-orange-500 text-white hover:bg-orange-600">
              <Link href="/sign-in">
                Sign In
              </Link>
            </Button>
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>

        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="container mx-auto border-t py-4 md:hidden">
          <div className="flex flex-col space-y-3">
            <Button variant="ghost" size="sm" className="justify-start text-sm">
              HELP
            </Button>
            <Button variant="ghost" size="sm" className="justify-start text-sm">
              Features
            </Button>
            <Button variant="ghost" size="sm" className="justify-start text-sm">
              FAQ
            </Button>
          </div>
        </div>
      )}

    </header>
  )
}

