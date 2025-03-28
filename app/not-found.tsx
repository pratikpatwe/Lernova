import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white overflow-hidden relative">
      <div className="absolute inset-0 z-0 hidden md:block">
        <iframe
          src="https://lottie.host/embed/85616a1a-0266-49c6-994d-b9fa98b317ae/LeFbTe5voj.lottie"
          className="w-[80%] h-[80%] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          style={{ border: 'none' }}
        ></iframe>
      </div>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
        w-[250px] h-[250px] 
        sm:w-[300px] sm:h-[300px] 
        md:w-[400px] md:h-[400px] 
        lg:w-[500px] lg:h-[500px] 
        bg-gradient-to-br from-orange-100 via-blue-100 to-purple-100 
        rounded-full opacity-40 blur-3xl z-0"></div>

      <div className="relative z-10 text-center bg-white/80 backdrop-blur-sm rounded-xl max-w-md mx-4 p-8 shadow-sm">
        <div className="bg-orange-500/10 inline-block px-4 py-2 rounded-full mb-4">
          <span className="text-orange-600 font-medium text-sm">
            Error 404
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>

        <p className="text-base md:text-lg text-gray-600 mb-6">
          Oops! The page you&apos;re looking for has disappeared into the digital abyss.
        </p>

        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 transition duration-300 ease-in-out"
          >
            Return to Home
          </Link>

          <Link
            href="/contact"
            className="inline-block px-6 py-3 border-2 border-orange-500 text-orange-500 font-semibold rounded-lg hover:bg-orange-50 transition duration-300"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}