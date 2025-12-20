/**
 * WINDSURF ANIMATION ENGINE - Agent 3 Implementation
 * Complete JavaScript animation system with dynamic color cycling, performance optimization,
 * and advanced interaction handling for Next.js 14 with TypeScript
 * 
 * Features:
 * - Dynamic Color Cycling Engine with CSS Houdini support
 * - Animation Orchestrator with timeline control
 * - Scroll-triggered effects with Intersection Observer
 * - Performance optimization with RAF and GPU acceleration
 * - User interaction handlers with accessibility support
 * - Modular and tree-shakable architecture
 */

// import { trackWebVitals, type WebVitalsMetric } from './performance';

// ===== TYPES AND INTERFACES =====

export interface ColorConfig {
  hue: number;
  saturation: number;
  lightness: number;
}

export interface AnimationConfig {
  duration: number;
  easing: string;
  delay: number;
  repeat: number | 'infinite';
  direction: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
}

export interface PerformanceConfig {
  maxFPS: number;
  gpuAcceleration: boolean;
  reducedMotion: boolean;
  batteryAware: boolean;
  memoryThreshold: number;
}

export interface ScrollConfig {
  threshold: number;
  rootMargin: string;
  velocityTracking: boolean;
  directionTracking: boolean;
}

export interface InteractionConfig {
  mouseTracking: boolean;
  touchSupport: boolean;
  rippleEffect: boolean;
  hoverEnhancement: boolean;
}

export interface WindsurfEngineOptions {
  colorConfig?: Partial<ColorConfig>;
  animationConfig?: Partial<AnimationConfig>;
  performanceConfig?: Partial<PerformanceConfig>;
  scrollConfig?: Partial<ScrollConfig>;
  interactionConfig?: Partial<InteractionConfig>;
  debug?: boolean;
}

// ===== CORE ENGINE CLASS =====

export class WindsurfEngine {
  private static instance: WindsurfEngine | null = null;
  private isInitialized = false;
  private animationId: number | null = null;
  private colorCycleId: NodeJS.Timeout | null = null;
  private observers: Map<Element, IntersectionObserver> = new Map();
  private activeAnimations: Map<string, Animation> = new Map();
  private performanceMonitor: PerformanceMonitor;
  private colorSystem: ColorSystem;
  private animationOrchestrator: AnimationOrchestrator;
  private scrollEffects: ScrollEffects;
  private interactionHandler: InteractionHandler;

  // Configuration
  private config: Required<WindsurfEngineOptions>;
  private readonly DEFAULT_CONFIG: Required<WindsurfEngineOptions> = {
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
      memoryThreshold: 100 * 1024 * 1024 // 100MB
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
    debug: false
  };

  private constructor(options: WindsurfEngineOptions = {}) {
    // Merge configuration
    this.config = this.mergeConfig(options);

    // Initialize subsystems
    this.performanceMonitor = new PerformanceMonitor(this.config.performanceConfig);
    this.colorSystem = new ColorSystem(this.config.colorConfig as ColorConfig);
    this.animationOrchestrator = new AnimationOrchestrator(this.config.animationConfig);
    this.scrollEffects = new ScrollEffects(this.config.scrollConfig);
    this.interactionHandler = new InteractionHandler(this.config.interactionConfig);

    this.log('WindsurfEngine initialized with config:', this.config);
  }

  // Singleton pattern
  static getInstance(options?: WindsurfEngineOptions): WindsurfEngine {
    if (!WindsurfEngine.instance) {
      WindsurfEngine.instance = new WindsurfEngine(options);
    }
    return WindsurfEngine.instance;
  }

  // Public API
  async init(): Promise<void> {
    if (this.isInitialized) {
      this.log('WindsurfEngine already initialized');
      return;
    }

    try {
      // Check browser support
      await this.checkBrowserSupport();

      // Initialize performance monitoring
      await this.performanceMonitor.init();

      // Initialize subsystems
      await Promise.all([
        this.colorSystem.init(),
        this.animationOrchestrator.init(),
        this.scrollEffects.init(),
        this.interactionHandler.init()
      ]);

      // Start main animation loop
      this.startAnimationLoop();

      // Start color cycling
      this.startColorCycling();

      this.isInitialized = true;
      this.log('WindsurfEngine fully initialized');

    } catch (error) {
      console.error('Failed to initialize WindsurfEngine:', error);
      throw error;
    }
  }

