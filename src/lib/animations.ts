import { Variants } from 'framer-motion';

// Fade animations
export const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' }
  }
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.8, ease: 'easeOut' }
  }
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.8, ease: 'easeOut' }
  }
};

// Scale animations
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

// Stagger animations
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

// Hover animations
export const hoverLift: Variants = {
  initial: { y: 0 },
  hover: { 
    y: -8,
    transition: { duration: 0.3, ease: 'easeOut' }
  }
};

export const hoverScale: Variants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: { duration: 0.3, ease: 'easeOut' }
  }
};

export const hoverRotate: Variants = {
  initial: { rotate: 0 },
  hover: { 
    rotate: 5,
    transition: { duration: 0.3, ease: 'easeOut' }
  }
};

// Button animations
export const buttonPress: Variants = {
  initial: { scale: 1 },
  tap: { scale: 0.95 }
};

export const buttonHover: Variants = {
  initial: { 
    scale: 1,
    boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.1)'
  },
  hover: { 
    scale: 1.02,
    boxShadow: '0 10px 25px 0 rgba(0, 0, 0, 0.15)',
    transition: { duration: 0.2 }
  }
};

// Text animations
export const typewriterContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.03
    }
  }
};

export const typewriterText: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.1 }
  }
};

// Page transitions
export const pageTransition = {
  initial: { opacity: 0, x: -200 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 200 },
  transition: { duration: 0.3, ease: 'easeInOut' }
};

// Complex animations
export const floatingElement: Variants = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      ease: 'easeInOut',
      repeat: Infinity
    }
  }
};

export const pulseGlow: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      ease: 'easeInOut',
      repeat: Infinity
    }
  }
};

// Scroll-triggered animations
export const scrollFadeIn = {
  initial: { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.8, ease: 'easeOut' }
};

export const scrollSlideIn = (direction: 'left' | 'right' = 'left') => ({
  initial: { 
    opacity: 0, 
    x: direction === 'left' ? -50 : 50 
  },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.8, ease: 'easeOut' }
});

// Custom easing curves
export const customEasing = {
  gentle: [0.25, 0.46, 0.45, 0.94],
  bounce: [0.68, -0.55, 0.265, 1.55],
  anticipate: [0.215, 0.61, 0.355, 1],
  backOut: [0.175, 0.885, 0.32, 1.275]
};

// Animation presets
export const animationPresets = {
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  scaleIn,
  hoverLift,
  hoverScale,
  buttonPress,
  buttonHover,
  scrollFadeIn,
  staggerContainer,
  staggerItem,
  typewriterContainer,
  typewriterText,
  floatingElement,
  pulseGlow
};