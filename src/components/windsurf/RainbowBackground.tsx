/**
 * RAINBOW BACKGROUND COMPONENT
 * Advanced background component with dynamic rainbow animations
 * Optimized for Next.js 14 with TypeScript and WindsurfEngine integration
 */

'use client';

import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import { useWindsurfEngine, useRainbowElement } from '@/lib/windsurf-engine';

// ===== INTERFACES =====

export interface RainbowBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  intensity?: 'low' | 'medium' | 'high' | 'ultra';
  speed?: 'slow' | 'normal' | 'fast' | 'ultra';
  direction?: 'horizontal' | 'vertical' | 'diagonal' | 'radial' | 'spiral';
  gradient?: 'rainbow' | 'sunset' | 'ocean' | 'forest' | 'cosmic' | 'fire';
  animationType?: 'flow' | 'pulse' | 'wave' | 'spiral' | 'matrix' | 'plasma';
  interactive?: boolean;
  particles?: boolean;
  disabled?: boolean;
  onAnimationComplete?: () => void;
  onHover?: (isHovered: boolean) => void;
}

interface GradientConfig {
  colors: string[];
  stops: number[];
  angle?: number;
  centerX?: number;
  centerY?: number;
}

// ===== GRADIENT CONFIGURATIONS =====

const GRADIENT_CONFIGS: Record<string, GradientConfig> = {
  rainbow: {
    colors: [
      'hsl(0deg, 100%, 60%)',    // Red
      'hsl(60deg, 100%, 60%)',   // Yellow
      'hsl(120deg, 100%, 60%)',  // Green
      'hsl(180deg, 100%, 60%)',  // Cyan
      'hsl(240deg, 100%, 60%)',  // Blue
      'hsl(300deg, 100%, 60%)',  // Magenta
      'hsl(360deg, 100%, 60%)'   // Red (loop)
    ],
    stops: [0, 16.67, 33.33, 50, 66.67, 83.33, 100],
    angle: 45
  },
  sunset: {
    colors: [
      'hsl(15deg, 100%, 55%)',   // Orange-red
      'hsl(30deg, 100%, 60%)',   // Orange
      'hsl(45deg, 100%, 65%)',   // Golden
      'hsl(60deg, 100%, 70%)',   // Yellow
      'hsl(300deg, 80%, 50%)',   // Purple
      'hsl(240deg, 60%, 40%)'    // Deep blue
    ],
    stops: [0, 20, 40, 60, 80, 100],
    angle: 135
  },
  ocean: {
    colors: [
      'hsl(200deg, 100%, 40%)',  // Deep blue
      'hsl(190deg, 100%, 45%)',  // Blue
      'hsl(180deg, 100%, 50%)',  // Cyan
      'hsl(170deg, 80%, 55%)',   // Teal
      'hsl(160deg, 70%, 60%)',   // Aqua
      'hsl(200deg, 100%, 40%)'   // Loop back
    ],
    stops: [0, 20, 40, 60, 80, 100],
    angle: 90
  },
  forest: {
    colors: [
      'hsl(120deg, 60%, 30%)',   // Dark green
      'hsl(100deg, 70%, 35%)',   // Green
      'hsl(80deg, 80%, 40%)',    // Lime green
      'hsl(60deg, 90%, 45%)',    // Yellow-green
      'hsl(40deg, 100%, 50%)',   // Golden
      'hsl(120deg, 60%, 30%)'    // Loop back
    ],
    stops: [0, 20, 40, 60, 80, 100],
    angle: 45
  },
  cosmic: {
    colors: [
      'hsl(270deg, 100%, 30%)',  // Deep purple
      'hsl(300deg, 100%, 40%)',  // Magenta
      'hsl(330deg, 100%, 50%)',  // Pink
      'hsl(200deg, 100%, 60%)',  // Blue
      'hsl(180deg, 100%, 70%)',  // Cyan
      'hsl(270deg, 100%, 30%)'   // Loop back
    ],
    stops: [0, 20, 40, 60, 80, 100],
    angle: 225
  },
  fire: {
    colors: [
      'hsl(0deg, 100%, 40%)',    // Dark red
      'hsl(15deg, 100%, 50%)',   // Red
      'hsl(30deg, 100%, 60%)',   // Orange
      'hsl(45deg, 100%, 70%)',   // Golden
      'hsl(60deg, 100%, 80%)',   // Yellow
      'hsl(0deg, 100%, 40%)'     // Loop back
    ],
    stops: [0, 20, 40, 60, 80, 100],
    angle: 0
  }
};

