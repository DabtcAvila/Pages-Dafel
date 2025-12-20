/**
 * ANIMATED TEXT COMPONENT
 * Advanced text animations with Windsurf effects and TypeScript
 * Supports multiple animation types, gradients, and interactive effects
 */

'use client';

import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useInView, AnimatePresence, Variants } from 'framer-motion';
import { useWindsurfEngine } from '@/lib/windsurf-engine';

// ===== INTERFACES =====

export interface AnimatedTextProps {
  text: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  style?: React.CSSProperties;
  gradient?: 'rainbow' | 'sunset' | 'ocean' | 'forest' | 'cosmic' | 'fire' | 'none';
  animationType?: 'typewriter' | 'wave' | 'glow' | 'bounce' | 'slide' | 'fade' | 'split' | 'morph';
  speed?: 'slow' | 'normal' | 'fast';
  delay?: number;
  duration?: number;
  repeat?: boolean | number;
  interactive?: boolean;
  letterSpacing?: 'tight' | 'normal' | 'wide' | 'wider';
  stagger?: number;
  onComplete?: () => void;
  onStart?: () => void;
  disabled?: boolean;
}

interface LetterProps {
  letter: string;
  index: number;
  animationType: string;
  delay: number;
  stagger: number;
  isVisible: boolean;
}

// ===== GRADIENT CONFIGURATIONS =====

const GRADIENT_STYLES: Record<string, string> = {
  rainbow: `
    background: linear-gradient(45deg, 
      hsl(0deg, 100%, 60%) 0%, 
      hsl(60deg, 100%, 60%) 16.67%, 
      hsl(120deg, 100%, 60%) 33.33%, 
      hsl(180deg, 100%, 60%) 50%, 
      hsl(240deg, 100%, 60%) 66.67%, 
      hsl(300deg, 100%, 60%) 83.33%, 
      hsl(360deg, 100%, 60%) 100%
    );
    background-size: 200% 200%;
    animation: rainbowShift 3s ease-in-out infinite;
  `,
  sunset: `
    background: linear-gradient(135deg, 
      hsl(15deg, 100%, 55%) 0%, 
      hsl(30deg, 100%, 60%) 25%, 
      hsl(45deg, 100%, 65%) 50%, 
      hsl(300deg, 80%, 50%) 75%, 
      hsl(240deg, 60%, 40%) 100%
    );
    background-size: 200% 200%;
    animation: sunsetShift 4s ease-in-out infinite;
  `,
  ocean: `
    background: linear-gradient(90deg, 
      hsl(200deg, 100%, 40%) 0%, 
      hsl(190deg, 100%, 45%) 25%, 
      hsl(180deg, 100%, 50%) 50%, 
      hsl(170deg, 80%, 55%) 75%, 
      hsl(200deg, 100%, 40%) 100%
    );
    background-size: 200% 200%;
    animation: oceanShift 5s ease-in-out infinite;
  `,
  forest: `
    background: linear-gradient(45deg, 
      hsl(120deg, 60%, 30%) 0%, 
      hsl(100deg, 70%, 35%) 25%, 
      hsl(80deg, 80%, 40%) 50%, 
      hsl(60deg, 90%, 45%) 75%, 
      hsl(120deg, 60%, 30%) 100%
    );
    background-size: 200% 200%;
    animation: forestShift 6s ease-in-out infinite;
  `,
  cosmic: `
    background: linear-gradient(225deg, 
      hsl(270deg, 100%, 30%) 0%, 
      hsl(300deg, 100%, 40%) 25%, 
      hsl(330deg, 100%, 50%) 50%, 
      hsl(200deg, 100%, 60%) 75%, 
      hsl(270deg, 100%, 30%) 100%
    );
    background-size: 200% 200%;
    animation: cosmicShift 4s ease-in-out infinite;
  `,
  fire: `
    background: linear-gradient(0deg, 
      hsl(0deg, 100%, 40%) 0%, 
      hsl(15deg, 100%, 50%) 25%, 
      hsl(30deg, 100%, 60%) 50%, 
      hsl(45deg, 100%, 70%) 75%, 
      hsl(0deg, 100%, 40%) 100%
    );
    background-size: 200% 200%;
    animation: fireShift 2s ease-in-out infinite;
  `,
  none: ''
};

// ===== LETTER COMPONENT =====

