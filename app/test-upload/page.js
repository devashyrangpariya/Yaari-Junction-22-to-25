'use client';

import { useState } from 'react';
import ImageUpload from '@/components/gallery/ImageUpload';

export default function TestUploadPage() {
  const [uploadResults, setUploadResults] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadStart = (fileCount) => {
    setIsUploading(true);
    console.log(`Starting upload of ${fileCount} files...`);
  };

  const handleUploadComplete = (results) => {
    setIsUploading(false);
    setUploadResults(results);
    console.log('Upload completed:', results);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Image Upload Test
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Test the image upload functionality with drag-and-drop and batch processing
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <ImageUpload
            onUploadStart={handleUploadStart}
            onUploadComplete={handleUploadComplete}
            maxFiles={15}
          />
        </div>

        {/* Upload Status */}
        {isUploading && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
              <p className="text-blue-800 dark:text-blue-200 font-medium">
                Uploading images to Cloudinary...
              </p>
            </div>
          </div>
        )}

        {/* Upload Results */}
        {uploadResults && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Upload Results
            </h2>
            
            {/* Statistics */}
            {uploadResults.statistics && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <p className="text-sm text-green-600 dark:text-green-400">Successful</p>
                  <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                    {uploadResults.statistics.successCount}
                  </p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">Failed</p>
                  <p className="text-2xl font-bold text-red-800 dark:text-red-200">
                    {uploadResults.statistics.failureCount}
                  </p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <p className="text-sm text-blue-600 dark:text-blue-400">Total Size</p>
                  <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                    {uploadResults.statistics.totalSizeMB} MB
                  </p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                  <p className="text-sm text-purple-600 dark:text-purple-400">Avg Time</p>
                  <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                    {uploadResults.statistics.avgProcessingTimeMs} ms
                  </p>
                </div>
              </div>
            )}

            {/* Successful Uploads */}
            {uploadResults.uploaded && uploadResults.uploaded.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
                  Successfully Uploaded Images
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {uploadResults.uploaded.map((image, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                      <img
                        src={image.thumbnailUrl}
                        alt={image.originalFilename}
                        className="w-full h-32 object-cover rounded-lg mb-2"
                      />
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {image.originalFilename}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {image.width} × {image.height} • {(image.bytes / 1024).toFixed(1)} KB
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        <a
                          href={image.thumbnailUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                          Thumbnail
                        </a>
                        <a
                          href={image.mediumUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                          Medium
                        </a>
                        <a
                          href={image.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                          Original
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Failed Uploads */}
            {uploadResults.failed && uploadResults.failed.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-3">
                  Failed Uploads
                </h3>
                <div className="space-y-2">
                  {uploadResults.failed.map((failure, index) => (
                    <div key={index} className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                      <p className="text-sm font-medium text-red-800 dark:text-red-200">
                        {failure.originalFilename}
                      </p>
                      <p className="text-xs text-red-600 dark:text-red-400">
                        {failure.error}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Raw JSON for debugging */}
            <details className="mt-6">
              <summary className="cursor-pointer text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                View Raw Response (Debug)
              </summary>
              <pre className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs overflow-auto">
                {JSON.stringify(uploadResults, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}