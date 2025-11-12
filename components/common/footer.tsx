export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-gray-900 text-white py-12 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/Lernova.svg" alt="Lernova Logo" className="w-10 h-10" />
              <span className="text-lg font-semibold font-momo">
                Lernova
              </span>
            </div>
            <p className="text-gray-400 text-sm">Transform learning with our modern LMS platform.</p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-[#FF5F02] transition-colors text-sm">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#FF5F02] transition-colors text-sm">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#FF5F02] transition-colors text-sm">
                  Security
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-[#FF5F02] transition-colors text-sm">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#FF5F02] transition-colors text-sm">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#FF5F02] transition-colors text-sm">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-[#FF5F02] transition-colors text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#FF5F02] transition-colors text-sm">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#FF5F02] transition-colors text-sm">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <p className="text-gray-400 text-sm text-center">© {currentYear} Lernova. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}