const AnimatedLetter: React.FC<LetterProps> = ({
  letter,
  index,
  animationType,
  delay,
  stagger,
  isVisible
}) => {
  const letterVariants: Variants = {
    typewriter: {
      hidden: { opacity: 0, width: 0 },
      visible: { 
        opacity: 1, 
        width: 'auto',
        transition: { 
          duration: 0.05,
          delay: delay + (index * stagger),
          ease: "easeOut"
        }
      }
    },
    wave: {
      hidden: { opacity: 0, y: 50 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { 
          duration: 0.3,
          delay: delay + (index * stagger),
          ease: "easeOut"
        }
      }
    },
    glow: {
      hidden: { opacity: 0, filter: 'blur(10px)', scale: 0.8 },
      visible: { 
        opacity: 1, 
        filter: 'blur(0px)', 
        scale: 1,
        transition: { 
          duration: 0.4,
          delay: delay + (index * stagger),
          ease: "easeOut"
        }
      }
    },
    bounce: {
      hidden: { opacity: 0, y: -100, scale: 0 },
      visible: { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: { 
          type: "spring",
          stiffness: 400,
          damping: 10,
          delay: delay + (index * stagger)
        }
      }
    },
    slide: {
      hidden: { opacity: 0, x: -50 },
      visible: { 
        opacity: 1, 
        x: 0,
        transition: { 
          duration: 0.4,
          delay: delay + (index * stagger),
          ease: [0.4, 0, 0.6, 1]
        }
      }
    },
    fade: {
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: { 
          duration: 0.3,
          delay: delay + (index * stagger),
          ease: "easeInOut"
        }
      }
    },
    split: {
      hidden: { opacity: 0, scaleY: 0 },
      visible: { 
        opacity: 1, 
        scaleY: 1,
        transition: { 
          duration: 0.3,
          delay: delay + (index * stagger),
          ease: "easeOut"
        }
      }
    },
    morph: {
      hidden: { opacity: 0, scale: 0, rotate: -180 },
      visible: { 
        opacity: 1, 
        scale: 1, 
        rotate: 0,
        transition: { 
          duration: 0.5,
          delay: delay + (index * stagger),
          ease: "backOut"
        }
      }
    }
  };

  return (
    <motion.span
      className="inline-block"
      variants={letterVariants[animationType as keyof typeof letterVariants] || letterVariants.fade}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      style={{ 
        display: animationType === 'typewriter' ? 'inline' : 'inline-block',
        transformOrigin: 'bottom center'
      }}
    >
      {letter === ' ' ? '\u00A0' : letter}
    </motion.span>
  );
};

// ===== ANIMATED TEXT COMPONENT =====