// ===== RAINBOW BACKGROUND COMPONENT =====

export const RainbowBackground = forwardRef<HTMLDivElement, RainbowBackgroundProps>(({
  children,
  className = '',
  style,
  intensity = 'medium',
  speed = 'normal',
  direction = 'horizontal',
  gradient = 'rainbow',
  animationType = 'flow',
  interactive = true,
  particles = false,
  disabled = false,
  onAnimationComplete,
  onHover,
  ...props
}, ref) => {
  
  // Refs and state
  const containerRef = useRef<HTMLDivElement>(null);
  const rainbowRef = useRainbowElement();
  const [isHovered, setIsHovered] = useState(false);
  const [currentGradient, setCurrentGradient] = useState(GRADIENT_CONFIGS[gradient]);
  
  // Windsurf engine integration
  const { engine, isReady } = useWindsurfEngine();
  
  // Animation controls
  const backgroundAnimation = useAnimation();
  const particleAnimation = useAnimation();
  
  // Motion values for interactive effects
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const rotateX = useTransform(mouseY, [0, 1], [-10, 10]);
  const rotateY = useTransform(mouseX, [0, 1], [-10, 10]);

  // ===== UTILITY FUNCTIONS =====

  const getIntensityOpacity = useCallback(() => {
    const intensityMap = {
      low: 0.6,
      medium: 0.8,
      high: 1.0,
      ultra: 1.2
    };
    return intensityMap[intensity];
  }, [intensity]);

  const getAnimationDuration = useCallback(() => {
    const speedMap = {
      slow: 8,
      normal: 4,
      fast: 2,
      ultra: 1
    };
    return speedMap[speed];
  }, [speed]);

  const generateGradientCSS = useCallback((config: GradientConfig, animationOffset = 0) => {
    const { colors, stops, angle = 0, centerX = 50, centerY = 50 } = config;
    
    const colorStops = colors.map((color, index) => {
      const stop = stops[index] + animationOffset;
      return `${color} ${stop}%`;
    }).join(', ');

    switch (direction) {
      case 'radial':
        return `radial-gradient(circle at ${centerX}% ${centerY}%, ${colorStops})`;
      case 'spiral':
        return `conic-gradient(from ${angle + animationOffset}deg at ${centerX}% ${centerY}%, ${colorStops})`;
      default:
        return `linear-gradient(${angle}deg, ${colorStops})`;
    }
  }, [direction]);

  // ===== EVENT HANDLERS =====

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!interactive || disabled) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      
      mouseX.set(x);
      mouseY.set(y);

      // Update gradient based on mouse position
      if (animationType === 'interactive') {
        const offset = (x + y) * 50;
        const newGradient = generateGradientCSS(currentGradient, offset);
        
        if (containerRef.current) {
          containerRef.current.style.background = newGradient;
        }
      }
    }
  }, [interactive, disabled, mouseX, mouseY, animationType, currentGradient, generateGradientCSS]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    onHover?.(true);
    
    if (interactive && !disabled) {
      backgroundAnimation.start({
        scale: 1.02,
        opacity: getIntensityOpacity() * 1.1,
        transition: { duration: 0.3, ease: "easeOut" }
      });
    }
  }, [interactive, disabled, backgroundAnimation, getIntensityOpacity, onHover]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    onHover?.(false);
    
    if (interactive && !disabled) {
      backgroundAnimation.start({
        scale: 1,
        opacity: getIntensityOpacity(),
        transition: { duration: 0.3, ease: "easeOut" }
      });
    }
  }, [interactive, disabled, backgroundAnimation, getIntensityOpacity, onHover]);

  // ===== ANIMATION EFFECTS =====

  const startBackgroundAnimation = useCallback(async () => {
    if (disabled) return;

    const duration = getAnimationDuration();
    
    switch (animationType) {
      case 'flow':
        await backgroundAnimation.start({
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          transition: {
            duration: duration,
            repeat: Infinity,
            ease: "linear"
          }
        });
        break;
        
      case 'pulse':
        await backgroundAnimation.start({
          scale: [1, 1.05, 1],
          opacity: [getIntensityOpacity(), getIntensityOpacity() * 1.2, getIntensityOpacity()],
          transition: {
            duration: duration,
            repeat: Infinity,
            ease: "easeInOut"
          }
        });
        break;
        
      case 'wave':
        await backgroundAnimation.start({
          backgroundPosition: [
            '0% 0%', '100% 100%', '0% 100%', '100% 0%', '0% 0%'
          ],
          transition: {
            duration: duration * 2,
            repeat: Infinity,
            ease: "easeInOut"
          }
        });
        break;
        
      case 'spiral':
        await backgroundAnimation.start({
          rotate: [0, 360],
          transition: {
            duration: duration * 3,
            repeat: Infinity,
            ease: "linear"
          }
        });
        break;
        
      case 'matrix':
        // Matrix-style digital rain effect
        await backgroundAnimation.start({
          backgroundPosition: ['0% 0%', '0% 100%'],
          opacity: [getIntensityOpacity(), getIntensityOpacity() * 0.8, getIntensityOpacity()],
          transition: {
            duration: duration,
            repeat: Infinity,
            ease: "linear"
          }
        });
        break;
        
      case 'plasma':
        await backgroundAnimation.start({
          backgroundSize: ['100% 100%', '200% 200%', '100% 100%'],
          backgroundPosition: ['0% 0%', '50% 50%', '0% 0%'],
          transition: {
            duration: duration,
            repeat: Infinity,
            ease: "easeInOut"
          }
        });
        break;
    }
    
    onAnimationComplete?.();
  }, [disabled, animationType, backgroundAnimation, getAnimationDuration, getIntensityOpacity, onAnimationComplete]);

  // ===== COMBINE REFS =====

  const combinedRef = useCallback((node: HTMLDivElement) => {
    if (containerRef.current !== node) {
      containerRef.current = node;
    }
    if (rainbowRef.current !== node) {
      (rainbowRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
    }
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  }, [ref, rainbowRef]);

  // ===== EFFECTS =====

  useEffect(() => {
    setCurrentGradient(GRADIENT_CONFIGS[gradient]);
  }, [gradient]);

  useEffect(() => {
    if (isReady && engine && containerRef.current && !disabled) {
      engine.enableInteractions(containerRef.current);
      
      return () => {
        if (containerRef.current) {
          engine.disableInteractions(containerRef.current);
        }
      };
    }
  }, [engine, isReady, disabled]);

  useEffect(() => {
    startBackgroundAnimation();
  }, [startBackgroundAnimation]);

  // ===== COMPUTED STYLES =====

  const backgroundStyle = {
    background: generateGradientCSS(currentGradient),
    backgroundSize: direction === 'radial' || direction === 'spiral' ? '100% 100%' : '400% 400%',
    opacity: getIntensityOpacity(),
    filter: `blur(${intensity === 'ultra' ? '1px' : '0px'}) saturate(${intensity === 'ultra' ? '1.2' : '1'})`,
    ...style
  };

  const combinedClassName = [
    'windsurf-rainbow-background',
    'windsurf-gpu-optimized',
    'windsurf-composite-layer',
    interactive ? 'windsurf-interactive' : '',
    disabled ? 'windsurf-pause-animations' : '',
    className
  ].filter(Boolean).join(' ');

  // ===== RENDER =====

  return (
    <motion.div
      ref={combinedRef}
      className={combinedClassName}
      style={backgroundStyle}
      animate={backgroundAnimation}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {/* Interactive 3D Transform Layer */}
      {interactive && (
        <motion.div
          className="absolute inset-0"
          style={{
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
            perspective: '1000px'
          }}
        />
      )}

      {/* Particle Layer */}
      {particles && !disabled && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/30 rounded-full"
              animate={{
                x: [0, Math.random() * 100, 0],
                y: [0, Math.random() * 100, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: getAnimationDuration() + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut"
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            />
          ))}
        </div>
      )}

      {/* Content Layer */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 left-2 bg-black/50 text-white p-1 rounded text-xs font-mono z-50">
          <div>Gradient: {gradient}</div>
          <div>Animation: {animationType}</div>
          <div>Intensity: {intensity}</div>
          <div>Hovered: {isHovered ? 'Yes' : 'No'}</div>
        </div>
      )}
    </motion.div>
  );
});

RainbowBackground.displayName = 'RainbowBackground';

export default RainbowBackground;