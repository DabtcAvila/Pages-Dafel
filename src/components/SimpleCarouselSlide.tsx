'use client';

import React, { memo, useState, useEffect, useRef } from 'react';
import { useOptimizedImage } from '@/hooks/useWebPSupport';

interface SimpleCarouselSlideProps {
  image: string;
  isActive: boolean;
  index: number;
  children: React.ReactNode;
  priority?: boolean;
}

const SimpleCarouselSlide = memo(({ image, isActive, index, children, priority = false }: SimpleCarouselSlideProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const optimizedImage = useOptimizedImage(image);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Intelligent image loading strategy
  useEffect(() => {
    const loadImage = () => {
      // Only load first 3 slides initially
      if (index > 2) return;
      
      const img = new Image();
      
      img.onload = () => {
        setImageLoaded(true);
        setImageError(false);
      };
      
      img.onerror = () => {
        setImageError(true);
        // Fallback to original JPG if optimized format fails
        const fallbackImg = new Image();
        fallbackImg.onload = () => setImageLoaded(true);
        fallbackImg.src = image;
      };
      
      img.src = optimizedImage;
      imageRef.current = img;
    };

    // Preload critical image immediately
    if (priority && index === 0) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = optimizedImage;
      link.fetchPriority = 'high';
      document.head.appendChild(link);
      
      loadImage();
      
      return () => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      };
    } else if (index <= 2) {
      // Load first 3 slides with slight delay for non-critical ones
      const timer = setTimeout(loadImage, index * 100);
      return () => clearTimeout(timer);
    }
  }, [optimizedImage, priority, index, image]);

  // Load remaining slides when they become visible or soon to be visible
  useEffect(() => {
    if (index > 2 && isActive) {
      const img = new Image();
      img.onload = () => setImageLoaded(true);
      img.onerror = () => setImageError(true);
      img.src = optimizedImage;
      imageRef.current = img;
    }
  }, [isActive, index, optimizedImage]);

  const slideStyle: React.CSSProperties = {
    top: 0,
    height: '100vh',
    backgroundSize: 'cover',
    backgroundPosition: index === 0 ? 'center' : 'center top',
    backgroundRepeat: 'no-repeat',
    backgroundColor: imageLoaded ? 'transparent' : '#e2e8f0', // Loading color
    backgroundImage: imageLoaded ? `url(${imageError ? image : optimizedImage})` : 'none',
    willChange: index <= 2 ? 'opacity, background-image' : 'auto',
    transition: imageLoaded ? 'opacity 1000ms ease-in-out' : 'opacity 1000ms ease-in-out, background-image 500ms ease-in-out',
  };

  return (
    <div
      key={index}
      className={`absolute w-full h-full transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-0'}`}
      style={slideStyle}
    >
      {/* Loading placeholder for non-loaded images */}
      {!imageLoaded && index <= 2 && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 animate-pulse" />
      )}
      {children}
    </div>
  );
});

SimpleCarouselSlide.displayName = 'SimpleCarouselSlide';

export default SimpleCarouselSlide;