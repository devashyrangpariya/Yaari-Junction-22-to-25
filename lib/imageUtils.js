// Specialized image utility functions for the College Memory Gallery

import { CLOUDINARY_PRESETS } from './constants';

// Cloudinary URL builder
export const buildCloudinaryUrl = (publicId, transformations = {}) => {
  const {
    width,
    height,
    crop = 'fill',
    quality = 'auto',
    format = 'auto',
    gravity = 'auto',
    effect,
    overlay,
  } = transformations;
  
  const transforms = [];
  
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (crop) transforms.push(`c_${crop}`);
  if (quality) transforms.push(`q_${quality}`);
  if (format) transforms.push(`f_${format}`);
  if (gravity) transforms.push(`g_${gravity}`);
  if (effect) transforms.push(`e_${effect}`);
  if (overlay) transforms.push(`l_${overlay}`);
  
  const transformString = transforms.join(',');
  const baseUrl = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME 
    ? `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`
    : 'https://via.placeholder.com';
    
  return transformString 
    ? `${baseUrl}/${transformString}/${publicId}`
    : `${baseUrl}/${publicId}`;
};

// Generate responsive image URLs for different screen sizes
export const generateResponsiveUrls = (publicId, preset = 'medium') => {
  const baseTransform = CLOUDINARY_PRESETS[preset] || CLOUDINARY_PRESETS.medium;
  
  return {
    mobile: buildCloudinaryUrl(publicId, { ...baseTransform, width: 400 }),
    tablet: buildCloudinaryUrl(publicId, { ...baseTransform, width: 768 }),
    desktop: buildCloudinaryUrl(publicId, { ...baseTransform, width: 1200 }),
    large: buildCloudinaryUrl(publicId, { ...baseTransform, width: 1600 }),
  };
};

// Create optimized thumbnail
export const createThumbnail = (publicId, size = 300) => {
  return buildCloudinaryUrl(publicId, {
    width: size,
    height: size,
    crop: 'fill',
    gravity: 'face',
    quality: 'auto',
    format: 'auto',
  });
};

// Create hero image with overlay text capability
export const createHeroImage = (publicId, overlayText = null) => {
  const transformations = {
    ...CLOUDINARY_PRESETS.hero,
    quality: 'auto',
    format: 'auto',
  };
  
  if (overlayText) {
    transformations.overlay = `text:Arial_60_bold:${encodeURIComponent(overlayText)}`;
    transformations.gravity = 'center';
    transformations.effect = 'brightness:-20';
  }
  
  return buildCloudinaryUrl(publicId, transformations);
};

// Extract dominant colors from image
export const extractImageColors = async (imageUrl) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx.drawImage(img, 0, 0);
      
      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const colors = extractColorsFromImageData(imageData);
        resolve(colors);
      } catch (error) {
        console.error('Error extracting colors:', error);
        resolve(['#f3f4f6', '#9ca3af', '#374151']); // Default colors
      }
    };
    
    img.onerror = () => {
      resolve(['#f3f4f6', '#9ca3af', '#374151']); // Default colors
    };
    
    img.src = imageUrl;
  });
};

// Helper function to extract colors from image data
const extractColorsFromImageData = (imageData) => {
  const data = imageData.data;
  const colorCounts = {};
  
  // Sample every 10th pixel for performance
  for (let i = 0; i < data.length; i += 40) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Skip very light or very dark pixels
    const brightness = (r + g + b) / 3;
    if (brightness < 50 || brightness > 200) continue;
    
    const color = `rgb(${r},${g},${b})`;
    colorCounts[color] = (colorCounts[color] || 0) + 1;
  }
  
  // Get top 3 colors
  return Object.entries(colorCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([color]) => color);
};

// Create image with friend tags overlay
export const createImageWithTags = (publicId, friendTags = []) => {
  if (!friendTags.length) {
    return buildCloudinaryUrl(publicId, CLOUDINARY_PRESETS.large);
  }
  
  // Create overlay text for friend tags
  const tagText = friendTags.join(' • ');
  
  return buildCloudinaryUrl(publicId, {
    ...CLOUDINARY_PRESETS.large,
    overlay: `text:Arial_24:${encodeURIComponent(tagText)}`,
    gravity: 'south',
    y: 30,
    color: 'white',
    effect: 'shadow:50',
  });
};

