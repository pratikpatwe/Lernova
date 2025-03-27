import Link from "next/link"
import { Facebook, Instagram, Linkedin, Twitter, ArrowRight } from "lucide-react"

export default function Footer() {
  return (
    <footer className="mt-auto bg-gray-900 py-20 px-6 sm:px-8 lg:px-12 text-gray-300">
      <div className="container mx-auto grid grid-cols-1 gap-12 md:grid-cols-4">
        <div className="space-y-6">
          <div className="flex items-center">
            <h2 className="text-xl font-bold uppercase tracking-wider text-white">LERNOVA</h2>
            <div className="ml-2 h-1 w-6 bg-orange-500"></div>
          </div>
          <p className="text-gray-400">
            Organized Learning,
            <br />
            Effortless Management!
          </p>
          <div className="flex space-x-4">
            <Link
              href="#"
              className="rounded-full bg-gray-800 p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
            >
              <Facebook size={18} />
            </Link>
            <Link
              href="#"
              className="rounded-full bg-gray-800 p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
            >
              <Twitter size={18} />
            </Link>
            <Link
              href="#"
              className="rounded-full bg-gray-800 p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
            >
              <Instagram size={18} />
            </Link>
            <Link
              href="#"
              className="rounded-full bg-gray-800 p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
            >
              <Linkedin size={18} />
            </Link>
          </div>
        </div>

        <div>
          <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-white">Services</h3>
          <ul className="space-y-3 text-gray-400">
            <li className="transition-colors hover:text-orange-400">
              <Link href="#" className="inline-flex items-center">
                <ArrowRight className="mr-2 h-3 w-3" />
                Learning Management
              </Link>
            </li>
            <li className="transition-colors hover:text-orange-400">
              <Link href="#" className="inline-flex items-center">
                <ArrowRight className="mr-2 h-3 w-3" />
                Course Creation
              </Link>
            </li>
            <li className="transition-colors hover:text-orange-400">
              <Link href="#" className="inline-flex items-center">
                <ArrowRight className="mr-2 h-3 w-3" />
                Progress Analytics
              </Link>
            </li>
            <li className="transition-colors hover:text-orange-400">
              <Link href="#" className="inline-flex items-center">
                <ArrowRight className="mr-2 h-3 w-3" />
                Student Engagement
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-white">Company</h3>
          <ul className="space-y-3 text-gray-400">
            <li className="transition-colors hover:text-orange-400">
              <Link href="#" className="inline-flex items-center">
                <ArrowRight className="mr-2 h-3 w-3" />
                About
              </Link>
            </li>
            <li className="transition-colors hover:text-orange-400">
              <Link href="#" className="inline-flex items-center">
                <ArrowRight className="mr-2 h-3 w-3" />
                Careers
              </Link>
            </li>
            <li className="transition-colors hover:text-orange-400">
              <Link href="#" className="inline-flex items-center">
                <ArrowRight className="mr-2 h-3 w-3" />
                Blog
              </Link>
            </li>
            <li className="transition-colors hover:text-orange-400">
              <Link href="#" className="inline-flex items-center">
                <ArrowRight className="mr-2 h-3 w-3" />
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-white">Legal</h3>
          <ul className="space-y-3 text-gray-400">
            <li className="transition-colors hover:text-orange-400">
              <Link href="#" className="inline-flex items-center">
                <ArrowRight className="mr-2 h-3 w-3" />
                Terms of Use
              </Link>
            </li>
            <li className="transition-colors hover:text-orange-400">
              <Link href="#" className="inline-flex items-center">
                <ArrowRight className="mr-2 h-3 w-3" />
                Privacy Policy
              </Link>
            </li>
            <li className="transition-colors hover:text-orange-400">
              <Link href="#" className="inline-flex items-center">
                <ArrowRight className="mr-2 h-3 w-3" />
                Cookie Policy
              </Link>
            </li>
            <li className="transition-colors hover:text-orange-400">
              <Link href="#" className="inline-flex items-center">
                <ArrowRight className="mr-2 h-3 w-3" />
                Security
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto mt-12 border-t border-gray-800 pt-8">
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-gray-500 md:flex-row">
          <p>© 2025 LERNOVA. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span>English (United States)</span>
            <span className="inline-block h-4 w-4 rounded-full bg-gradient-to-r from-orange-500 to-pink-500"></span>
          </div>
        </div>
      </div>
    </footer>
  )
}

