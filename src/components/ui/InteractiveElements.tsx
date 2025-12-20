'use client';

import React from 'react';
import { motion, HTMLMotionProps, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { hoverAnimations, tapAnimations, springs } from '@/lib/animations';

// === MAGNETIC BUTTON ===
export interface MagneticButtonProps extends HTMLMotionProps<'button'> {
  strength?: number;
  children?: React.ReactNode;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  strength = 0.3,
  className,
  children,
  ...props
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, springs.gentle);
  const springY = useSpring(y, springs.gentle);

  const handleMouseMove = (event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (event.clientX - centerX) * strength;
    const deltaY = (event.clientY - centerY) * strength;
    
    x.set(deltaX);
    y.set(deltaY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      className={cn('btn btn-primary relative overflow-hidden', className)}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={springs.gentle}
      {...props}
    >
      {children}
    </motion.button>
  );
};

// === TILT CARD ===
export interface TiltCardProps extends HTMLMotionProps<'div'> {
  intensity?: number;
  children?: React.ReactNode;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  intensity = 10,
  className,
  children,
  ...props
}) => {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, springs.gentle);
  const springRotateY = useSpring(rotateY, springs.gentle);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (event.clientX - centerX) / rect.width;
    const deltaY = (event.clientY - centerY) / rect.height;
    
    rotateX.set(-deltaY * intensity);
    rotateY.set(deltaX * intensity);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      className={cn('card perspective-1000', className)}
      style={{ 
        rotateX: springRotateX, 
        rotateY: springRotateY,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      transition={springs.gentle}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// === RIPPLE BUTTON ===
export interface RippleButtonProps extends HTMLMotionProps<'button'> {
  rippleColor?: string;
  children?: React.ReactNode;
}

export const RippleButton: React.FC<RippleButtonProps> = ({
  rippleColor = 'rgba(255, 255, 255, 0.3)',
  className,
  children,
  onClick,
  ...props
}) => {
  const [ripples, setRipples] = React.useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
  }>>([]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const size = Math.max(rect.width, rect.height) * 2;
    
    const newRipple = {
      id: Date.now(),
      x,
      y,
      size,
    };
    
    setRipples(prev => [...prev, newRipple]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 600);
    
    onClick?.(event);
  };

  return (
    <motion.button
      className={cn('btn btn-primary relative overflow-hidden', className)}
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={springs.gentle}
      {...props}
    >
      {children}
      {ripples.map(ripple => (
        <motion.span
          key={ripple.id}
          className="absolute pointer-events-none rounded-full"
          style={{
            left: ripple.x - ripple.size / 2,
            top: ripple.y - ripple.size / 2,
            width: ripple.size,
            height: ripple.size,
            backgroundColor: rippleColor,
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 1, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ))}
    </motion.button>
  );
};

// === GLOW CARD ===
export interface GlowCardProps extends HTMLMotionProps<'div'> {
  glowColor?: string;
  children?: React.ReactNode;
}

export const GlowCard: React.FC<GlowCardProps> = ({
  glowColor = 'var(--color-primary-500)',
  className,
  children,
  ...props
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  };

  const glowX = useTransform(x, value => `${value}px`);
  const glowY = useTransform(y, value => `${value}px`);

  return (
    <motion.div
      className={cn('card relative overflow-hidden group', className)}
      onMouseMove={handleMouseMove}
      whileHover={{ scale: 1.02 }}
      transition={springs.gentle}
      {...props}
    >
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle 100px at ${glowX} ${glowY}, ${glowColor}20, transparent)`,
        }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

// === FLOATING ACTION BUTTON ===
export interface FloatingActionButtonProps extends HTMLMotionProps<'button'> {
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  children?: React.ReactNode;
}

const fabSizes = {
  sm: 'w-12 h-12',
  md: 'w-14 h-14',
  lg: 'w-16 h-16',
};

const fabPositions = {
  'bottom-right': 'fixed bottom-6 right-6',
  'bottom-left': 'fixed bottom-6 left-6',
  'top-right': 'fixed top-6 right-6',
  'top-left': 'fixed top-6 left-6',
};

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon,
  size = 'md',
  position = 'bottom-right',
  className,
  children,
  ...props
}) => {
  return (
    <motion.button
      className={cn(
        'btn btn-primary rounded-full shadow-2xl z-fixed',
        fabSizes[size],
        fabPositions[position],
        className
      )}
      whileHover={{ 
        scale: 1.1,
        rotate: 10,
        boxShadow: '0 20px 40px rgba(59, 130, 246, 0.4)',
      }}
      whileTap={{ scale: 0.9 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={springs.bouncy}
      {...props}
    >
      {icon || children}
    </motion.button>
  );
};

// === MORPHING BUTTON ===
export interface MorphingButtonProps extends HTMLMotionProps<'button'> {
  morphTo?: 'loading' | 'success' | 'error';
  children?: React.ReactNode;
}

export const MorphingButton: React.FC<MorphingButtonProps> = ({
  morphTo,
  className,
  children,
  ...props
}) => {
  const variants = {
    default: {
      width: 'auto',
      borderRadius: 'var(--radius-lg)',
    },
    loading: {
      width: '48px',
      borderRadius: '50%',
    },
    success: {
      width: '48px',
      borderRadius: '50%',
      backgroundColor: 'var(--color-accent-500)',
    },
    error: {
      width: '48px',
      borderRadius: '50%',
      backgroundColor: 'var(--color-error-500)',
    },
  };

  const iconVariants = {
    default: { opacity: 0, scale: 0 },
    loading: { opacity: 1, scale: 1, rotate: 360 },
    success: { opacity: 1, scale: 1 },
    error: { opacity: 1, scale: 1 },
  };

  const textVariants = {
    default: { opacity: 1, scale: 1 },
    loading: { opacity: 0, scale: 0 },
    success: { opacity: 0, scale: 0 },
    error: { opacity: 0, scale: 0 },
  };

  const renderIcon = () => {
    switch (morphTo) {
      case 'loading':
        return (
          <motion.div
            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        );
      case 'success':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <motion.path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <motion.path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <motion.button
      className={cn('btn btn-primary relative flex items-center justify-center overflow-hidden', className)}
      variants={variants}
      initial="default"
      animate={morphTo || 'default'}
      transition={springs.gentle}
      {...props}
    >
      <motion.span
        variants={textVariants}
        initial="default"
        animate={morphTo || 'default'}
        className="flex items-center gap-2"
      >
        {children}
      </motion.span>
      
      <motion.div
        variants={iconVariants}
        initial="default"
        animate={morphTo || 'default'}
        className="absolute inset-0 flex items-center justify-center"
      >
        {renderIcon()}
      </motion.div>
    </motion.button>
  );
};

// === SLIDING PANEL ===
export interface SlidingPanelProps {
  isOpen: boolean;
  onClose: () => void;
  direction?: 'left' | 'right' | 'top' | 'bottom';
  size?: 'sm' | 'md' | 'lg' | 'full';
  overlay?: boolean;
  children?: React.ReactNode;
}

const panelSizes = {
  sm: '320px',
  md: '480px',
  lg: '640px',
  full: '100%',
};

const panelDirections = {
  left: {
    initial: { x: '-100%' },
    animate: { x: 0 },
    exit: { x: '-100%' },
    className: 'left-0 top-0 h-full',
  },
  right: {
    initial: { x: '100%' },
    animate: { x: 0 },
    exit: { x: '100%' },
    className: 'right-0 top-0 h-full',
  },
  top: {
    initial: { y: '-100%' },
    animate: { y: 0 },
    exit: { y: '-100%' },
    className: 'top-0 left-0 w-full',
  },
  bottom: {
    initial: { y: '100%' },
    animate: { y: 0 },
    exit: { y: '100%' },
    className: 'bottom-0 left-0 w-full',
  },
};

export const SlidingPanel: React.FC<SlidingPanelProps> = ({
  isOpen,
  onClose,
  direction = 'right',
  size = 'md',
  overlay = true,
  children,
}) => {
  const panelConfig = panelDirections[direction];
  const isVertical = direction === 'top' || direction === 'bottom';
  const sizeStyle = isVertical 
    ? { height: panelSizes[size] }
    : { width: panelSizes[size] };

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-modal">
      {overlay && (
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
      )}
      
      <motion.div
        className={cn(
          'absolute bg-background border-border shadow-2xl',
          panelConfig.className,
          isVertical ? 'border-t border-b' : 'border-l border-r'
        )}
        style={sizeStyle}
        variants={panelConfig}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={springs.gentle}
      >
        {children}
      </motion.div>
    </div>
  );
};

// === PRESET INTERACTIVE COMBINATIONS ===
export const InteractiveDemoCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <TiltCard className="p-6">
    <GlowCard>
      {children}
    </GlowCard>
  </TiltCard>
);

export const PremiumActionButton: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({ 
  children, 
  onClick 
}) => (
  <RippleButton onClick={onClick}>
    <MagneticButton strength={0.2}>
      {children}
    </MagneticButton>
  </RippleButton>
);