// Generate image variations for different use cases
export const generateImageVariations = (publicId) => {
  return {
    thumbnail: createThumbnail(publicId, 200),
    card: buildCloudinaryUrl(publicId, CLOUDINARY_PRESETS.medium),
    modal: buildCloudinaryUrl(publicId, CLOUDINARY_PRESETS.large),
    hero: createHeroImage(publicId),
    download: buildCloudinaryUrl(publicId, { quality: 100, format: 'jpg' }),
  };
};

// Create animated GIF from multiple images
export const createAnimatedGif = (publicIds, options = {}) => {
  const {
    width = 800,
    height = 600,
    delay = 100,
    loop = 0,
  } = options;
  
  if (!publicIds.length) return null;
  
  // For Cloudinary, we'd use their video API to create GIFs
  // This is a simplified version - in production, you'd use Cloudinary's video transformation
  const transformations = [
    `w_${width}`,
    `h_${height}`,
    `c_fill`,
    `dl_${delay}`,
    `f_gif`,
  ];
  
  if (loop !== 0) transformations.push(`loop_${loop}`);
  
  const baseUrl = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME 
    ? `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`
    : null;
    
  if (!baseUrl) return null;
  
  // This would require server-side processing in a real implementation
  return `${baseUrl}/${transformations.join(',')}/${publicIds[0]}.gif`;
};

// Preload images for better performance
export const preloadImages = (urls) => {
  return Promise.all(
    urls.map(url => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = () => reject(new Error(`Failed to load ${url}`));
        img.src = url;
      });
    })
  );
};

// Create image blur placeholder
export const createBlurPlaceholder = (width = 40, height = 40) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#f3f4f6');
  gradient.addColorStop(1, '#e5e7eb');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  return canvas.toDataURL();
};

// Lazy load image with intersection observer
export const lazyLoadImage = (img, src, options = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '50px',
    placeholder = createBlurPlaceholder(),
  } = options;
  
  // Set placeholder initially
  img.src = placeholder;
  img.classList.add('image-placeholder');
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const imageLoader = new Image();
          imageLoader.onload = () => {
            img.src = src;
            img.classList.remove('image-placeholder');
            img.classList.add('animate-fade-in-up');
          };
          imageLoader.onerror = () => {
            img.src = placeholder;
            img.classList.add('error-placeholder');
          };
          imageLoader.src = src;
          
          observer.unobserve(img);
        }
      });
    },
    { threshold, rootMargin }
  );
  
  observer.observe(img);
  
  return observer;
};

// Calculate optimal image dimensions for container
export const calculateOptimalDimensions = (
  originalWidth,
  originalHeight,
  containerWidth,
  containerHeight,
  mode = 'cover'
) => {
  const aspectRatio = originalWidth / originalHeight;
  const containerRatio = containerWidth / containerHeight;
  
  let width, height;
  
  if (mode === 'cover') {
    if (aspectRatio > containerRatio) {
      height = containerHeight;
      width = height * aspectRatio;
    } else {
      width = containerWidth;
      height = width / aspectRatio;
    }
  } else if (mode === 'contain') {
    if (aspectRatio > containerRatio) {
      width = containerWidth;
      height = width / aspectRatio;
    } else {
      height = containerHeight;
      width = height * aspectRatio;
    }
  }
  
  return {
    width: Math.round(width),
    height: Math.round(height),
    aspectRatio,
  };
};

// Get optimized image URL - main function used throughout the app
export const getOptimizedImageUrl = (src, options = {}) => {
  if (!src) return null;
  
  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    preset = 'medium'
  } = options;
  
  // If it's already a full URL, return as is
  if (src.startsWith('http')) {
    return src;
  }
  
  // If it's a Cloudinary public ID, use our builder
  if (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
    const transformations = { quality, format };
    
    if (width) transformations.width = width;
    if (height) transformations.height = height;
    
    // Use preset if no specific dimensions provided
    if (!width && !height && CLOUDINARY_PRESETS[preset]) {
      Object.assign(transformations, CLOUDINARY_PRESETS[preset]);
    }
    
    return buildCloudinaryUrl(src, transformations);
  }
  
  // Fallback for local images
  return src.startsWith('/') ? src : `/${src}`;
};