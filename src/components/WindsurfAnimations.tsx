/**
 * WINDSURF ANIMATIONS COMPONENTS
 * React components that leverage the WindsurfEngine for animated effects
 * Optimized for Next.js 14 with TypeScript and accessibility support
 */

'use client';

import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useInView, useScroll, useTransform } from 'framer-motion';
import { useWindsurfEngine, useRainbowElement, useScrollAnimation } from '@/lib/windsurf-engine';
import type { ColorConfig } from '@/lib/windsurf-engine';

// ===== INTERFACES =====

interface WindsurfComponentProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
}

interface RainbowBackgroundProps extends WindsurfComponentProps {
  intensity?: 'low' | 'medium' | 'high';
  speed?: 'slow' | 'normal' | 'fast';
  direction?: 'horizontal' | 'vertical' | 'diagonal';
}

interface RainbowTextProps extends WindsurfComponentProps {
  as?: keyof JSX.IntrinsicElements;
  gradient?: 'rainbow' | 'sunset' | 'ocean' | 'forest';
}

interface InteractiveElementProps extends WindsurfComponentProps {
  onHover?: (isHovered: boolean) => void;
  onClick?: (event: React.MouseEvent) => void;
  rippleColor?: string;
}

interface ScrollAnimatedProps extends WindsurfComponentProps {
  triggerOnce?: boolean;
  threshold?: number;
  rootMargin?: string;
  delay?: number;
  duration?: number;
  animationType?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scaleIn' | 'rotateIn';
}

// ===== RAINBOW BACKGROUND COMPONENT =====

export const RainbowBackground = forwardRef<HTMLDivElement, RainbowBackgroundProps>(({
  children,
  className = '',
  style,
  intensity = 'medium',
  speed = 'normal',
  direction = 'horizontal',
  disabled = false,
  ...props
}, ref) => {
  const rainbowRef = useRainbowElement();
  const { engine, isReady } = useWindsurfEngine();

  // Combine refs
  const combinedRef = useCallback((node: HTMLDivElement) => {
    if (rainbowRef.current !== node) {
      (rainbowRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
    }
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  }, [ref, rainbowRef]);

  const intensityClasses = {
    low: 'opacity-70',
    medium: 'opacity-90',
    high: 'opacity-100'
  };

  const speedClasses = {
    slow: '[animation-duration:6s]',
    normal: '[animation-duration:3s]',
    fast: '[animation-duration:1.5s]'
  };

  const directionClasses = {
    horizontal: 'windsurf-rainbow',
    vertical: 'windsurf-rainbow [background-size:400%_100%] [animation-name:windsurfVerticalShift]',
    diagonal: 'windsurf-rainbow [background-size:400%_400%] [animation-name:windsurfDiagonalShift]'
  };

  const combinedClassName = [
    directionClasses[direction],
    intensityClasses[intensity],
    speedClasses[speed],
    disabled ? 'windsurf-pause-animations' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={combinedRef}
      className={combinedClassName}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
});

RainbowBackground.displayName = 'RainbowBackground';

// ===== RAINBOW TEXT COMPONENT =====

export const RainbowText = forwardRef<HTMLElement, RainbowTextProps>(({
  children,
  className = '',
  style,
  as: Component = 'span',
  gradient = 'rainbow',
  disabled = false,
  ...props
}, ref) => {
  const gradientClasses = {
    rainbow: 'windsurf-rainbow-text',
    sunset: 'windsurf-rainbow-text [--windsurf-color-1:hsl(15deg,100%,55%)] [--windsurf-color-4:hsl(45deg,100%,50%)]',
    ocean: 'windsurf-rainbow-text [--windsurf-color-1:hsl(200deg,100%,40%)] [--windsurf-color-4:hsl(180deg,100%,45%)]',
    forest: 'windsurf-rainbow-text [--windsurf-color-1:hsl(120deg,60%,30%)] [--windsurf-color-4:hsl(140deg,80%,40%)]'
  };

  const combinedClassName = [
    gradientClasses[gradient],
    'windsurf-smooth-edges',
    disabled ? 'windsurf-pause-animations' : '',
    className
  ].filter(Boolean).join(' ');

  return React.createElement(
    Component,
    {
      ref,
      className: combinedClassName,
      style,
      ...props
    },
    children
  );
});

RainbowText.displayName = 'RainbowText';

// ===== INTERACTIVE ELEMENT COMPONENT =====

export const InteractiveElement = forwardRef<HTMLDivElement, InteractiveElementProps>(({
  children,
  className = '',
  style,
  onHover,
  onClick,
  rippleColor,
  disabled = false,
  ...props
}, ref) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const { engine, isReady } = useWindsurfEngine();
  const [isHovered, setIsHovered] = useState(false);

  // Combine refs
  const combinedRef = useCallback((node: HTMLDivElement) => {
    if (elementRef.current !== node) {
      elementRef.current = node;
    }
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  }, [ref]);

  useEffect(() => {
    if (isReady && engine && elementRef.current && !disabled) {
      engine.enableInteractions(elementRef.current);

      return () => {
        if (elementRef.current && engine) {
          engine.disableInteractions(elementRef.current);
        }
      };
    }
  }, [engine, isReady, disabled]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    onHover?.(true);
  }, [onHover]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    onHover?.(false);
  }, [onHover]);

  const handleClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!disabled) {
      onClick?.(event);
    }
  }, [onClick, disabled]);

  const combinedClassName = [
    'windsurf-interactive',
    'windsurf-mouse-reactive',
    'windsurf-ripple',
    'windsurf-gpu-optimized',
    disabled ? 'windsurf-disable-interactions' : '',
    className
  ].filter(Boolean).join(' ');

  const combinedStyle = {
    '--ripple-color': rippleColor || 'rgba(255, 255, 255, 0.4)',
    ...style
  } as React.CSSProperties;

  return (
    <div
      ref={combinedRef}
      className={combinedClassName}
      style={combinedStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
      {...props}
    >
      {children}
    </div>
  );
});

