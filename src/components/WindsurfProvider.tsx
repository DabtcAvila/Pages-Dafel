/**
 * WINDSURF PROVIDER
 * Context provider for the WindsurfEngine animation system
 * Handles initialization, configuration, and global state management
 */

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import WindsurfEngine, { type WindsurfEngineOptions } from '@/lib/windsurf-engine';

interface WindsurfContextType {
  engine: WindsurfEngine | null;
  isReady: boolean;
  isEnabled: boolean;
  toggleAnimations: () => void;
  updateConfig: (config: Partial<WindsurfEngineOptions>) => void;
}

const WindsurfContext = createContext<WindsurfContextType>({
  engine: null,
  isReady: false,
  isEnabled: true,
  toggleAnimations: () => {},
  updateConfig: () => {}
});

interface WindsurfProviderProps {
  children: React.ReactNode;
  config?: WindsurfEngineOptions;
  enableInProduction?: boolean;
}

export function WindsurfProvider({ 
  children, 
  config,
  enableInProduction = true 
}: WindsurfProviderProps) {
  const [engine, setEngine] = useState<WindsurfEngine | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);

  // Default configuration optimized for production
  const defaultConfig: WindsurfEngineOptions = {
    colorConfig: {
      hue: 0,
      saturation: 96,
      lightness: 55
    },
    animationConfig: {
      duration: 3000,
      easing: 'cubic-bezier(0.4, 0, 0.6, 1)',
      delay: 0,
      repeat: 'infinite',
      direction: 'normal'
    },
    performanceConfig: {
      maxFPS: 60,
      gpuAcceleration: true,
      reducedMotion: false,
      batteryAware: true,
      memoryThreshold: 150 * 1024 * 1024 // 150MB for production
    },
    scrollConfig: {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
      velocityTracking: true,
      directionTracking: true
    },
    interactionConfig: {
      mouseTracking: true,
      touchSupport: true,
      rippleEffect: true,
      hoverEnhancement: true
    },
    debug: process.env.NODE_ENV === 'development'
  };

  // Merge user config with defaults
  const mergedConfig = {
    ...defaultConfig,
    ...config,
    colorConfig: { ...defaultConfig.colorConfig, ...config?.colorConfig },
    animationConfig: { ...defaultConfig.animationConfig, ...config?.animationConfig },
    performanceConfig: { ...defaultConfig.performanceConfig, ...config?.performanceConfig },
    scrollConfig: { ...defaultConfig.scrollConfig, ...config?.scrollConfig },
    interactionConfig: { ...defaultConfig.interactionConfig, ...config?.interactionConfig }
  };

  useEffect(() => {
    // Only initialize in browser environment
    if (typeof window === 'undefined') return;

    // Check if animations should be enabled
    const shouldEnable = process.env.NODE_ENV === 'development' || enableInProduction;
    if (!shouldEnable) {
      setIsEnabled(false);
      return;
    }

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsEnabled(false);
      // Add global class to disable animations
      document.documentElement.classList.add('windsurf-pause-animations');
      return;
    }

    let engineInstance: WindsurfEngine | null = null;

    const initializeEngine = async () => {
      try {
        engineInstance = WindsurfEngine.getInstance(mergedConfig);
        await engineInstance.init();
        
        setEngine(engineInstance);
        setIsReady(true);

        if (mergedConfig.debug) {
          console.log('WindsurfEngine initialized successfully');
        }

      } catch (error) {
        console.warn('Failed to initialize WindsurfEngine:', error);
        setIsEnabled(false);
        
        // Add fallback class for static animations
        document.documentElement.classList.add('windsurf-fallback-mode');
      }
    };

    initializeEngine();

    return () => {
      if (engineInstance) {
        engineInstance.destroy();
      }
    };
  }, []);

  // Listen for reduced motion changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsEnabled(false);
        document.documentElement.classList.add('windsurf-pause-animations');
      } else {
        setIsEnabled(true);
        document.documentElement.classList.remove('windsurf-pause-animations');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const toggleAnimations = () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    
    if (newState) {
      document.documentElement.classList.remove('windsurf-pause-animations');
    } else {
      document.documentElement.classList.add('windsurf-pause-animations');
    }
  };

  const updateConfig = (newConfig: Partial<WindsurfEngineOptions>) => {
    if (engine && isReady) {
      // For now, config updates require re-initialization
      console.warn('Config updates require page refresh. This will be improved in future versions.');
    }
  };

  const contextValue: WindsurfContextType = {
    engine,
    isReady,
    isEnabled,
    toggleAnimations,
    updateConfig
  };

  return (
    <WindsurfContext.Provider value={contextValue}>
      {children}
    </WindsurfContext.Provider>
  );
}

export const useWindsurfContext = () => {
  const context = useContext(WindsurfContext);
  if (!context) {
    throw new Error('useWindsurfContext must be used within WindsurfProvider');
  }
  return context;
};

// Enhanced version of the useWindsurfEngine hook that uses context
export function useWindsurfEngineContext() {
  const context = useWindsurfContext();
  return {
    engine: context.engine,
    isReady: context.isReady && context.isEnabled,
    isEnabled: context.isEnabled,
    toggleAnimations: context.toggleAnimations,
    updateConfig: context.updateConfig
  };
}

export default WindsurfProvider;