  destroy(): void {
    if (!this.isInitialized) return;

    // Stop animation loop
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    // Stop color cycling
    if (this.colorCycleId) {
      clearInterval(this.colorCycleId);
      this.colorCycleId = null;
    }

    // Cleanup subsystems
    this.performanceMonitor.destroy();
    this.colorSystem.destroy();
    this.animationOrchestrator.destroy();
    this.scrollEffects.destroy();
    this.interactionHandler.destroy();

    // Clear observers and animations
    this.observers.clear();
    this.activeAnimations.clear();

    this.isInitialized = false;
    WindsurfEngine.instance = null;

    this.log('WindsurfEngine destroyed');
  }

  // Animation API
  createAnimation(element: Element, keyframes: Keyframe[], options?: KeyframeAnimationOptions): string {
    return this.animationOrchestrator.createAnimation(element, keyframes, options);
  }

  playAnimation(id: string): void {
    this.animationOrchestrator.playAnimation(id);
  }

  pauseAnimation(id: string): void {
    this.animationOrchestrator.pauseAnimation(id);
  }

  stopAnimation(id: string): void {
    this.animationOrchestrator.stopAnimation(id);
  }

  // Color API
  setColorScheme(colors: ColorConfig[]): void {
    this.colorSystem.setColorScheme(colors);
  }

  getCurrentColors(): ColorConfig[] {
    return this.colorSystem.getCurrentColors();
  }

  // Scroll API
  observeScrollElement(element: Element, callback: (entry: IntersectionObserverEntry) => void): void {
    this.scrollEffects.observe(element, callback);
  }

  unobserveScrollElement(element: Element): void {
    this.scrollEffects.unobserve(element);
  }

  // Performance API
  getPerformanceMetrics(): PerformanceMetrics {
    return this.performanceMonitor.getMetrics();
  }

  // Interaction API
  enableInteractions(element: Element): void {
    this.interactionHandler.enable(element);
  }

  disableInteractions(element: Element): void {
    this.interactionHandler.disable(element);
  }

  // Private methods
  private mergeConfig(options: WindsurfEngineOptions): Required<WindsurfEngineOptions> {
    return {
      colorConfig: { ...this.DEFAULT_CONFIG.colorConfig, ...options.colorConfig },
      animationConfig: { ...this.DEFAULT_CONFIG.animationConfig, ...options.animationConfig },
      performanceConfig: { ...this.DEFAULT_CONFIG.performanceConfig, ...options.performanceConfig },
      scrollConfig: { ...this.DEFAULT_CONFIG.scrollConfig, ...options.scrollConfig },
      interactionConfig: { ...this.DEFAULT_CONFIG.interactionConfig, ...options.interactionConfig },
      debug: options.debug ?? this.DEFAULT_CONFIG.debug
    };
  }

  private async checkBrowserSupport(): Promise<void> {
    const missing: string[] = [];

    if (!window.requestAnimationFrame) missing.push('requestAnimationFrame');
    if (!window.IntersectionObserver) missing.push('IntersectionObserver');
    if (!window.CSS?.supports?.('transform', 'translateZ(0)')) missing.push('CSS transforms');

    if (missing.length > 0) {
      throw new Error(`Browser missing required features: ${missing.join(', ')}`);
    }
  }

  private startAnimationLoop(): void {
    const loop = (timestamp: number) => {
      if (!this.isInitialized) return;

      // Update subsystems
      this.performanceMonitor.update(timestamp);
      this.animationOrchestrator.update(timestamp);
      this.scrollEffects.update(timestamp);
      this.interactionHandler.update(timestamp);

      this.animationId = requestAnimationFrame(loop);
    };

    this.animationId = requestAnimationFrame(loop);
  }

