"use client";

import { useEffect, useState } from "react";
import Header from "@/components/common/header";
import Hero from "@/components/home/hero";
import FAQ from "@/components/home/faq";
import Footer from "@/components/common/footer";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll); 
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <Header isScrolled={isScrolled} />
      <Hero />
      <FAQ />
      <Footer />
    </main>
  );
}