InteractiveElement.displayName = 'InteractiveElement';

// ===== SCROLL ANIMATED COMPONENT =====

export const ScrollAnimated = forwardRef<HTMLDivElement, ScrollAnimatedProps>(({
  children,
  className = '',
  style,
  triggerOnce = true,
  threshold = 0.1,
  rootMargin = '0px 0px -50px 0px',
  delay = 0,
  duration = 0.6,
  animationType = 'fadeIn',
  disabled = false,
  ...props
}, ref) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  const scrollRef = useScrollAnimation(useCallback((entry) => {
    if (entry.isIntersecting) {
      setIsVisible(true);
    } else if (!triggerOnce) {
      setIsVisible(false);
    }
  }, [triggerOnce]));

  // Combine refs
  const combinedRef = useCallback((node: HTMLDivElement) => {
    if (elementRef.current !== node) {
      elementRef.current = node;
    }
    if (scrollRef.current !== node) {
      (scrollRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
    }
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  }, [ref, scrollRef]);

  const animationVariants = {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 }
    },
    slideUp: {
      initial: { opacity: 0, y: 50 },
      animate: { opacity: 1, y: 0 }
    },
    slideLeft: {
      initial: { opacity: 0, x: 50 },
      animate: { opacity: 1, x: 0 }
    },
    slideRight: {
      initial: { opacity: 0, x: -50 },
      animate: { opacity: 1, x: 0 }
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 }
    },
    rotateIn: {
      initial: { opacity: 0, rotate: -10, scale: 0.9 },
      animate: { opacity: 1, rotate: 0, scale: 1 }
    }
  };

  const variant = animationVariants[animationType];

  const combinedClassName = [
    'windsurf-scroll-effect',
    'windsurf-gpu-optimized',
    disabled ? 'windsurf-pause-animations' : '',
    className
  ].filter(Boolean).join(' ');

  if (disabled) {
    return (
      <div ref={combinedRef} className={combinedClassName} style={style} {...props}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={combinedRef}
      className={combinedClassName}
      style={style}
      initial={variant.initial}
      animate={variant.animate}  // EMERGENCY FIX: Always animate to visible state
      transition={{
        duration,
        delay,
        ease: [0.4, 0, 0.6, 1]
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
});

ScrollAnimated.displayName = 'ScrollAnimated';

// ===== RAINBOW BORDER COMPONENT =====

export const RainbowBorder = forwardRef<HTMLDivElement, WindsurfComponentProps>(({
  children,
  className = '',
  style,
  disabled = false,
  ...props
}, ref) => {
  const combinedClassName = [
    'windsurf-rainbow-border',
    'windsurf-gpu-optimized',
    disabled ? 'windsurf-pause-animations' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={ref}
      className={combinedClassName}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
});

RainbowBorder.displayName = 'RainbowBorder';

// ===== PARALLAX SCROLL COMPONENT =====

export const ParallaxScroll = forwardRef<HTMLDivElement, WindsurfComponentProps & {
  speed?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}>(({
  children,
  className = '',
  style,
  speed = 0.5,
  direction = 'up',
  disabled = false,
  ...props
}, ref) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  const directionMap = {
    up: -1,
    down: 1,
    left: -1,
    right: 1
  };

  const isVertical = direction === 'up' || direction === 'down';
  const multiplier = directionMap[direction] * speed;

  const transform = useTransform(
    scrollY,
    [0, 1000],
    isVertical 
      ? [`translateY(0px)`, `translateY(${multiplier * 100}px)`]
      : [`translateX(0px)`, `translateX(${multiplier * 100}px)`]
  );

  const combinedRef = useCallback((node: HTMLDivElement) => {
    if (elementRef.current !== node) {
      elementRef.current = node;
    }
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  }, [ref]);

  const combinedClassName = [
    'windsurf-scroll-parallax',
    'windsurf-gpu-optimized',
    disabled ? 'windsurf-pause-animations' : '',
    className
  ].filter(Boolean).join(' ');

  if (disabled) {
    return (
      <div ref={combinedRef} className={combinedClassName} style={style} {...props}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={combinedRef}
      className={combinedClassName}
      style={{
        ...style,
        transform: disabled ? undefined : transform
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
});

ParallaxScroll.displayName = 'ParallaxScroll';

// ===== PERFORMANCE OPTIMIZED CONTAINER =====

export const PerformanceContainer = forwardRef<HTMLDivElement, WindsurfComponentProps & {
  monitoring?: boolean;
  fallback?: React.ReactNode;
}>(({
  children,
  className = '',
  style,
  monitoring = true,
  fallback,
  ...props
}, ref) => {
  const { engine, isReady } = useWindsurfEngine();
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    if (!monitoring || !isReady || !engine) return;

    const interval = setInterval(() => {
      const currentMetrics = engine.getPerformanceMetrics();
      setMetrics(currentMetrics);

      // Auto-disable animations if performance is poor
      if (currentMetrics.fps < 30 || currentMetrics.isLowPowerMode) {
        document.documentElement.classList.add('windsurf-pause-animations');
      } else {
        document.documentElement.classList.remove('windsurf-pause-animations');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [engine, isReady, monitoring]);

  const combinedClassName = [
    'windsurf-composite-layer',
    'windsurf-gpu-optimized',
    className
  ].filter(Boolean).join(' ');

  // Show fallback if performance is too poor
  if (metrics && metrics.fps < 20 && fallback) {
    return (
      <div ref={ref} className={combinedClassName} style={style} {...props}>
        {fallback}
      </div>
    );
  }

  return (
    <div ref={ref} className={combinedClassName} style={style} {...props}>
      {children}
      {monitoring && metrics && process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 right-4 bg-black/80 text-white p-2 rounded text-xs font-mono z-50">
          <div>FPS: {metrics.fps}</div>
          <div>Memory: {Math.round(metrics.memoryUsage / 1024 / 1024)}MB</div>
          <div>Battery: {metrics.batteryLevel ? `${Math.round(metrics.batteryLevel * 100)}%` : 'N/A'}</div>
          <div>Low Power: {metrics.isLowPowerMode ? 'Yes' : 'No'}</div>
        </div>
      )}
    </div>
  );
});

PerformanceContainer.displayName = 'PerformanceContainer';

// ===== UTILITY HOOKS =====

export function useRainbowColors() {
  const [colors, setColors] = useState<ColorConfig[]>([]);
  const { engine, isReady } = useWindsurfEngine();

  useEffect(() => {
    if (isReady && engine) {
      const currentColors = engine.getCurrentColors();
      setColors(currentColors);
    }
  }, [engine, isReady]);

  const updateColors = useCallback((newColors: ColorConfig[]) => {
    if (engine) {
      engine.setColorScheme(newColors);
      setColors(newColors);
    }
  }, [engine]);

  return { colors, updateColors };
}

export function useAnimationControl() {
  const { engine, isReady } = useWindsurfEngine();

  const createAnimation = useCallback((element: Element, keyframes: Keyframe[], options?: KeyframeAnimationOptions) => {
    if (engine) {
      return engine.createAnimation(element, keyframes, options);
    }
    return '';
  }, [engine]);

  const playAnimation = useCallback((id: string) => {
    if (engine) {
      engine.playAnimation(id);
    }
  }, [engine]);

  const pauseAnimation = useCallback((id: string) => {
    if (engine) {
      engine.pauseAnimation(id);
    }
  }, [engine]);

  const stopAnimation = useCallback((id: string) => {
    if (engine) {
      engine.stopAnimation(id);
    }
  }, [engine]);

  return {
    isReady,
    createAnimation,
    playAnimation,
    pauseAnimation,
    stopAnimation
  };
}

// ===== EXPORTS =====

export default {
  RainbowBackground,
  RainbowText,
  InteractiveElement,
  ScrollAnimated,
  RainbowBorder,
  ParallaxScroll,
  PerformanceContainer,
  useRainbowColors,
  useAnimationControl
};