  private startColorCycling(): void {
    this.colorCycleId = setInterval(() => {
      if (this.performanceMonitor.canAnimate()) {
        this.colorSystem.cycleColors();
      }
    }, this.config.animationConfig.duration);
  }

  private log(...args: any[]): void {
    if (this.config.debug) {
      console.log('[WindsurfEngine]', ...args);
    }
  }
}

// ===== COLOR SYSTEM =====

class ColorSystem {
  private currentColors: ColorConfig[] = [];
  private colorIndex = 0;
  private isHoudiniSupported = false;
  
  constructor(private config: ColorConfig) {
    this.initializeColors();
  }

  async init(): Promise<void> {
    this.isHoudiniSupported = this.checkHoudiniSupport();
    
    if (this.isHoudiniSupported) {
      await this.registerHoudiniProperties();
    }
  }

  destroy(): void {
    // Cleanup if needed
  }

  private initializeColors(): void {
    // Create 8-gradient rainbow system
    this.currentColors = [
      { hue: 0, saturation: 96, lightness: 55 },    // Red
      { hue: 25, saturation: 100, lightness: 50 },  // Orange
      { hue: 60, saturation: 100, lightness: 50 },  // Yellow
      { hue: 130, saturation: 100, lightness: 40 }, // Green
      { hue: 180, saturation: 100, lightness: 40 }, // Cyan
      { hue: 230, saturation: 100, lightness: 45 }, // Blue
      { hue: 260, saturation: 100, lightness: 55 }, // Violet
      { hue: 300, saturation: 100, lightness: 50 }  // Magenta
    ];
  }

  private checkHoudiniSupport(): boolean {
    return !!(window.CSS && (CSS as any).registerProperty);
  }

  private async registerHoudiniProperties(): Promise<void> {
    try {
      for (let i = 1; i <= 8; i++) {
        (CSS as any).registerProperty({
          name: `--windsurf-color-${i}`,
          syntax: '<color>',
          inherits: false,
          initialValue: this.hslToString(this.currentColors[i - 1])
        });
      }
    } catch (error) {
      console.warn('Failed to register Houdini properties:', error);
      this.isHoudiniSupported = false;
    }
  }

  cycleColors(): void {
    const elements = document.querySelectorAll('.windsurf-rainbow');
    
    elements.forEach(element => {
      this.updateElementColors(element as HTMLElement);
    });

    this.colorIndex = (this.colorIndex + 1) % this.currentColors.length;
  }

  private updateElementColors(element: HTMLElement): void {
    for (let i = 0; i < 8; i++) {
      const colorIndex = (this.colorIndex + i) % this.currentColors.length;
      const color = this.currentColors[colorIndex];
      const colorString = this.hslToString(color);
      
      element.style.setProperty(`--windsurf-color-${i + 1}`, colorString);
    }
  }

  private hslToString(color: ColorConfig): string {
    return `hsl(${color.hue}deg, ${color.saturation}%, ${color.lightness}%)`;
  }

  setColorScheme(colors: ColorConfig[]): void {
    this.currentColors = [...colors];
  }

  getCurrentColors(): ColorConfig[] {
    return [...this.currentColors];
  }
}

// ===== ANIMATION ORCHESTRATOR =====

class AnimationOrchestrator {
  private animations: Map<string, AnimationContext> = new Map();
  private animationId = 0;

  constructor(private config: AnimationConfig) {}

  async init(): Promise<void> {
    // Initialize animation system
  }

  destroy(): void {
    this.animations.forEach(context => {
      if (context.animation) {
        context.animation.cancel();
      }
    });
    this.animations.clear();
  }

  update(timestamp: number): void {
    // Update active animations
    this.animations.forEach((context, id) => {
      if (context.callbacks?.onUpdate) {
        context.callbacks.onUpdate(timestamp);
      }
    });
  }

