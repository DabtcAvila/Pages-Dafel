'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image, { ImageProps } from 'next/image';

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad'> {
  fallback?: string;
  webp?: string;
  avif?: string;
  lazy?: boolean;
  critical?: boolean;
  enableBlurDataURL?: boolean;
  quality?: number;
  progressive?: boolean;
}

export default function OptimizedImage({
  src,
  alt,
  fallback,
  webp,
  avif,
  lazy = true,
  critical = false,
  enableBlurDataURL = true,
  quality = 85,
  progressive = true,
  className = '',
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);
  const imgRef = useRef<HTMLImageElement>(null);

  // Determine the best image format to use
  useEffect(() => {
    const checkWebPSupport = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    };

    const checkAVIFSupport = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
    };

    // Prioritize AVIF, then WebP, then original
    if (avif && checkAVIFSupport()) {
      setImageSrc(avif);
    } else if (webp && checkWebPSupport()) {
      setImageSrc(webp);
    } else {
      setImageSrc(src);
    }
  }, [src, webp, avif]);

  const handleLoad = () => {
    setIsLoaded(true);
    // Trigger performance mark for monitoring
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(`image-loaded-${alt}`);
    }
  };

  const handleError = () => {
    setHasError(true);
    // Fallback to original source if modern format fails
    if (imageSrc !== src && !hasError) {
      setImageSrc(fallback || src.toString());
      setHasError(false);
    }
  };

  // Loading skeleton styles
  const skeletonClass = `
    animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 
    bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]
  `;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Loading skeleton */}
      {!isLoaded && (
        <div 
          className={`absolute inset-0 ${skeletonClass}`}
          style={{
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s ease-in-out infinite'
          }}
        />
      )}
      
      <Image
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        priority={critical}
        loading={lazy && !critical ? 'lazy' : 'eager'}
        className={`
          transition-opacity duration-300 
          ${isLoaded ? 'opacity-100' : 'opacity-0'}
          ${hasError ? 'opacity-50' : ''}
        `}
        {...props}
      />
      
      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <span className="text-sm text-gray-500">Image unavailable</span>
        </div>
      )}
      
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}