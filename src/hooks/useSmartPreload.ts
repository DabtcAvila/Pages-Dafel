'use client';

import { useEffect, useRef } from 'react';

interface SmartPreloadOptions {
  preloadDelay?: number; // Delay before preloading (ms)
  priorityImages?: string[]; // Images to preload immediately
}

export function useSmartPreload(
  images: string[], 
  options: SmartPreloadOptions = {}
) {
  const preloadedRef = useRef(new Set<string>());
  const { preloadDelay = 100, priorityImages = [] } = options;

  useEffect(() => {
    // NO usar link preload - usar Image() constructor para evitar warnings
    // Inmediatamente cargar imágenes priority usando Image constructor
    priorityImages.forEach(image => {
      if (!preloadedRef.current.has(image)) {
        const img = new Image();
        img.src = image;
        preloadedRef.current.add(image);
      }
    });

    // Cargar otras imágenes con delay usando Image constructor
    const timer = setTimeout(() => {
      images.forEach(image => {
        if (!preloadedRef.current.has(image) && !priorityImages.includes(image)) {
          const img = new Image();
          img.src = image;
          preloadedRef.current.add(image);
        }
      });
    }, preloadDelay);

    return () => clearTimeout(timer);
  }, [images, priorityImages, preloadDelay]);
}

export function useIntersectionPreload(
  target: React.RefObject<HTMLElement>,
  imagesToPreload: string[]
) {
  const preloadedRef = useRef(false);

  useEffect(() => {
    const element = target.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !preloadedRef.current) {
            preloadedRef.current = true;
            imagesToPreload.forEach(image => {
              const img = new Image();
              img.src = image;
            });
          }
        });
      },
      { 
        rootMargin: '50px',
        threshold: 0.1 
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [target, imagesToPreload]);
}