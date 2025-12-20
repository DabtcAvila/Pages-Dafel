/**
 * WINDSURF BUTTON COMPONENT
 * Advanced interactive button with Windsurf effects and animations
 * Features ripple effects, rainbow gradients, and accessibility support
 */

'use client';

import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useWindsurfEngine } from '@/lib/windsurf-engine';

// ===== INTERFACES =====

export interface WindsurfButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'rainbow' | 'cosmic' | 'neon';
  size?: 'small' | 'medium' | 'large' | 'xl';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onHover?: (isHovered: boolean) => void;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
  style?: React.CSSProperties;
  rippleColor?: string;
  glowIntensity?: 'none' | 'low' | 'medium' | 'high';
  animationType?: 'bounce' | 'scale' | 'pulse' | 'shake' | 'rotate' | 'flip';
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

interface RippleProps {
  x: number;
  y: number;
  size: number;
  color: string;
  id: string;
}

// ===== VARIANT CONFIGURATIONS =====

const VARIANT_STYLES = {
  primary: {
    background: 'linear-gradient(135deg, hsl(240deg, 100%, 60%) 0%, hsl(300deg, 100%, 60%) 100%)',
    color: 'white',
    border: 'none',
    shadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
    hoverShadow: '0 8px 25px rgba(0, 0, 0, 0.3)'
  },
  secondary: {
    background: 'linear-gradient(135deg, hsl(200deg, 100%, 60%) 0%, hsl(180deg, 100%, 60%) 100%)',
    color: 'white',
    border: 'none',
    shadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
    hoverShadow: '0 8px 25px rgba(0, 0, 0, 0.3)'
  },
  ghost: {
    background: 'transparent',
    color: 'rgba(255, 255, 255, 0.9)',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    shadow: 'none',
    hoverShadow: '0 4px 15px rgba(255, 255, 255, 0.2)'
  },
  rainbow: {
    background: `linear-gradient(45deg, 
      hsl(0deg, 100%, 60%) 0%, 
      hsl(60deg, 100%, 60%) 16.67%, 
      hsl(120deg, 100%, 60%) 33.33%, 
      hsl(180deg, 100%, 60%) 50%, 
      hsl(240deg, 100%, 60%) 66.67%, 
      hsl(300deg, 100%, 60%) 83.33%, 
      hsl(360deg, 100%, 60%) 100%
    )`,
    color: 'white',
    border: 'none',
    shadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
    hoverShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
    backgroundSize: '200% 200%'
  },
  cosmic: {
    background: `linear-gradient(225deg, 
      hsl(270deg, 100%, 30%) 0%, 
      hsl(300deg, 100%, 40%) 25%, 
      hsl(330deg, 100%, 50%) 50%, 
      hsl(200deg, 100%, 60%) 75%, 
      hsl(270deg, 100%, 30%) 100%
    )`,
    color: 'white',
    border: 'none',
    shadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
    hoverShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
    backgroundSize: '200% 200%'
  },
  neon: {
    background: 'transparent',
    color: 'hsl(180deg, 100%, 50%)',
    border: '2px solid hsl(180deg, 100%, 50%)',
    shadow: '0 0 10px hsl(180deg, 100%, 50%)',
    hoverShadow: '0 0 20px hsl(180deg, 100%, 50%), 0 0 40px hsl(180deg, 100%, 50%)'
  }
};

const SIZE_STYLES = {
  small: {
    padding: '8px 16px',
    fontSize: '14px',
    minHeight: '36px',
    borderRadius: '6px'
  },
  medium: {
    padding: '12px 24px',
    fontSize: '16px',
    minHeight: '44px',
    borderRadius: '8px'
  },
  large: {
    padding: '16px 32px',
    fontSize: '18px',
    minHeight: '52px',
    borderRadius: '10px'
  },
  xl: {
    padding: '20px 40px',
    fontSize: '20px',
    minHeight: '60px',
    borderRadius: '12px'
  }
};

// ===== WINDSURF BUTTON COMPONENT =====

