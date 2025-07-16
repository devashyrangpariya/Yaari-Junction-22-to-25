'use client';

import { useState } from 'react';
import DownloadButton from '../../components/ui/DownloadButton';
import BatchDownload from '../../components/gallery/BatchDownload';
import DownloadProgress from '../../components/ui/DownloadProgress';

// Sample image data for testing
const sampleImages = [
  {
    id: '1',
    url: '/api/test-image?color=%23EF4444&width=800&height=600',
    thumbnail: '/api/test-image?color=%23EF4444&width=200&height=150',
    title: 'College Memory 1',
    year: 2023,
    tags: ['friends', 'campus'],
    friends: ['Fenil', 'Preetraj']
  },
  {
    id: '2',
    url: '/api/test-image?color=%2310B981&width=800&height=600',
    thumbnail: '/api/test-image?color=%2310B981&width=200&height=150',
    title: 'College Memory 2',
    year: 2023,
    tags: ['sports', 'cricket'],
    friends: ['Om', 'Vansh']
  },
  {
    id: '3',
    url: '/api/test-image?color=%23F59E0B&width=800&height=600',
    thumbnail: '/api/test-image?color=%23F59E0B&width=200&height=150',
    title: 'College Memory 3',
    year: 2024,
    tags: ['funny', 'moments'],
    friends: ['Meet', 'Maharshi']
  },
  {
    id: '4',
    url: '/api/test-image?color=%238B5CF6&width=800&height=600',
    thumbnail: '/api/test-image?color=%238B5CF6&width=200&height=150',
    title: 'College Memory 4',
    year: 2024,
    tags: ['graduation', 'ceremony'],
    friends: ['Divy', 'Ansh']
  },
  {
    id: '5',
    url: '/api/test-image?color=%23EC4899&width=800&height=600',
    thumbnail: '/api/test-image?color=%23EC4899&width=200&height=150',
    title: 'College Memory 5',
    year: 2024,
    tags: ['party', 'celebration'],
    friends: ['Kevel', 'Rudra']
  }
];

export default function TestDownloadPage() {
  const [showBatchDownload, setShowBatchDownload] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [progressData, setProgressData] = useState({
    progress: 0,
    status: 'idle',
    fileName: ''
  });

  const handleDownloadStart = () => {
    setShowProgress(true);
    setProgressData({
      progress: 0,
      status: 'downloading',
      fileName: 'college-memories.zip'
    });
  };

  const handleDownloadComplete = () => {
    setProgressData(prev => ({
      ...prev,
      progress: 100,
      status: 'success'
    }));
    
    setTimeout(() => {
      setShowProgress(false);
    }, 3000);
  };

  const handleDownloadError = (error) => {
    setProgressData(prev => ({
      ...prev,
      status: 'error'
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Download Functionality Test
          </h1>

          {/* Single Image Download */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Single Image Download
            </h2>
            <div className="flex items-center gap-4">
              <img 
                src={sampleImages[0].thumbnail}
                alt={sampleImages[0].title}
                className="w-32 h-32 bg-gray-200 rounded-lg object-cover"
              />
              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  {sampleImages[0].title}
                </h3>
                <DownloadButton
                  singleImage={sampleImages[0]}
                  onDownloadStart={handleDownloadStart}
                  onDownloadComplete={handleDownloadComplete}
                  onDownloadError={handleDownloadError}
                />
              </div>
            </div>
          </div>

          {/* Multiple Images Download */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Multiple Images Download
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                {sampleImages.slice(0, 3).map((image) => (
                  <img
                    key={image.id}
                    src={image.thumbnail}
                    alt={image.title}
                    className="w-20 h-20 bg-gray-200 rounded-lg object-cover"
                  />
                ))}
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  Download {sampleImages.length} Images
                </h3>
                <DownloadButton
                  images={sampleImages}
                  onDownloadStart={handleDownloadStart}
                  onDownloadComplete={handleDownloadComplete}
                  onDownloadError={handleDownloadError}
                />
              </div>
            </div>
          </div>

          {/* Batch Download Modal */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Batch Download Modal
            </h2>
            <button
              onClick={() => setShowBatchDownload(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Open Batch Download
            </button>
          </div>

          {/* Download Button Variants */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Button Variants
            </h2>
            <div className="flex flex-wrap gap-4">
              <DownloadButton
                singleImage={sampleImages[0]}
                variant="primary"
                className="mb-2"
              />
              <DownloadButton
                singleImage={sampleImages[0]}
                variant="secondary"
                className="mb-2"
              />
              <DownloadButton
                singleImage={sampleImages[0]}
                variant="minimal"
                className="mb-2"
              />
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">
              Test Instructions
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Click any download button to test the functionality</li>
              <li>• Single images will download directly</li>
              <li>• Multiple images will be packaged as a ZIP file</li>
              <li>• Progress indicators will show download status</li>
              <li>• The batch download modal allows selecting specific images</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Batch Download Modal */}
      <BatchDownload
        images={sampleImages}
        isVisible={showBatchDownload}
        onClose={() => setShowBatchDownload(false)}
      />

      {/* Download Progress */}
      <DownloadProgress
        isVisible={showProgress}
        progress={progressData.progress}
        status={progressData.status}
        fileName={progressData.fileName}
        onClose={() => setShowProgress(false)}
      />
    </div>
  );
}