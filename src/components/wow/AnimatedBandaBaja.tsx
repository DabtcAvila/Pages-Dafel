'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, useAnimation, useMotionValue } from 'framer-motion';
import { useWindsurfEngine, useRainbowColors } from '@/lib/windsurf-engine';

// ===== INTERFACES =====

interface ParticleSystem {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  hue: number;
  opacity: number;
}

interface WavePoint {
  x: number;
  y: number;
  phase: number;
  amplitude: number;
  frequency: number;
}

interface AnimatedBandaBajaProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  intensity?: 'low' | 'medium' | 'high' | 'extreme';
  enableParticles?: boolean;
  enableWaves?: boolean;
  enableParallax?: boolean;
  animationSpeed?: number;
  colorPalette?: 'rainbow' | 'sunset' | 'ocean' | 'fire' | 'electric';
}

// ===== COLOR PALETTES =====

const COLOR_PALETTES = {
  rainbow: [
    { h: 0, s: 96, l: 55 },    // Red
    { h: 25, s: 100, l: 50 },  // Orange
    { h: 60, s: 100, l: 50 },  // Yellow
    { h: 130, s: 100, l: 40 }, // Green
    { h: 180, s: 100, l: 40 }, // Cyan
    { h: 230, s: 100, l: 45 }, // Blue
    { h: 260, s: 100, l: 55 }, // Violet
    { h: 300, s: 100, l: 50 }  // Magenta
  ],
  sunset: [
    { h: 0, s: 85, l: 60 },    // Red
    { h: 15, s: 90, l: 55 },   // Red-Orange
    { h: 30, s: 95, l: 50 },   // Orange
    { h: 45, s: 100, l: 55 },  // Golden
    { h: 320, s: 80, l: 60 },  // Pink
    { h: 280, s: 70, l: 65 },  // Purple
  ],
  ocean: [
    { h: 200, s: 100, l: 30 }, // Deep Blue
    { h: 190, s: 90, l: 40 },  // Ocean Blue
    { h: 180, s: 80, l: 50 },  // Cyan
    { h: 170, s: 70, l: 60 },  // Aqua
    { h: 160, s: 60, l: 70 },  // Light Aqua
    { h: 220, s: 85, l: 45 },  // Navy
  ],
  fire: [
    { h: 0, s: 100, l: 50 },   // Pure Red
    { h: 15, s: 100, l: 55 },  // Red-Orange
    { h: 30, s: 100, l: 60 },  // Orange
    { h: 45, s: 100, l: 65 },  // Yellow-Orange
    { h: 60, s: 90, l: 70 },   // Yellow
    { h: 320, s: 80, l: 45 },  // Deep Pink
  ],
  electric: [
    { h: 280, s: 100, l: 50 }, // Electric Purple
    { h: 260, s: 100, l: 55 }, // Violet
    { h: 240, s: 100, l: 60 }, // Blue-Purple
    { h: 200, s: 100, l: 50 }, // Electric Blue
    { h: 180, s: 100, l: 55 }, // Cyan
    { h: 160, s: 100, l: 60 }, // Electric Green
  ]
};

// ===== CANVAS PARTICLE SYSTEM =====

class AdvancedParticleSystem {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: ParticleSystem[] = [];
  private animationId: number | null = null;
  private colors: Array<{ h: number; s: number; l: number }>;
  private mouseX = 0;
  private mouseY = 0;
  private intensity: number;