  createAnimation(element: Element, keyframes: Keyframe[], options?: KeyframeAnimationOptions): string {
    const id = `windsurf-anim-${++this.animationId}`;
    const animation = element.animate(keyframes, {
      duration: this.config.duration,
      easing: this.config.easing,
      delay: this.config.delay,
      iterations: this.config.repeat === 'infinite' ? Infinity : this.config.repeat,
      direction: this.config.direction,
      fill: 'both',
      ...options
    });

    const context: AnimationContext = {
      id,
      element,
      animation,
      keyframes,
      options
    };

    this.animations.set(id, context);

    animation.addEventListener('finish', () => {
      if (context.callbacks?.onComplete) {
        context.callbacks.onComplete();
      }
    });

    return id;
  }

  playAnimation(id: string): void {
    const context = this.animations.get(id);
    if (context?.animation) {
      context.animation.play();
    }
  }

  pauseAnimation(id: string): void {
    const context = this.animations.get(id);
    if (context?.animation) {
      context.animation.pause();
    }
  }

  stopAnimation(id: string): void {
    const context = this.animations.get(id);
    if (context?.animation) {
      context.animation.cancel();
      this.animations.delete(id);
    }
  }
}

interface AnimationContext {
  id: string;
  element: Element;
  animation: Animation;
  keyframes: Keyframe[];
  options?: KeyframeAnimationOptions;
  callbacks?: {
    onUpdate?: (timestamp: number) => void;
    onComplete?: () => void;
  };
}

// ===== SCROLL EFFECTS =====

class ScrollEffects {
  private observer: IntersectionObserver | null = null;
  private scrollVelocity = 0;
  private lastScrollY = 0;
  private scrollDirection: 'up' | 'down' = 'down';
  private callbacks: Map<Element, (entry: IntersectionObserverEntry) => void> = new Map();

  constructor(private config: ScrollConfig) {}

  async init(): Promise<void> {
    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      {
        threshold: this.config.threshold,
        rootMargin: this.config.rootMargin
      }
    );

    if (this.config.velocityTracking) {
      this.setupScrollTracking();
    }
  }

  destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.callbacks.clear();
  }

  update(timestamp: number): void {
    // Update scroll-based effects
  }

  observe(element: Element, callback: (entry: IntersectionObserverEntry) => void): void {
    if (this.observer) {
      this.observer.observe(element);
      this.callbacks.set(element, callback);
    }
  }

  unobserve(element: Element): void {
    if (this.observer) {
      this.observer.unobserve(element);
      this.callbacks.delete(element);
    }
  }

  private handleIntersection(entries: IntersectionObserverEntry[]): void {
    entries.forEach(entry => {
      const callback = this.callbacks.get(entry.target);
      if (callback) {
        callback(entry);
      }

      // Apply scroll-based color effects
      if (entry.isIntersecting && entry.target.classList.contains('windsurf-scroll-effect')) {
        this.applyScrollColorEffect(entry.target as HTMLElement);
      }
    });
  }

  private setupScrollTracking(): void {
    let ticking = false;

    const updateScrollMetrics = () => {
      const currentScrollY = window.scrollY;
      this.scrollVelocity = Math.abs(currentScrollY - this.lastScrollY);
      this.scrollDirection = currentScrollY > this.lastScrollY ? 'down' : 'up';
      this.lastScrollY = currentScrollY;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollMetrics);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  private applyScrollColorEffect(element: HTMLElement): void {
    const velocityFactor = Math.min(this.scrollVelocity / 10, 1);
    const directionMultiplier = this.scrollDirection === 'down' ? 1 : -1;
    
    // Apply velocity-based color intensity
    element.style.setProperty('--scroll-velocity', velocityFactor.toString());
    element.style.setProperty('--scroll-direction', directionMultiplier.toString());
  }
}

// ===== INTERACTION HANDLER =====

class InteractionHandler {
  private mousePosition = { x: 0, y: 0 };
  private isTouch = false;
  private activeElements: Set<Element> = new Set();

  constructor(private config: InteractionConfig) {}

  async init(): Promise<void> {
    if (this.config.mouseTracking) {
      this.setupMouseTracking();
    }

    if (this.config.touchSupport) {
      this.setupTouchTracking();
    }
  }

