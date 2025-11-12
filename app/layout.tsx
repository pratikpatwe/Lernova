import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://lernova.vercel.app"),
  title: "Lernova - Organized Learning & Effortless Management",
  description:
    "Transform your learning experience with Lernova: A smart platform for structured learning, assignment management, and seamless course material distribution.",
  openGraph: {
    title: "Lernova - Smart Learning Platform",
    description:
      "Transform your learning experience with our AI-powered assignment management and course material distribution platform.",
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
    description:
      "Transform your learning experience with our AI-powered assignment management and course material distribution platform.",
    images: [
      "https://raw.githubusercontent.com/pratikpatwe/Lernova/main/public/screenshot.png",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Momo+Signature&family=Open+Sans:wght@400;500;700&display=swap"
            rel="stylesheet"
          />
          <style>{`
          .font-momo {
            font-family: 'Momo Signature', sans-serif;
          }
          body {
            font-family: 'Open Sans', sans-serif;
          }
        `}</style>
        </head>
        <body className="antialiased">{children}</body>
      </html>
    </ClerkProvider>
  );
}