  constructor(canvas: HTMLCanvasElement, colors: Array<{ h: number; s: number; l: number }>, intensity: number) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.colors = colors;
    this.intensity = intensity;
    this.setupCanvas();
    this.initParticles();
    this.setupMouseTracking();
  }

  private setupCanvas() {
    const updateSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = this.canvas.getBoundingClientRect();
      
      this.canvas.width = rect.width * dpr;
      this.canvas.height = rect.height * dpr;
      
      this.ctx.scale(dpr, dpr);
      this.canvas.style.width = rect.width + 'px';
      this.canvas.style.height = rect.height + 'px';
    };

    updateSize();
    window.addEventListener('resize', updateSize);
  }

  private initParticles() {
    const count = Math.floor(50 * this.intensity);
    this.particles = [];

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
        life: Math.random(),
        hue: Math.random() * 360,
        opacity: Math.random() * 0.8 + 0.2
      });
    }
  }

  private setupMouseTracking() {
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
    });
  }

  private updateParticle(particle: ParticleSystem, deltaTime: number) {
    // Mouse attraction
    const dx = this.mouseX - particle.x;
    const dy = this.mouseY - particle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < 100) {
      const force = (100 - distance) / 100;
      particle.vx += (dx / distance) * force * 0.5;
      particle.vy += (dy / distance) * force * 0.5;
    }

    // Update position
    particle.x += particle.vx * deltaTime;
    particle.y += particle.vy * deltaTime;

    // Boundary wrapping
    if (particle.x < 0) particle.x = this.canvas.width;
    if (particle.x > this.canvas.width) particle.x = 0;
    if (particle.y < 0) particle.y = this.canvas.height;
    if (particle.y > this.canvas.height) particle.y = 0;

    // Life cycle
    particle.life += deltaTime * 0.001;
    if (particle.life > 1) particle.life = 0;

    // Color cycling
    particle.hue += deltaTime * 0.1;
    if (particle.hue > 360) particle.hue = 0;

    // Friction
    particle.vx *= 0.99;
    particle.vy *= 0.99;
  }

  private drawParticle(particle: ParticleSystem) {
    const colorIndex = Math.floor(particle.life * this.colors.length);
    const color = this.colors[colorIndex] || this.colors[0];
    
    this.ctx.save();
    this.ctx.globalAlpha = particle.opacity * (1 - particle.life);
    
    // Create gradient
    const gradient = this.ctx.createRadialGradient(
      particle.x, particle.y, 0,
      particle.x, particle.y, particle.size
    );
    
    gradient.addColorStop(0, `hsl(${color.h}, ${color.s}%, ${color.l}%)`);
    gradient.addColorStop(1, `hsla(${color.h}, ${color.s}%, ${color.l}%, 0)`);
    
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.restore();
  }

  public animate(timestamp: number) {
    const deltaTime = 16; // ~60fps
    
    // Clear canvas with fade effect
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Update and draw particles
    this.particles.forEach(particle => {
      this.updateParticle(particle, deltaTime);
      this.drawParticle(particle);
    });
    
    this.animationId = requestAnimationFrame((ts) => this.animate(ts));
  }

  public start() {
    this.animationId = requestAnimationFrame((ts) => this.animate(ts));
  }

  public stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  public updateColors(colors: Array<{ h: number; s: number; l: number }>) {
    this.colors = colors;
  }
}

// ===== WAVE SYSTEM =====

class FluidWaveSystem {
  private svg: SVGSVGElement;
  private waves: WavePoint[][] = [];
  private animationId: number | null = null;
  private time = 0;

  constructor(svg: SVGSVGElement) {
    this.svg = svg;
    this.initWaves();
  }

  private initWaves() {
    const width = 1200;
    const height = 600;
    const waveCount = 5;
    
    for (let w = 0; w < waveCount; w++) {
      const points: WavePoint[] = [];
      const pointCount = 20;
      
      for (let i = 0; i <= pointCount; i++) {
        points.push({
          x: (i / pointCount) * width,
          y: height * 0.5 + w * 30,
          phase: (i / pointCount) * Math.PI * 2 + w * 0.5,
          amplitude: 40 + w * 10,
          frequency: 0.02 + w * 0.005
        });
      }
      
      this.waves.push(points);
    }
  }

