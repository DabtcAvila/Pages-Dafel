'use client';

import { useState, useEffect } from 'react';

interface ImageFormats {
  avif: boolean;
  webp: boolean;
}

/**
 * Hook to detect modern image format support
 */
export function useImageFormatSupport() {
  const [formats, setFormats] = useState<ImageFormats>({ avif: false, webp: false });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const checkFormats = async () => {
      try {
        // Check WebP support
        const webpTest = new Promise<boolean>((resolve) => {
          const img = new Image();
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
          img.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });

        // Check AVIF support  
        const avifTest = new Promise<boolean>((resolve) => {
          const img = new Image();
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
          img.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABcAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=';
        });

        const [webpSupported, avifSupported] = await Promise.all([webpTest, avifTest]);
        
        setFormats({
          avif: avifSupported,
          webp: webpSupported
        });
        setIsLoaded(true);
      } catch {
        setFormats({ avif: false, webp: false });
        setIsLoaded(true);
      }
    };

    checkFormats();
  }, []);

  return { formats, isLoaded };
}

/**
 * Hook to get the best optimized image path
 */
export function useOptimizedImage(originalPath: string) {
  const { formats, isLoaded } = useImageFormatSupport();
  
  if (!isLoaded) {
    // Return WebP by default while checking - most modern browsers support it
    return originalPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  }
  
  // Priority: AVIF > WebP > Original
  if (formats.avif) {
    return originalPath.replace(/\.(jpg|jpeg|png)$/i, '.avif');
  }
  
  if (formats.webp) {
    return originalPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  }
  
  // Fallback to original
  return originalPath;
}

/**
 * Legacy hook for backward compatibility
 */
export function useWebPSupport() {
  const { formats, isLoaded } = useImageFormatSupport();
  return isLoaded ? formats.webp : null;
}