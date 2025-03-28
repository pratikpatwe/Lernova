import Header from "@/components/common/header"
import Footer from "@/components/common/footer"
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lernova.vercel.app"),
  title: "Lernova - Organized Learning & Effortless Management",
  description: "Transform your learning experience with Lernova: A smart platform for structured learning, assignment management, and seamless course material distribution.",
  openGraph: {
    title: "Lernova - Smart Learning Platform",
    description: "Transform your learning experience with our AI-powered assignment management and course material distribution platform.",
    url: "/",
    siteName: "Lernova",
    images: [
      {
        url: "https://raw.githubusercontent.com/pratikpatwe/Lernova/main/public/screenshot.png",
        width: 1200,
        height: 630,
        alt: "Lernova - Smart Learning Platform Screenshot",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lernova - Smart Learning Platform",
    description: "Transform your learning experience with our AI-powered assignment management and course material distribution platform.",
    images: ["https://raw.githubusercontent.com/pratikpatwe/Lernova/main/public/screenshot.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <Header />
          {children}
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}