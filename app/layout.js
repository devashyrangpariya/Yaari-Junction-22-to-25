import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import PageTransition from "../components/animations/PageTransition";
import { APP_METADATA } from "../lib/constants";
import SkipLinks from "@/components/ui/SkipLinks";
import PerformanceMonitor from "@/components/ui/PerformanceMonitor";

// Use Inter font which is well-supported in Next.js
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
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
        className={`${inter.variable} font-sans antialiased bg-background text-foreground`}
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
