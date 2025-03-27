import { Button } from "@/components/ui/button"

export default function CTA() {
  return (
    <section className="bg-gray-50 py-24 px-6 sm:px-8 lg:px-12">
      <div className="container mx-auto text-center">
        <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl">
          Ready to Transform Your Learning Experience?
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
          Join thousands of educational institutions already using LERNOVA to streamline their learning management.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button className="bg-orange-500 px-8 py-6 text-white hover:bg-orange-600">Get Started for Free</Button>
          <Button variant="outline" className="px-8 py-6">
            Request Demo
          </Button>
        </div>
      </div>
    </section>
  )
}

