// Image optimization utilities for WebP support and fallbacks

/**
 * Check if the browser supports WebP format
 */
export function supportsWebP(): Promise<boolean> {
  if (typeof window === 'undefined') {
    return Promise.resolve(false);
  }

  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
}

/**
 * Get the optimal image URL based on browser support
 */
export function getOptimizedImageUrl(originalPath: string): string {
  if (typeof window === 'undefined') {
    return originalPath;
  }

  // Check if we have a WebP version available
  const webpPath = originalPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  
  // For now, we'll check WebP support on the client
  // In a real implementation, you might want to cache this check
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  
  try {
    // Check if WebP is supported
    const webpSupported = canvas.toDataURL('image/webp').indexOf('image/webp') === 5;
    return webpSupported ? webpPath : originalPath;
  } catch {
    return originalPath;
  }
}

/**
 * Create a picture element with WebP and fallback sources
 */
export function createPictureElement(src: string, alt: string, className?: string): string {
  const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  
  return `
    <picture>
      <source srcset="${webpSrc}" type="image/webp">
      <img src="${src}" alt="${alt}" ${className ? `class="${className}"` : ''} loading="lazy">
    </picture>
  `;
}

/**
 * Get CSS background image with WebP support
 */
export function getOptimizedBackgroundImage(imagePath: string): string {
  const webpPath = imagePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  
  // Return CSS with WebP support detection
  return `
    background-image: url('${imagePath}');
    background-image: 
      -webkit-image-set(
        url('${webpPath}') 1x,
        url('${imagePath}') 1x
      );
    background-image: 
      image-set(
        url('${webpPath}') type('image/webp') 1x,
        url('${imagePath}') type('image/jpeg') 1x
      );
  `;
}

/**
 * Responsive image sizes for different breakpoints
 */
export const RESPONSIVE_SIZES = {
  mobile: '(max-width: 768px)',
  tablet: '(max-width: 1024px)',
  desktop: '(min-width: 1025px)'
} as const;