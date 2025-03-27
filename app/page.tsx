import Header from "@/components/common/header"
import Footer from "@/components/common/footer"
import Hero from "@/components/home/hero"
import Demo from "@/components/home/demo"
import Features from "@/components/home/features"
import FAQ from "@/components/home/faq"
import CTA from "@/components/home/cta"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main>
        <Hero />
        <Demo />
        <Features />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}