  destroy(): void {
    // Remove event listeners
    this.activeElements.clear();
  }

  update(timestamp: number): void {
    // Update interaction-based effects
    this.activeElements.forEach(element => {
      this.updateElementInteraction(element as HTMLElement, timestamp);
    });
  }

  enable(element: Element): void {
    this.activeElements.add(element);
    
    if (this.config.hoverEnhancement) {
      this.setupHoverEffects(element as HTMLElement);
    }

    if (this.config.rippleEffect) {
      this.setupRippleEffect(element as HTMLElement);
    }
  }

  disable(element: Element): void {
    this.activeElements.delete(element);
  }

  private setupMouseTracking(): void {
    document.addEventListener('mousemove', (e) => {
      this.mousePosition.x = e.clientX / window.innerWidth;
      this.mousePosition.y = e.clientY / window.innerHeight;
      this.isTouch = false;
    }, { passive: true });
  }

  private setupTouchTracking(): void {
    document.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        this.mousePosition.x = touch.clientX / window.innerWidth;
        this.mousePosition.y = touch.clientY / window.innerHeight;
        this.isTouch = true;
      }
    }, { passive: true });
  }

  private setupHoverEffects(element: HTMLElement): void {
    element.addEventListener('mouseenter', () => {
      element.style.setProperty('--hover-intensity', '1');
    });

    element.addEventListener('mouseleave', () => {
      element.style.setProperty('--hover-intensity', '0');
    });
  }

  private setupRippleEffect(element: HTMLElement): void {
    element.addEventListener('click', (e) => {
      const rect = element.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      element.style.setProperty('--ripple-x', `${x}%`);
      element.style.setProperty('--ripple-y', `${y}%`);
      element.classList.add('windsurf-ripple-active');

      setTimeout(() => {
        element.classList.remove('windsurf-ripple-active');
      }, 600);
    });
  }

  private updateElementInteraction(element: HTMLElement, timestamp: number): void {
    // Update mouse-based color shifts
    const rect = element.getBoundingClientRect();
    const centerX = (rect.left + rect.width / 2) / window.innerWidth;
    const centerY = (rect.top + rect.height / 2) / window.innerHeight;
    
    const distanceX = Math.abs(this.mousePosition.x - centerX);
    const distanceY = Math.abs(this.mousePosition.y - centerY);
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    
    const proximity = Math.max(0, 1 - distance * 2);
    element.style.setProperty('--mouse-proximity', proximity.toString());
  }
}

// ===== PERFORMANCE MONITOR =====

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  gpuMemory: number;
  animationCount: number;
  batteryLevel: number | null;
  isLowPowerMode: boolean;
}

class PerformanceMonitor {
  private fps = 60;
  private frameCount = 0;
  private lastTime = 0;
  private memoryInfo: any = null;
  private batteryInfo: any = null;

  constructor(private config: PerformanceConfig) {}

  async init(): Promise<void> {
    // Setup performance monitoring
    this.setupFPSMonitoring();
    await this.setupBatteryMonitoring();
    this.setupMemoryMonitoring();
  }

  destroy(): void {
    // Cleanup monitoring
  }

  update(timestamp: number): void {
    this.updateFPS(timestamp);
  }

  canAnimate(): boolean {
    if (this.config.reducedMotion && this.prefersReducedMotion()) {
      return false;
    }

    if (this.config.batteryAware && this.isLowBattery()) {
      return false;
    }

    if (this.fps < 30) {
      return false;
    }

    return true;
  }

  getMetrics(): PerformanceMetrics {
    return {
      fps: this.fps,
      memoryUsage: this.getMemoryUsage(),
      gpuMemory: 0, // Would need WebGL context
      animationCount: 0, // Would be tracked by orchestrator
      batteryLevel: this.batteryInfo?.level || null,
      isLowPowerMode: this.isLowBattery()
    };
  }

  private setupFPSMonitoring(): void {
    this.lastTime = performance.now();
  }

