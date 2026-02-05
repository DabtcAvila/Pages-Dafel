'use client';

import React, { memo, useState, useEffect } from 'react';
import { useOptimizedImage } from '@/hooks/useWebPSupport';

interface OptimizedCarouselSlideProps {
  image: string;
  isActive: boolean;
  index: number;
  children: React.ReactNode;
  priority?: boolean; // For above-the-fold images
}

const OptimizedCarouselSlide = memo(({ image, isActive, index, children, priority = false }: OptimizedCarouselSlideProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const optimizedImage = useOptimizedImage(image);

  useEffect(() => {
    // Load image immediately when component mounts if it's active or priority
    // Use a slight delay to avoid preload warnings
    const loadImage = () => {
      const img = new Image();
      img.onload = () => setImageLoaded(true);
      img.onerror = () => setImageLoaded(false);
      img.src = optimizedImage + '?v=001';
    };

    if (isActive || priority) {
      // Add small delay to avoid immediate loading warnings
      const timer = setTimeout(loadImage, priority ? 0 : 100);
      return () => clearTimeout(timer);
    }
  }, [optimizedImage, isActive, priority]);

  const slideStyle: React.CSSProperties = {
    top: 0,
    height: '100vh',
    backgroundSize: 'cover',
    backgroundPosition: index === 0 ? 'center' : 'center top',
    backgroundRepeat: 'no-repeat',
    // Only show background when image is loaded
    backgroundImage: imageLoaded ? `url(${optimizedImage}?v=001)` : 'none',
    // Add a subtle loading state
    backgroundColor: imageLoaded ? 'transparent' : '#f8fafc',
  };

  return (
    <div
      key={index}
      className={`absolute w-full h-full transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-0'}`}
      style={slideStyle}
    >
      {/* Minimal loading indicator */}
      {!imageLoaded && (isActive || priority) && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse opacity-50" />
        </div>
      )}
      {children}
    </div>
  );
});

OptimizedCarouselSlide.displayName = 'OptimizedCarouselSlide';

export default OptimizedCarouselSlide;