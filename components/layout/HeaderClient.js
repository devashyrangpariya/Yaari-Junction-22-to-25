'use client';

import dynamic from 'next/dynamic';
import ErrorBoundary from '../ui/ErrorBoundary';

// Dynamically import the actual client-side header
const ClientHeader = dynamic(() => import('./ClientHeader'), {
  ssr: false,
  loading: () => (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse" />
            <div className="h-6 w-32 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
          </div>
          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
        </div>
      </div>
    </header>
  ),
});

export default function HeaderClient() {
  return (
    <ErrorBoundary
      title="Navigation Error"
      message="There was an issue loading the navigation. Please refresh the page."
    >
      <ClientHeader />
    </ErrorBoundary>
  );
}