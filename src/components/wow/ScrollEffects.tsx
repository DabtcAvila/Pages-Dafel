'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

interface ScrollEffectConfig {
  trigger?: number; // Percentage of element in view to trigger
  duration?: number; // Animation duration in ms
  easing?: string; // CSS easing function
  delay?: number; // Delay before animation starts
}

interface ScrollEffectsProps {
  children: React.ReactNode;
  className?: string;
  effect?: 'fadeUp' | 'fadeDown' | 'fadeLeft' | 'fadeRight' | 'scale' | 'rotate' | 'parallax' | 'stagger';
  config?: ScrollEffectConfig;
  disabled?: boolean;
  parallaxSpeed?: number; // For parallax effect
  staggerDelay?: number; // For stagger effect
}

interface ParallaxLayer {
  element: HTMLElement;
  speed: number;
  initialY: number;
}

export const ScrollEffects: React.FC<ScrollEffectsProps> = ({
  children,
  className = '',
  effect = 'fadeUp',
  config = {},
  disabled = false,
  parallaxSpeed = 0.5,
  staggerDelay = 100
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [elementTop, setElementTop] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const defaultConfig: ScrollEffectConfig = {
    trigger: 0.2,
    duration: 600,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    delay: 0,
    ...config
  };

  // Parallax effect handler
  const handleParallax = useCallback(() => {
    if (!elementRef.current || effect !== 'parallax') return;

    const element = elementRef.current;
    const rect = element.getBoundingClientRect();
    const elementCenter = rect.top + rect.height / 2;
    const windowCenter = window.innerHeight / 2;
    const distanceFromCenter = elementCenter - windowCenter;
    
    const parallaxOffset = distanceFromCenter * parallaxSpeed;
    element.style.transform = `translate3d(0, ${parallaxOffset}px, 0)`;
  }, [effect, parallaxSpeed]);

  // Scroll handler for parallax and other scroll-based effects
  useEffect(() => {
    if (disabled || effect !== 'parallax') return;

    const handleScroll = () => {
      setScrollY(window.scrollY);
      handleParallax();
    };

    const handleResize = () => {
      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect();
        setElementTop(rect.top + window.scrollY);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial setup

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [disabled, effect, handleParallax]);

  // Intersection Observer for trigger-based animations
  useEffect(() => {
    if (disabled || effect === 'parallax') return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting && entry.intersectionRatio >= defaultConfig.trigger!;
        setIsInView(isVisible);
        
        if (isVisible && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      {
        threshold: [0, defaultConfig.trigger!, 1],
        rootMargin: '50px'
      }
    );

    if (elementRef.current) {
      observerRef.current.observe(elementRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [disabled, effect, defaultConfig.trigger, hasAnimated]);

  // Stagger effect for child elements
  useEffect(() => {
    if (disabled || effect !== 'stagger' || !isInView || !elementRef.current) return;

    const children = elementRef.current.querySelectorAll(':scope > *');
    children.forEach((child, index) => {
      const htmlChild = child as HTMLElement;
      htmlChild.style.animationDelay = `${defaultConfig.delay! + index * staggerDelay}ms`;
      htmlChild.classList.add('animate-in', 'fade-in-up');
    });
  }, [isInView, effect, staggerDelay, defaultConfig.delay, disabled]);

  // Get animation classes based on effect
  const getAnimationClasses = () => {
    if (disabled) return '';

    const baseClasses = 'scroll-effect-element';
    const isVisible = effect === 'parallax' ? true : isInView;
    
    if (!isVisible && effect !== 'parallax') {
      return `${baseClasses} scroll-effect-hidden`;
    }

    switch (effect) {
      case 'fadeUp':
        return `${baseClasses} ${isInView ? 'animate-fade-up' : 'scroll-effect-hidden'}`;
      case 'fadeDown':
        return `${baseClasses} ${isInView ? 'animate-fade-down' : 'scroll-effect-hidden'}`;
      case 'fadeLeft':
        return `${baseClasses} ${isInView ? 'animate-fade-left' : 'scroll-effect-hidden'}`;
      case 'fadeRight':
        return `${baseClasses} ${isInView ? 'animate-fade-right' : 'scroll-effect-hidden'}`;
      case 'scale':
        return `${baseClasses} ${isInView ? 'animate-scale-up' : 'scroll-effect-hidden'}`;
      case 'rotate':
        return `${baseClasses} ${isInView ? 'animate-rotate-in' : 'scroll-effect-hidden'}`;
      case 'parallax':
        return `${baseClasses} scroll-effect-parallax`;
      case 'stagger':
        return `${baseClasses} scroll-effect-stagger`;
      default:
        return baseClasses;
    }
  };

  // Generate CSS custom properties for animation
  const getCustomProperties = () => {
    return {
      '--animation-duration': `${defaultConfig.duration}ms`,
      '--animation-easing': defaultConfig.easing,
      '--animation-delay': `${defaultConfig.delay}ms`,
      '--parallax-speed': parallaxSpeed,
    } as React.CSSProperties;
  };

  if (disabled) {
    return (
      <div ref={elementRef} className={className}>
        {children}
      </div>
    );
  }

  return (
    <>
      <div
        ref={elementRef}
        className={`${getAnimationClasses()} ${className}`}
        style={getCustomProperties()}
      >
        {children}
      </div>

      <style jsx>{`
        .scroll-effect-element {
          transition: all var(--animation-duration) var(--animation-easing);
          transition-delay: var(--animation-delay);
        }

        .scroll-effect-hidden {
          opacity: 0;
          transform: translateY(30px);
        }

        .scroll-effect-parallax {
          will-change: transform;
        }

        .scroll-effect-stagger > * {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        /* Fade animations */
        .animate-fade-up {
          animation: fadeUp var(--animation-duration) var(--animation-easing) var(--animation-delay) forwards;
        }

        .animate-fade-down {
          animation: fadeDown var(--animation-duration) var(--animation-easing) var(--animation-delay) forwards;
        }

        .animate-fade-left {
          animation: fadeLeft var(--animation-duration) var(--animation-easing) var(--animation-delay) forwards;
        }

        .animate-fade-right {
          animation: fadeRight var(--animation-duration) var(--animation-easing) var(--animation-delay) forwards;
        }

        .animate-scale-up {
          animation: scaleUp var(--animation-duration) var(--animation-easing) var(--animation-delay) forwards;
        }

        .animate-rotate-in {
          animation: rotateIn var(--animation-duration) var(--animation-easing) var(--animation-delay) forwards;
        }

        .fade-in-up {
          animation: fadeInUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        /* Keyframes */
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleUp {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes rotateIn {
          from {
            opacity: 0;
            transform: rotate(-10deg) scale(0.9);
          }
          to {
            opacity: 1;
            transform: rotate(0deg) scale(1);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Performance optimizations */
        .scroll-effect-element {
          will-change: transform, opacity;
          backface-visibility: hidden;
          transform: translateZ(0);
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .scroll-effect-element,
          .scroll-effect-element *,
          .animate-fade-up,
          .animate-fade-down,
          .animate-fade-left,
          .animate-fade-right,
          .animate-scale-up,
          .animate-rotate-in,
          .fade-in-up {
            animation: none !important;
            transition: opacity 0.3s ease !important;
          }

          .scroll-effect-hidden {
            opacity: 0.7;
            transform: none;
          }

          .scroll-effect-parallax {
            transform: none !important;
          }
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .scroll-effect-element {
            transition-duration: 0.2s;
          }
        }

        /* Dark mode optimizations */
        @media (prefers-color-scheme: dark) {
          .scroll-effect-element {
            filter: brightness(1.1);
          }
        }
      `}</style>
    </>
  );
};

// Higher-order component for easy wrapping
export const withScrollEffect = (
  Component: React.ComponentType<any>,
  effect: ScrollEffectsProps['effect'] = 'fadeUp',
  config?: ScrollEffectConfig
) => {
  return React.forwardRef<any, any>((props, ref) => (
    <ScrollEffects effect={effect} config={config}>
      <Component {...props} ref={ref} />
    </ScrollEffects>
  ));
};

// Utility hook for custom scroll effects
export const useScrollEffect = (
  elementRef: React.RefObject<HTMLElement>,
  callback: (entry: IntersectionObserverEntry) => void,
  options?: IntersectionObserverInit
) => {
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      callback(entry);
    }, options);

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [elementRef, callback, options]);
};

export default ScrollEffects;