  private updateFPS(timestamp: number): void {
    this.frameCount++;
    
    if (timestamp - this.lastTime >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastTime = timestamp;
    }
  }

  private async setupBatteryMonitoring(): Promise<void> {
    try {
      if ('getBattery' in navigator) {
        this.batteryInfo = await (navigator as any).getBattery();
      }
    } catch (error) {
      // Battery API not available
    }
  }

  private setupMemoryMonitoring(): void {
    if ('memory' in performance) {
      this.memoryInfo = (performance as any).memory;
    }
  }

  private prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  private isLowBattery(): boolean {
    if (!this.batteryInfo) return false;
    return this.batteryInfo.level < 0.2 || this.batteryInfo.charging === false;
  }

  private getMemoryUsage(): number {
    if (this.memoryInfo) {
      return this.memoryInfo.usedJSHeapSize;
    }
    return 0;
  }
}

// ===== REACT HOOKS =====

export function useWindsurfEngine(options?: WindsurfEngineOptions) {
  const [engine, setEngine] = useState<WindsurfEngine | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const engineInstance = WindsurfEngine.getInstance(options);
    
    engineInstance.init().then(() => {
      setEngine(engineInstance);
      setIsReady(true);
    }).catch(error => {
      console.error('Failed to initialize WindsurfEngine:', error);
    });

    return () => {
      engineInstance.destroy();
    };
  }, []);

  return { engine, isReady };
}

export function useRainbowElement() {
  const elementRef = useRef<HTMLElement>(null);
  const { engine, isReady } = useWindsurfEngine();

  useEffect(() => {
    if (isReady && engine && elementRef.current) {
      elementRef.current.classList.add('windsurf-rainbow');
      engine.enableInteractions(elementRef.current);

      return () => {
        if (elementRef.current) {
          engine.disableInteractions(elementRef.current);
        }
      };
    }
  }, [engine, isReady]);

  return elementRef;
}

export function useScrollAnimation(callback: (entry: IntersectionObserverEntry) => void) {
  const elementRef = useRef<HTMLElement>(null);
  const { engine, isReady } = useWindsurfEngine();

  useEffect(() => {
    if (isReady && engine && elementRef.current) {
      engine.observeScrollElement(elementRef.current, callback);

      return () => {
        if (elementRef.current) {
          engine.unobserveScrollElement(elementRef.current);
        }
      };
    }
  }, [engine, isReady, callback]);

  return elementRef;
}

// ===== UTILITY FUNCTIONS =====

export function createRainbowGradient(colors?: ColorConfig[]): string {
  const defaultColors: ColorConfig[] = colors || [
    { hue: 0, saturation: 96, lightness: 55 },
    { hue: 25, saturation: 100, lightness: 50 },
    { hue: 60, saturation: 100, lightness: 50 },
    { hue: 130, saturation: 100, lightness: 40 },
    { hue: 180, saturation: 100, lightness: 40 },
    { hue: 230, saturation: 100, lightness: 45 },
    { hue: 260, saturation: 100, lightness: 55 },
    { hue: 300, saturation: 100, lightness: 50 }
  ];

  const colorStops = defaultColors.map((color, index) => {
    const percentage = (index / (defaultColors.length - 1)) * 100;
    return `hsl(${color.hue}deg, ${color.saturation}%, ${color.lightness}%) ${percentage}%`;
  }).join(', ');

  return `linear-gradient(90deg, ${colorStops})`;
}

export function interpolateColors(color1: ColorConfig, color2: ColorConfig, factor: number): ColorConfig {
  return {
    hue: color1.hue + (color2.hue - color1.hue) * factor,
    saturation: color1.saturation + (color2.saturation - color1.saturation) * factor,
    lightness: color1.lightness + (color2.lightness - color1.lightness) * factor
  };
}

// ===== EXPORTS =====

export default WindsurfEngine;

// Import dependencies for hooks
import { useState, useEffect, useRef } from 'react';

// Additional exports for backwards compatibility
export { initScrollAnimations, initRainbowEffects, optimizeAnimations } from './rainbowEffect';