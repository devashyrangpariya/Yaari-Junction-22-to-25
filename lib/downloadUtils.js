/**
 * Download utilities for handling image downloads
 */

// Create a download link and trigger download
export const triggerDownload = (blob, filename) => {
  try {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Clean up the URL object
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 100);
    
    return true;
  } catch (error) {
    console.error('Download failed:', error);
    return false;
  }
};

// Download a single image
export const downloadSingleImage = async (imageUrl, filename = 'image.jpg') => {
  try {
    const response = await fetch(imageUrl, {
      mode: 'cors',
      headers: {
        'Accept': 'image/*'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const blob = await response.blob();
    return triggerDownload(blob, filename);
  } catch (error) {
    console.error('Failed to download image:', error);
    throw error;
  }
};

// Download multiple images as ZIP
export const downloadImagesAsZip = async (images, onProgress = () => {}) => {
  try {
    // Dynamic import to reduce bundle size
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    
    const totalImages = images.length;
    let processedImages = 0;
    
    // Download and add each image to the zip
    for (const image of images) {
      try {
        const response = await fetch(image.url, {
          mode: 'cors',
          headers: {
            'Accept': 'image/*'
          }
        });
        
        if (response.ok) {
          const blob = await response.blob();
          const filename = `${image.title || `image-${processedImages + 1}`}.jpg`;
          zip.file(filename, blob);
        }
        
        processedImages++;
        onProgress((processedImages / totalImages) * 80); // 80% for downloading
      } catch (error) {
        console.warn(`Failed to download image: ${image.title}`, error);
        processedImages++;
        onProgress((processedImages / totalImages) * 80);
      }
    }
    
    onProgress(90); // 90% for zipping
    
    // Generate the ZIP file
    const zipBlob = await zip.generateAsync({ 
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 6
      }
    });
    
    onProgress(100);
    
    // Trigger download
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `college-memories-${timestamp}.zip`;
    
    return triggerDownload(zipBlob, filename);
  } catch (error) {
    console.error('Failed to create ZIP:', error);
    throw error;
  }
};

// Get file extension from URL or default
export const getFileExtension = (url, defaultExt = 'jpg') => {
  try {
    const pathname = new URL(url).pathname;
    const extension = pathname.split('.').pop().toLowerCase();
    
    // Check if it's a valid image extension
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];
    return validExtensions.includes(extension) ? extension : defaultExt;
  } catch {
    return defaultExt;
  }
};

// Generate filename from image data
export const generateFilename = (image, index = 0) => {
  const title = image.title || `image-${index + 1}`;
  const extension = getFileExtension(image.url);
  
  // Clean the title to be filesystem-safe
  const cleanTitle = title
    .replace(/[^a-zA-Z0-9\-_\s]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase();
  
  return `${cleanTitle}.${extension}`;
};

// Check if browser supports downloads
export const supportsDownload = () => {
  return typeof window !== 'undefined' && 
         'URL' in window && 
         'createObjectURL' in window.URL &&
         'revokeObjectURL' in window.URL;
};

// Format file size for display
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};