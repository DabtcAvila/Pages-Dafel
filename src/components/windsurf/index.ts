/**
 * WINDSURF COMPONENTS INDEX
 * Centralized exports for all Windsurf animation components
 * Optimized for Next.js 14 with TypeScript support
 */

// ===== MAIN COMPONENTS =====
import HeroWindsurf, { type HeroWindsurfProps } from './HeroWindsurf';
import RainbowBackground, { type RainbowBackgroundProps } from './RainbowBackground';
import AnimatedText, { type AnimatedTextProps } from './AnimatedText';
import WindsurfButton, { type WindsurfButtonProps } from './WindsurfButton';
import WindsurfWaveBackground, { type WindsurfWaveBackgroundProps } from './WindsurfWaveBackground';

export { HeroWindsurf, type HeroWindsurfProps };
export { RainbowBackground, type RainbowBackgroundProps };
export { AnimatedText, type AnimatedTextProps };
export { WindsurfButton, type WindsurfButtonProps };
export { WindsurfWaveBackground, type WindsurfWaveBackgroundProps };

// ===== RE-EXPORTS FROM WINDSURF ANIMATIONS =====
import {
  RainbowBackground as WindsurfRainbowBackground,
  RainbowText,
  InteractiveElement,
  ScrollAnimated,
  RainbowBorder,
  ParallaxScroll,
  PerformanceContainer,
  useRainbowColors,
  useAnimationControl
} from '../WindsurfAnimations';

export {
  WindsurfRainbowBackground,
  RainbowText,
  InteractiveElement,
  ScrollAnimated,
  RainbowBorder,
  ParallaxScroll,
  PerformanceContainer,
  useRainbowColors,
  useAnimationControl
};

// ===== RE-EXPORTS FROM WINDSURF PROVIDER =====
export {
  WindsurfProvider,
  useWindsurfContext,
  type WindsurfContextValue,
  type WindsurfProviderProps
} from '../WindsurfProvider';

// ===== UTILITY TYPES =====
export type WindsurfVariant = 'primary' | 'secondary' | 'ghost' | 'rainbow' | 'cosmic' | 'neon';
export type WindsurfSize = 'small' | 'medium' | 'large' | 'xl';
export type WindsurfIntensity = 'none' | 'low' | 'medium' | 'high' | 'ultra';
export type WindsurfSpeed = 'slow' | 'normal' | 'fast' | 'ultra';
export type WindsurfDirection = 'horizontal' | 'vertical' | 'diagonal' | 'radial' | 'spiral';
export type WindsurfGradient = 'rainbow' | 'sunset' | 'ocean' | 'forest' | 'cosmic' | 'fire' | 'none';
export type WindsurfAnimation = 'typewriter' | 'wave' | 'glow' | 'bounce' | 'slide' | 'fade' | 'split' | 'morph';

// ===== COMPONENT COLLECTIONS =====
export const WindsurfComponents = {
  HeroWindsurf,
  RainbowBackground,
  AnimatedText,
  WindsurfButton,
  WindsurfWaveBackground
} as const;

export const WindsurfAnimationComponents = {
  RainbowBackground,
  RainbowText,
  InteractiveElement,
  ScrollAnimated,
  RainbowBorder,
  ParallaxScroll,
  PerformanceContainer
} as const;

// ===== DEFAULT CONFIGURATIONS =====
export const DEFAULT_WINDSURF_CONFIG = {
  intensity: 'medium' as WindsurfIntensity,
  speed: 'normal' as WindsurfSpeed,
  direction: 'horizontal' as WindsurfDirection,
  gradient: 'rainbow' as WindsurfGradient,
  animation: 'fade' as WindsurfAnimation,
  variant: 'primary' as WindsurfVariant,
  size: 'medium' as WindsurfSize,
  interactive: true,
  disabled: false,
  glowIntensity: 'medium' as WindsurfIntensity
} as const;

// ===== PRESET CONFIGURATIONS =====
export const WINDSURF_PRESETS = {
  hero: {
    backgroundIntensity: 'high' as WindsurfIntensity,
    animationSpeed: 'normal' as WindsurfSpeed,
    showParticles: true,
    gradient: 'rainbow' as WindsurfGradient
  },
  button: {
    variant: 'rainbow' as WindsurfVariant,
    size: 'large' as WindsurfSize,
    glowIntensity: 'high' as WindsurfIntensity,
    animationType: 'scale' as const
  },
  text: {
    gradient: 'rainbow' as WindsurfGradient,
    animationType: 'wave' as WindsurfAnimation,
    interactive: true,
    speed: 'normal' as WindsurfSpeed
  },
  background: {
    intensity: 'high' as WindsurfIntensity,
    speed: 'fast' as WindsurfSpeed,
    direction: 'diagonal' as WindsurfDirection,
    gradient: 'cosmic' as WindsurfGradient,
    animationType: 'plasma' as const,
    particles: true
  }
} as const;

// ===== HELPER FUNCTIONS =====
export const createWindsurfConfig = <T extends Partial<typeof DEFAULT_WINDSURF_CONFIG>>(
  overrides: T
): typeof DEFAULT_WINDSURF_CONFIG & T => ({
  ...DEFAULT_WINDSURF_CONFIG,
  ...overrides
});

export const getPresetConfig = <K extends keyof typeof WINDSURF_PRESETS>(
  preset: K
): typeof WINDSURF_PRESETS[K] => WINDSURF_PRESETS[preset];

// ===== VERSION INFO =====
export const WINDSURF_VERSION = '1.0.0';
export const WINDSURF_BUILD_DATE = new Date().toISOString();

// ===== FEATURE FLAGS =====
export const WINDSURF_FEATURES = {
  ADVANCED_ANIMATIONS: true,
  PARTICLE_SYSTEM: true,
  INTERACTIVE_EFFECTS: true,
  PERFORMANCE_MONITORING: true,
  DEBUG_MODE: process.env.NODE_ENV === 'development',
  GPU_ACCELERATION: true,
  ACCESSIBILITY_SUPPORT: true
} as const;