export const AnimatedText = forwardRef<HTMLElement, AnimatedTextProps>(({
  text,
  as: Component = 'span',
  className = '',
  style,
  gradient = 'rainbow',
  animationType = 'fade',
  speed = 'normal',
  delay = 0,
  duration,
  repeat = false,
  interactive = false,
  letterSpacing = 'normal',
  stagger = 0.05,
  onComplete,
  onStart,
  disabled = false,
  ...props
}, ref) => {
  
  // Refs and state
  const containerRef = useRef<HTMLElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  
  // Windsurf engine integration
  const { engine, isReady } = useWindsurfEngine();
  
  // Animation controls
  const textAnimation = useAnimation();
  
  // Intersection observer
  const isInView = useInView(containerRef, { once: !repeat, amount: 0.1 });

  // ===== UTILITY FUNCTIONS =====

  const getSpeedMultiplier = useCallback(() => {
    const speedMap = {
      slow: 2,
      normal: 1,
      fast: 0.5
    };
    return speedMap[speed];
  }, [speed]);

  const getStaggerDelay = useCallback(() => {
    return stagger * getSpeedMultiplier();
  }, [stagger, getSpeedMultiplier]);

  const getLetterSpacingClass = useCallback(() => {
    const spacingMap = {
      tight: 'tracking-tight',
      normal: 'tracking-normal',
      wide: 'tracking-wide',
      wider: 'tracking-wider'
    };
    return spacingMap[letterSpacing];
  }, [letterSpacing]);

  // ===== ANIMATION FUNCTIONS =====

  const startAnimation = useCallback(async () => {
    if (disabled) return;

    setIsAnimating(true);
    onStart?.();

    // Handle typewriter effect separately
    if (animationType === 'typewriter') {
      let displayText = '';
      const chars = text.split('');
      
      for (let i = 0; i < chars.length; i++) {
        displayText += chars[i];
        setCurrentText(displayText);
        await new Promise(resolve => setTimeout(resolve, 100 * getSpeedMultiplier()));
      }
    } else {
      setCurrentText(text);
    }

    // Wait for all letter animations to complete
    const totalDuration = delay + (text.length * getStaggerDelay()) + (duration || 0.5);
    setTimeout(() => {
      setIsAnimating(false);
      onComplete?.();
    }, totalDuration * 1000);

  }, [text, animationType, disabled, delay, getStaggerDelay, duration, getSpeedMultiplier, onStart, onComplete]);

  const resetAnimation = useCallback(() => {
    setCurrentText('');
    setIsAnimating(false);
  }, []);

  // ===== EVENT HANDLERS =====

  const handleMouseEnter = useCallback(() => {
    if (!interactive || disabled) return;
    
    setIsHovered(true);
    
    textAnimation.start({
      scale: 1.05,
      textShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
      transition: { duration: 0.3, ease: "easeOut" }
    });
  }, [interactive, disabled, textAnimation]);

  const handleMouseLeave = useCallback(() => {
    if (!interactive || disabled) return;
    
    setIsHovered(false);
    
    textAnimation.start({
      scale: 1,
      textShadow: '0 0 0px rgba(255, 255, 255, 0)',
      transition: { duration: 0.3, ease: "easeOut" }
    });
  }, [interactive, disabled, textAnimation]);

  // ===== COMBINE REFS =====

  const combinedRef = useCallback((node: HTMLElement) => {
    if (containerRef.current !== node) {
      containerRef.current = node;
    }
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  }, [ref]);

  // ===== EFFECTS =====

  useEffect(() => {
    if (isInView && !disabled) {
      startAnimation();
    } else if (!isInView && repeat && !disabled) {
      resetAnimation();
    }
  }, [isInView, disabled, repeat, startAnimation, resetAnimation]);

  useEffect(() => {
    if (isReady && engine && containerRef.current && interactive && !disabled) {
      engine.enableInteractions(containerRef.current);
      
      return () => {
        if (containerRef.current) {
          engine.disableInteractions(containerRef.current);
        }
      };
    }
  }, [engine, isReady, interactive, disabled]);

  // ===== COMPUTED STYLES =====

  const gradientStyle = gradient !== 'none' ? {
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    ...style
  } : style;

  const combinedClassName = [
    'windsurf-animated-text',
    'windsurf-smooth-edges',
    getLetterSpacingClass(),
    gradient !== 'none' ? 'windsurf-gradient-text' : '',
    interactive ? 'windsurf-interactive cursor-pointer' : '',
    disabled ? 'windsurf-pause-animations' : '',
    className
  ].filter(Boolean).join(' ');

  const textToDisplay = animationType === 'typewriter' ? currentText : text;
  const letters = textToDisplay.split('');

  // ===== RENDER =====

  const content = animationType === 'typewriter' ? (
    <span>{currentText}</span>
  ) : (
    <AnimatePresence mode="wait">
      {letters.map((letter, index) => (
        <AnimatedLetter
          key={`${letter}-${index}-${isInView}`}
          letter={letter}
          index={index}
          animationType={animationType}
          delay={delay}
          stagger={getStaggerDelay()}
          isVisible={isInView && !disabled}
        />
      ))}
    </AnimatePresence>
  );

  return (
    <>
      {/* Inject gradient styles */}
      {gradient !== 'none' && (
        <style jsx>{`
          .windsurf-gradient-text {
            ${GRADIENT_STYLES[gradient]}
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          
          @keyframes rainbowShift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          
          @keyframes sunsetShift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          
          @keyframes oceanShift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          
          @keyframes forestShift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          
          @keyframes cosmicShift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          
          @keyframes fireShift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
        `}</style>
      )}

      {React.createElement(
        Component,
        {
          ref: combinedRef,
          className: combinedClassName,
          style: gradientStyle,
          onMouseEnter: handleMouseEnter,
          onMouseLeave: handleMouseLeave,
          ...props
        },
        <motion.span
          animate={textAnimation}
          style={{ display: 'inline-block' }}
        >
          {content}
        </motion.span>
      )}

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-20 right-4 bg-black/50 text-white p-1 rounded text-xs font-mono z-50">
          <div>Animation: {animationType}</div>
          <div>Gradient: {gradient}</div>
          <div>In View: {isInView ? 'Yes' : 'No'}</div>
          <div>Animating: {isAnimating ? 'Yes' : 'No'}</div>
          <div>Hovered: {isHovered ? 'Yes' : 'No'}</div>
        </div>
      )}
    </>
  );
});

AnimatedText.displayName = 'AnimatedText';

export default AnimatedText;