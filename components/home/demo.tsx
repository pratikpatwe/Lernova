"use client"

import { useState } from "react"
import { Play } from "lucide-react"

export default function Demo() {
  const [videoLoaded, setVideoLoaded] = useState(false)

  return (
    <section id="demo" className="bg-white py-20 px-6 sm:px-8 lg:px-12">
      <div className="container mx-auto">
        <div className="mb-10 text-center">
          <h2 className="mb-4 text-3xl font-bold">See LERNOVA in Action</h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Watch how our platform simplifies learning management for institutions of all sizes.
          </p>
        </div>

        <div className="mx-auto max-w-4xl overflow-hidden rounded-xl bg-gray-100 shadow-lg">
          <div className="relative aspect-video w-full">
            {!videoLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                <div className="flex flex-col items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-500 text-white">
                    <Play className="h-6 w-6" />
                  </div>
                  <p className="text-gray-600">Loading video...</p>
                </div>
              </div>
            )}
            <iframe
              className="h-full w-full"
              src="https://www.youtube.com/embed/kDpu8kYuuRM"
              title="LERNOVA Platform Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={() => setVideoLoaded(true)}
            ></iframe>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-8">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium">Easy to use interface</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
            <span className="text-sm font-medium">Powerful analytics</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-purple-500"></div>
            <span className="text-sm font-medium">Seamless integration</span>
          </div>
        </div>
      </div>
    </section>
  )
}