export const WindsurfButton = forwardRef<HTMLButtonElement, WindsurfButtonProps>(({
  children,
  variant = 'primary',
  size = 'medium',
  onClick,
  onHover,
  disabled = false,
  loading = false,
  fullWidth = false,
  className = '',
  style,
  rippleColor,
  glowIntensity = 'medium',
  animationType = 'scale',
  type = 'button',
  ariaLabel,
  startIcon,
  endIcon,
  ...props
}, ref) => {

  // Refs and state
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [ripples, setRipples] = useState<RippleProps[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  
  // Windsurf engine integration
  const { engine, isReady } = useWindsurfEngine();
  
  // Animation controls
  const buttonAnimation = useAnimation();
  const contentAnimation = useAnimation();

  // ===== UTILITY FUNCTIONS =====

  const getVariantStyles = useCallback(() => {
    return VARIANT_STYLES[variant];
  }, [variant]);

  const getSizeStyles = useCallback(() => {
    return SIZE_STYLES[size];
  }, [size]);

  const getGlowStyles = useCallback(() => {
    if (glowIntensity === 'none') return {};
    
    const intensityMap = {
      low: '0 0 5px',
      medium: '0 0 15px',
      high: '0 0 30px'
    };
    
    const variantStyles = getVariantStyles();
    const baseColor = variant === 'neon' ? 'hsl(180deg, 100%, 50%)' : 'rgba(255, 255, 255, 0.5)';
    
    return {
      filter: `drop-shadow(${intensityMap[glowIntensity]} ${baseColor})`
    };
  }, [glowIntensity, variant, getVariantStyles]);

  // ===== RIPPLE EFFECT =====

  const createRipple = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;

    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const newRipple: RippleProps = {
      id: `ripple-${Date.now()}-${Math.random()}`,
      x,
      y,
      size,
      color: rippleColor || 'rgba(255, 255, 255, 0.6)'
    };

    setRipples(prev => [...prev, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
  }, [disabled, loading, rippleColor]);

  // ===== ANIMATION FUNCTIONS =====

  const startHoverAnimation = useCallback(async () => {
    const baseAnimation = {
      scale: 1.05,
      transition: { duration: 0.2, ease: "easeOut" }
    };

    const typeAnimations = {
      bounce: { ...baseAnimation, y: -2 },
      scale: baseAnimation,
      pulse: { scale: [1, 1.05, 1], transition: { duration: 0.6, repeat: Infinity } },
      shake: { x: [-2, 2, -2, 2, 0], transition: { duration: 0.5 } },
      rotate: { ...baseAnimation, rotate: 2 },
      flip: { rotateY: 180, transition: { duration: 0.6 } }
    };

    await buttonAnimation.start(typeAnimations[animationType] || baseAnimation);
  }, [buttonAnimation, animationType]);

  const endHoverAnimation = useCallback(async () => {
    await buttonAnimation.start({
      scale: 1,
      y: 0,
      x: 0,
      rotate: 0,
      rotateY: 0,
      transition: { duration: 0.2, ease: "easeOut" }
    });
  }, [buttonAnimation]);

  const startPressAnimation = useCallback(async () => {
    await contentAnimation.start({
      scale: 0.98,
      transition: { duration: 0.1, ease: "easeInOut" }
    });
  }, [contentAnimation]);

  const endPressAnimation = useCallback(async () => {
    await contentAnimation.start({
      scale: 1,
      transition: { duration: 0.1, ease: "easeInOut" }
    });
  }, [contentAnimation]);

  // ===== EVENT HANDLERS =====

  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) {
      event.preventDefault();
      return;
    }

    createRipple(event);
    onClick?.(event);
  }, [disabled, loading, createRipple, onClick]);

  const handleMouseEnter = useCallback(() => {
    if (disabled) return;

    setIsHovered(true);
    onHover?.(true);
    startHoverAnimation();
  }, [disabled, onHover, startHoverAnimation]);

  const handleMouseLeave = useCallback(() => {
    if (disabled) return;

    setIsHovered(false);
    onHover?.(false);
    endHoverAnimation();
  }, [disabled, onHover, endHoverAnimation]);

  const handleMouseDown = useCallback(() => {
    if (disabled) return;

    setIsPressed(true);
    startPressAnimation();
  }, [disabled, startPressAnimation]);

  const handleMouseUp = useCallback(() => {
    if (disabled) return;

    setIsPressed(false);
    endPressAnimation();
  }, [disabled, endPressAnimation]);

  // ===== COMBINE REFS =====

  const combinedRef = useCallback((node: HTMLButtonElement) => {
    if (buttonRef.current !== node) {
      buttonRef.current = node;
    }
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  }, [ref]);

  // ===== EFFECTS =====

  useEffect(() => {
    if (isReady && engine && buttonRef.current && !disabled) {
      engine.enableInteractions(buttonRef.current);
      
      return () => {
        if (buttonRef.current) {
          engine.disableInteractions(buttonRef.current);
        }
      };
    }
  }, [engine, isReady, disabled]);

  // ===== COMPUTED STYLES =====

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();
  const glowStyles = getGlowStyles();

  const buttonStyles = {
    ...variantStyles,
    ...sizeStyles,
    ...glowStyles,
    width: fullWidth ? '100%' : 'auto',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : loading ? 0.8 : 1,
    position: 'relative' as const,
    overflow: 'hidden' as const,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    outline: 'none',
    ...style
  };

  const combinedClassName = [
    'windsurf-button',
    'windsurf-interactive',
    'windsurf-gpu-optimized',
    disabled ? 'windsurf-disabled' : '',
    loading ? 'windsurf-loading' : '',
    fullWidth ? 'w-full' : '',
    className
  ].filter(Boolean).join(' ');

  // ===== RENDER =====

  return (
    <>
      {/* Inject variant-specific animations */}
      {(variant === 'rainbow' || variant === 'cosmic') && (
        <style jsx>{`
          .windsurf-button.windsurf-rainbow {
            animation: rainbowShift 3s ease-in-out infinite;
          }
          
          .windsurf-button.windsurf-cosmic {
            animation: cosmicShift 4s ease-in-out infinite;
          }
          
          @keyframes rainbowShift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          
          @keyframes cosmicShift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
        `}</style>
      )}

      <motion.button
        ref={combinedRef}
        type={type}
        className={`${combinedClassName} ${variant === 'rainbow' ? 'windsurf-rainbow' : ''} ${variant === 'cosmic' ? 'windsurf-cosmic' : ''}`}
        style={buttonStyles}
        animate={buttonAnimation}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        disabled={disabled || loading}
        aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
        {...props}
      >
        {/* Ripple Effects */}
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.span
              key={ripple.id}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: ripple.x,
                top: ripple.y,
                width: ripple.size,
                height: ripple.size,
                backgroundColor: ripple.color,
              }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          ))}
        </AnimatePresence>

        {/* Button Content */}
        <motion.span
          className="flex items-center justify-center gap-2 relative z-10"
          animate={contentAnimation}
        >
          {startIcon && (
            <span className="flex items-center justify-center">
              {startIcon}
            </span>
          )}

          {loading ? (
            <motion.div
              className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          ) : (
            <span>{children}</span>
          )}

          {endIcon && !loading && (
            <span className="flex items-center justify-center">
              {endIcon}
            </span>
          )}
        </motion.span>

        {/* Hover Glow Effect */}
        <AnimatePresence>
          {isHovered && glowIntensity !== 'none' && (
            <motion.div
              className="absolute inset-0 rounded-[inherit] opacity-50"
              style={{
                background: variantStyles.background,
                filter: 'blur(8px)',
                zIndex: -1
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.3, scale: 1.1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </AnimatePresence>
      </motion.button>

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-8 right-4 bg-black/50 text-white p-1 rounded text-xs font-mono z-50">
          <div>Variant: {variant}</div>
          <div>Size: {size}</div>
          <div>Hovered: {isHovered ? 'Yes' : 'No'}</div>
          <div>Pressed: {isPressed ? 'Yes' : 'No'}</div>
          <div>Ripples: {ripples.length}</div>
        </div>
      )}
    </>
  );
});

WindsurfButton.displayName = 'WindsurfButton';

export default WindsurfButton;