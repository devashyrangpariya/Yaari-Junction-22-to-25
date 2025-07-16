import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Upload image to Cloudinary with automatic optimization
export const uploadImage = async (file, options = {}) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: 'college-memories',
      // Multiple transformations for different use cases
      eager: [
        // Thumbnail version
        { 
          width: 300, 
          height: 200, 
          crop: 'fill', 
          quality: 'auto:good', 
          format: 'auto',
          gravity: 'auto'
        },
        // Medium version for gallery
        { 
          width: 800, 
          height: 600, 
          crop: 'limit', 
          quality: 'auto:good', 
          format: 'auto' 
        },
        // Large version for modal view
        { 
          width: 1200, 
          height: 900, 
          crop: 'limit', 
          quality: 'auto:best', 
          format: 'auto' 
        }
      ],
      // Main transformation for original
      transformation: [
        { width: 1920, height: 1080, crop: 'limit', quality: 'auto:best' },
        { format: 'auto' },
        { fetch_format: 'auto' }
      ],
      // Additional optimization options
      flags: ['progressive', 'immutable_cache'],
      ...options,
    });
    return result;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

// Get responsive image URLs for different screen sizes
export const getResponsiveImageUrls = (publicId, options = {}) => {
  const baseTransformation = {
    quality: 'auto:good',
    format: 'auto',
    fetch_format: 'auto',
    ...options.transformation
  };

  return {
    thumbnail: cloudinary.url(publicId, {
      transformation: [
        { ...baseTransformation, width: 300, height: 200, crop: 'fill' }
      ]
    }),
    small: cloudinary.url(publicId, {
      transformation: [
        { ...baseTransformation, width: 480, crop: 'scale' }
      ]
    }),
    medium: cloudinary.url(publicId, {
      transformation: [
        { ...baseTransformation, width: 800, crop: 'scale' }
      ]
    }),
    large: cloudinary.url(publicId, {
      transformation: [
        { ...baseTransformation, width: 1200, crop: 'scale' }
      ]
    }),
    xlarge: cloudinary.url(publicId, {
      transformation: [
        { ...baseTransformation, width: 1920, crop: 'scale' }
      ]
    })
  };
};

// Generate optimized image URL
export const getOptimizedImageUrl = (publicId, options = {}) => {
  return cloudinary.url(publicId, {
    transformation: [
      { quality: 'auto', format: 'auto' },
      { width: 'auto', crop: 'scale', dpr: 'auto' },
      ...options.transformations || []
    ],
    ...options,
  });
};

// Generate thumbnail URL
export const getThumbnailUrl = (publicId, width = 300, height = 200) => {
  return cloudinary.url(publicId, {
    transformation: [
      { width, height, crop: 'fill', quality: 'auto', format: 'auto' },
      { effect: 'sharpen' }
    ],
  });
};

// Delete image from Cloudinary
export const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
};

export default cloudinary;