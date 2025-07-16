import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import PageTransition from "../components/animations/PageTransition";
import { APP_METADATA } from "../lib/constants";
import SkipLinks from "@/components/ui/SkipLinks";
import PerformanceMonitor from "@/components/ui/PerformanceMonitor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: APP_METADATA.title,
  description: APP_METADATA.description,
  author: APP_METADATA.author,
  metadataBase: new URL('https://college-memories.example.com'),
  openGraph: {
    title: APP_METADATA.title,
    description: APP_METADATA.description,
    images: ['/images/og-image.jpg'],
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: APP_METADATA.title,
    description: APP_METADATA.description,
    images: ['/images/og-image.jpg']
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {/* Accessibility skip links */}
        <SkipLinks />
        
        <div className="min-h-screen flex flex-col">
          <Header />
          <main id="main-content" className="flex-1 pt-16 lg:pt-20">
            <PageTransition>
              {children}
            </PageTransition>
          </main>
          <Footer />
        </div>
        
        {/* Performance monitoring (only in development) */}
        <PerformanceMonitor position="bottom-right" />
      </body>
    </html>
  );
}
