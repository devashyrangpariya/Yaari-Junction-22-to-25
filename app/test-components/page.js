'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import OptimizedImage from '@/components/ui/OptimizedImage';
import AccessibleModal from '@/components/ui/AccessibleModal';
import PerformanceMonitor from '@/components/ui/PerformanceMonitor';
import { checkCompatibility } from '@/lib/browserCompatibility';
import { announceToScreenReader } from '@/lib/accessibility';
import useKeyboardNavigation from '@/lib/hooks/useKeyboardNavigation';

/**
 * Test page for components and accessibility features
 * This page demonstrates and tests all the components we've built
 */
export default function TestComponentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [compatibilityReport, setCompatibilityReport] = useState(null);
  const [selectedImage, setSelectedImage] = useState(1);
  
  // Check browser compatibility on mount
  useEffect(() => {
    async function runCompatibilityCheck() {
      const report = await checkCompatibility();
      setCompatibilityReport(report);
    }
    
    runCompatibilityCheck();
  }, []);
  
  // Handle keyboard navigation for image gallery
  useKeyboardNavigation({
    onArrowLeft: () => {
      setSelectedImage((prev) => (prev > 1 ? prev - 1 : 3));
      announceToScreenReader(`Image ${selectedImage > 1 ? selectedImage - 1 : 3} selected`);
    },
    onArrowRight: () => {
      setSelectedImage((prev) => (prev < 3 ? prev + 1 : 1));
      announceToScreenReader(`Image ${selectedImage < 3 ? selectedImage + 1 : 1} selected`);
    }
  });
  
  // Sample images for testing
  const images = [
    {
      id: 1,
      src: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
      alt: 'Sample image 1',
      width: 400,
      height: 300
    },
    {
      id: 2,
      src: 'https://res.cloudinary.com/demo/image/upload/v1582104019/docs/models.jpg',
      alt: 'Sample image 2',
      width: 400,
      height: 300
    },
    {
      id: 3,
      src: 'https://res.cloudinary.com/demo/image/upload/v1582104019/docs/shoes.jpg',
      alt: 'Sample image 3',
      width: 400,
      height: 300
    }
  ];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 id="page-title" className="text-3xl font-bold mb-8">Component Testing Page</h1>
      
      <section aria-labelledby="section-accessibility" className="mb-12">
        <h2 id="section-accessibility" className="text-2xl font-semibold mb-4">Accessibility Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-medium mb-3">Keyboard Navigation</h3>
            <p className="mb-4">Use arrow keys to navigate between images below:</p>
            
            <div className="relative h-[300px] w-full border border-gray-200 rounded-lg overflow-hidden">
              {images.map((image) => (
                <motion.div
                  key={image.id}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: selectedImage === image.id ? 1 : 0,
                    zIndex: selectedImage === image.id ? 10 : 1
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <OptimizedImage
                    src={image.src}
                    alt={image.alt}
                    width={800}
                    height={600}
                    className="w-full h-full"
                    ariaLabel={`Image ${image.id} of ${images.length}: ${image.alt}`}
                  />
                </motion.div>
              ))}
              
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                {images.map((image) => (
                  <button
                    key={image.id}
                    className={`w-3 h-3 rounded-full ${
                      selectedImage === image.id ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                    onClick={() => setSelectedImage(image.id)}
                    aria-label={`Select image ${image.id}`}
                    aria-current={selectedImage === image.id}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-medium mb-3">Focus Management</h3>
            <p className="mb-4">Test modal with focus trapping:</p>
            
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={() => setIsModalOpen(true)}
            >
              Open Accessible Modal
            </button>
            
            <AccessibleModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title="Accessibility Test Modal"
              initialFocusId="modal-confirm-button"
            >
              <div className="space-y-4">
                <p>This modal traps focus and supports keyboard navigation.</p>
                <p>Try tabbing through the elements and pressing Escape to close.</p>
                
                <div className="flex space-x-3 mt-6">
                  <button
                    id="modal-confirm-button"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Confirm
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </AccessibleModal>
          </div>
        </div>
      </section>
      
      <section aria-labelledby="section-performance" className="mb-12">
        <h2 id="section-performance" className="text-2xl font-semibold mb-4">Performance Optimization</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-medium mb-3">Optimized Image Loading</h3>
            <p className="mb-4">Images use progressive loading with blur placeholders:</p>
            
            <div className="grid grid-cols-2 gap-4">
              <OptimizedImage
                src="https://res.cloudinary.com/demo/image/upload/v1582104019/docs/models.jpg"
                alt="Progressive loading example 1"
                width={400}
                height={300}
                className="rounded-lg"
              />
              
              <OptimizedImage
                src="https://res.cloudinary.com/demo/image/upload/v1582104019/docs/shoes.jpg"
                alt="Progressive loading example 2"
                width={400}
                height={300}
                className="rounded-lg"
              />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-medium mb-3">Performance Monitoring</h3>
            <p className="mb-4">Current performance metrics:</p>
            
            <PerformanceMonitor
              enabled={true}
              position="static"
              componentName="TestPage"
              showDetails={true}
            />
          </div>
        </div>
      </section>
      
      <section aria-labelledby="section-browser" className="mb-12">
        <h2 id="section-browser" className="text-2xl font-semibold mb-4">Browser Compatibility</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-medium mb-3">Compatibility Report</h3>
          
          {compatibilityReport ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Browser:</span>
                <span>{compatibilityReport.browser?.browser} {compatibilityReport.browser?.version}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-medium">Compatibility Score:</span>
                <div className="flex items-center">
                  <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 rounded-full" 
                      style={{ width: `${compatibilityReport.score}%` }}
                    ></div>
                  </div>
                  <span className="ml-2">{compatibilityReport.score}%</span>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Feature Support:</h4>
                <ul className="grid grid-cols-2 gap-2">
                  {Object.entries(compatibilityReport.features).map(([feature, supported]) => (
                    <li key={feature} className="flex items-center">
                      <span className={`w-5 h-5 rounded-full mr-2 ${supported ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-32">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}