  private updateWave(wave: WavePoint[], waveIndex: number) {
    wave.forEach((point, i) => {
      point.y = 300 + waveIndex * 30 + 
        Math.sin(this.time * point.frequency + point.phase) * point.amplitude +
        Math.sin(this.time * 0.01 + i * 0.1) * 20;
    });
  }

  private createWavePath(wave: WavePoint[]): string {
    let path = `M ${wave[0].x} ${wave[0].y}`;
    
    for (let i = 1; i < wave.length - 1; i++) {
      const currentPoint = wave[i];
      const nextPoint = wave[i + 1];
      const controlX = currentPoint.x + (nextPoint.x - currentPoint.x) * 0.5;
      
      path += ` Q ${currentPoint.x} ${currentPoint.y} ${controlX} ${(currentPoint.y + nextPoint.y) * 0.5}`;
    }
    
    const lastPoint = wave[wave.length - 1];
    path += ` Q ${lastPoint.x} ${lastPoint.y} ${lastPoint.x} ${lastPoint.y}`;
    path += ` L ${lastPoint.x} 800 L ${wave[0].x} 800 Z`;
    
    return path;
  }

  public animate() {
    this.time += 1;
    
    this.waves.forEach((wave, index) => {
      this.updateWave(wave, index);
      
      const pathElement = this.svg.querySelector(`#wave-${index}`) as SVGPathElement;
      if (pathElement) {
        pathElement.setAttribute('d', this.createWavePath(wave));
      }
    });
    
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  public start() {
    this.animate();
  }

  public stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
}

// ===== MAIN COMPONENT =====

export const AnimatedBandaBaja: React.FC<AnimatedBandaBajaProps> = ({
  children,
  className = '',
  style,
  intensity = 'high',
  enableParticles = true,
  enableWaves = true,
  enableParallax = true,
  animationSpeed = 1,
  colorPalette = 'rainbow'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const particleSystemRef = useRef<AdvancedParticleSystem | null>(null);
  const waveSystemRef = useRef<FluidWaveSystem | null>(null);
  
  const [isVisible, setIsVisible] = useState(false);
  const [currentColors, setCurrentColors] = useState(COLOR_PALETTES[colorPalette]);
  
  const { engine, isReady } = useWindsurfEngine();
  const { colors, updateColors } = useRainbowColors();
  
  const { scrollY } = useScroll();
  const controls = useAnimation();
  
  // Parallax transforms
  const y1 = useTransform(scrollY, [0, 1000], ['0%', enableParallax ? '50%' : '0%']);
  const y2 = useTransform(scrollY, [0, 1000], ['0%', enableParallax ? '-30%' : '0%']);
  const y3 = useTransform(scrollY, [0, 1000], ['0%', enableParallax ? '20%' : '0%']);
  
  // Intensity multipliers
  const intensityMultiplier = {
    low: 0.5,
    medium: 1.0,
    high: 1.5,
    extreme: 2.0
  }[intensity];

  // Initialize systems
  useEffect(() => {
    if (canvasRef.current && enableParticles) {
      particleSystemRef.current = new AdvancedParticleSystem(
        canvasRef.current,
        currentColors,
        intensityMultiplier
      );
      particleSystemRef.current.start();
    }

    if (svgRef.current && enableWaves) {
      waveSystemRef.current = new FluidWaveSystem(svgRef.current);
      waveSystemRef.current.start();
    }

    return () => {
      particleSystemRef.current?.stop();
      waveSystemRef.current?.stop();
    };
  }, [enableParticles, enableWaves, intensityMultiplier]);

  // Color cycling system
  useEffect(() => {
    const colors = COLOR_PALETTES[colorPalette];
    setCurrentColors(colors);
    particleSystemRef.current?.updateColors(colors);
  }, [colorPalette]);

  // Intersection observer
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Animation controls
  useEffect(() => {
    if (isVisible) {
      controls.start({
        opacity: 1,
        scale: 1,
        transition: {
          duration: 1.2 * animationSpeed,
          ease: [0.4, 0, 0.6, 1]
        }
      });
    }
  }, [isVisible, controls, animationSpeed]);

  const gradientDefinitions = currentColors.map((color, index) => (
    <stop
      key={index}
      offset={`${(index / (currentColors.length - 1)) * 100}%`}
      stopColor={`hsl(${color.h}, ${color.s}%, ${color.l}%)`}
      stopOpacity={0.8}
    />
  ));

  return (
    <motion.div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
        ...style
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={controls}
    >
      {/* Animated Background Layers */}
      <div className="absolute inset-0 overflow-hidden">
        
        {/* Layer 1: Fluid Wave SVG */}
        {enableWaves && (
          <motion.div
            className="absolute inset-0"
            style={{ y: y1 }}
          >
            <svg
              ref={svgRef}
              className="w-full h-full opacity-30"
              viewBox="0 0 1200 800"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  {gradientDefinitions}
                </linearGradient>
                <linearGradient id="waveGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
                  {gradientDefinitions.slice().reverse()}
                </linearGradient>
                <linearGradient id="waveGradient3" x1="0%" y1="100%" x2="100%" y2="0%">
                  {gradientDefinitions}
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {Array.from({ length: 5 }, (_, i) => (
                <path
                  key={i}
                  id={`wave-${i}`}
                  fill={`url(#waveGradient${(i % 3) + 1})`}
                  opacity={0.6 - i * 0.1}
                  filter="url(#glow)"
                />
              ))}
            </svg>
          </motion.div>
        )}

        {/* Layer 2: Particle Canvas */}
        {enableParticles && (
          <motion.div
            className="absolute inset-0"
            style={{ y: y2 }}
          >
            <canvas
              ref={canvasRef}
              className="w-full h-full opacity-70 mix-blend-screen"
              style={{
                background: 'transparent',
                willChange: 'transform',
                transform: 'translateZ(0)'
              }}
            />
          </motion.div>
        )}

        {/* Layer 3: Dynamic Gradient Overlay */}
        <motion.div
          className="absolute inset-0"
          style={{ y: y3 }}
        >
          <div
            className="w-full h-full opacity-40"
            style={{
              background: `
                radial-gradient(ellipse at 20% 30%, 
                  hsl(${currentColors[0]?.h || 0}, ${currentColors[0]?.s || 96}%, ${currentColors[0]?.l || 55}%) 0%, 
                  transparent 50%),
                radial-gradient(ellipse at 80% 70%, 
                  hsl(${currentColors[2]?.h || 60}, ${currentColors[2]?.s || 100}%, ${currentColors[2]?.l || 50}%) 0%, 
                  transparent 50%),
                radial-gradient(ellipse at 50% 50%, 
                  hsl(${currentColors[4]?.h || 180}, ${currentColors[4]?.s || 100}%, ${currentColors[4]?.l || 40}%) 0%, 
                  transparent 70%)
              `,
              animation: `pulse ${3 / animationSpeed}s ease-in-out infinite alternate`
            }}
          />
        </motion.div>

        {/* Layer 4: Geometric Patterns */}
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 20 / animationSpeed,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="w-full h-full bg-gradient-to-br from-transparent via-white/5 to-transparent transform rotate-45" />
        </motion.div>
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        {children}
      </div>

      {/* Performance Indicators (Dev only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 right-4 bg-black/80 text-white p-2 rounded text-xs font-mono z-50">
          <div>Intensity: {intensity}</div>
          <div>Particles: {enableParticles ? 'ON' : 'OFF'}</div>
          <div>Waves: {enableWaves ? 'ON' : 'OFF'}</div>
          <div>Parallax: {enableParallax ? 'ON' : 'OFF'}</div>
          <div>Palette: {colorPalette}</div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
      `}</style>
    </motion.div>
  );
};

export default AnimatedBandaBaja;