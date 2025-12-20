/**
 * HERO WINDSURF COMPONENT
 * Advanced hero section with Windsurf animations and Next.js 14 optimizations
 * Integrates with TypeScript, Framer Motion, and WindsurfEngine
 */

'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useInView, AnimatePresence } from 'framer-motion';
import { RainbowBackground } from './RainbowBackground';
import { AnimatedText } from './AnimatedText';
import { WindsurfButton } from './WindsurfButton';
import { useWindsurfEngine, useScrollAnimation } from '@/lib/windsurf-engine';

// ===== INTERFACES =====

export interface HeroWindsurfProps {
  title?: string;
  subtitle?: string;
  description?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  backgroundIntensity?: 'low' | 'medium' | 'high';
  animationSpeed?: 'slow' | 'normal' | 'fast';
  showParticles?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

interface ParticleProps {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  direction: number;
}

// ===== HERO WINDSURF COMPONENT =====

export const HeroWindsurf: React.FC<HeroWindsurfProps> = ({
  title = "Dafel Technologies",
  subtitle = "Innovación Digital Elite",
  description = "Transformamos ideas en soluciones tecnológicas revolucionarias con arquitecturas de vanguardia y diseño excepcional.",
  primaryButtonText = "Explorar Servicios",
  secondaryButtonText = "Ver Portfolio",
  onPrimaryClick,
  onSecondaryClick,
  backgroundIntensity = 'high',
  animationSpeed = 'normal',
  showParticles = true,
  className = '',
  style,
}) => {
  // Refs and state
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [particles, setParticles] = useState<ParticleProps[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Windsurf engine integration
  const { engine, isReady } = useWindsurfEngine();
  
  // Animation controls
  const titleAnimation = useAnimation();
  const subtitleAnimation = useAnimation();
  const descriptionAnimation = useAnimation();
  const buttonsAnimation = useAnimation();

  // Intersection observer
  const isInView = useInView(heroRef, { once: false, amount: 0.3 });

  // ===== PARTICLE SYSTEM =====
  
  const createParticles = useCallback(() => {
    if (!showParticles) return;
    
    const newParticles: ParticleProps[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
      y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
      size: Math.random() * 3 + 1,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      speed: Math.random() * 0.5 + 0.1,
      direction: Math.random() * Math.PI * 2,
    }));
    
    setParticles(newParticles);
  }, [showParticles]);

  const updateParticles = useCallback(() => {
    if (!showParticles || typeof window === 'undefined') return;

    setParticles(prevParticles =>
      prevParticles.map(particle => ({
        ...particle,
        x: particle.x + Math.cos(particle.direction) * particle.speed,
        y: particle.y + Math.sin(particle.direction) * particle.speed,
        // Wrap around screen
        x: particle.x > window.innerWidth ? 0 : particle.x < 0 ? window.innerWidth : particle.x,
        y: particle.y > window.innerHeight ? 0 : particle.y < 0 ? window.innerHeight : particle.y,
      }))
    );
  }, [showParticles]);

  // ===== ANIMATION SEQUENCES =====

  const startAnimationSequence = useCallback(async () => {
    if (!isInView) return;

    // Staggered entrance animations
    await titleAnimation.start({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.8, 
        ease: [0.4, 0, 0.6, 1],
        type: "spring",
        stiffness: 100
      }
    });

    await subtitleAnimation.start({
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.6, 
        delay: 0.2,
        ease: [0.4, 0, 0.6, 1]
      }
    });

    await descriptionAnimation.start({
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.6, 
        delay: 0.3,
        ease: [0.4, 0, 0.6, 1]
      }
    });

    await buttonsAnimation.start({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.6, 
        delay: 0.4,
        ease: [0.4, 0, 0.6, 1],
        staggerChildren: 0.1
      }
    });

    setIsLoaded(true);
  }, [isInView, titleAnimation, subtitleAnimation, descriptionAnimation, buttonsAnimation]);

  // ===== MOUSE INTERACTION =====

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePosition({
        x: ((event.clientX - rect.left) / rect.width - 0.5) * 20,
        y: ((event.clientY - rect.top) / rect.height - 0.5) * 20,
      });
    }
  }, []);

  // ===== EFFECTS =====

  useEffect(() => {
    startAnimationSequence();
  }, [startAnimationSequence]);

  useEffect(() => {
    createParticles();
    
    // Resize handler
    const handleResize = () => {
      createParticles();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [createParticles]);

  useEffect(() => {
    if (!showParticles) return;

    const interval = setInterval(updateParticles, 50);
    return () => clearInterval(interval);
  }, [updateParticles, showParticles]);

  useEffect(() => {
    if (isReady && engine && heroRef.current) {
      // Enable advanced interactions
      engine.enableInteractions(heroRef.current);
      
      return () => {
        if (heroRef.current) {
          engine.disableInteractions(heroRef.current);
        }
      };
    }
  }, [engine, isReady]);

  // ===== ANIMATION VARIANTS =====

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        duration: 1,
        staggerChildren: 0.2
      }
    }
  };

  const titleVariants = {
    initial: { 
      opacity: 0, 
      y: 50, 
      scale: 0.9 
    },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.6, 1]
      }
    }
  };

  const textVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.6, 1]
      }
    }
  };

  const buttonVariants = {
    initial: { opacity: 0, y: 20, scale: 0.9 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.6, 1]
      }
    }
  };

  // ===== RENDER =====

  return (
    <section 
      ref={heroRef}
      className={`
        relative min-h-screen flex items-center justify-center overflow-hidden
        windsurf-composite-layer windsurf-gpu-optimized
        ${className}
      `}
      style={style}
      onMouseMove={handleMouseMove}
    >
      {/* Rainbow Background */}
      <RainbowBackground
        intensity={backgroundIntensity}
        speed={animationSpeed}
        direction="diagonal"
        className="absolute inset-0 z-0"
      />

      {/* Particles System */}
      <AnimatePresence>
        {showParticles && (
          <div className="absolute inset-0 z-10 pointer-events-none">
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute rounded-full opacity-60"
                style={{
                  left: particle.x,
                  top: particle.y,
                  width: particle.size,
                  height: particle.size,
                  backgroundColor: particle.color,
                  boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
                }}
                animate={{
                  opacity: [0.6, 1, 0.6],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div
        className="relative z-20 text-center max-w-6xl mx-auto px-6 lg:px-8"
        variants={containerVariants}
        initial="initial"
        animate={isInView ? "animate" : "initial"}
        style={{
          transform: `translateX(${mousePosition.x}px) translateY(${mousePosition.y}px)`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        {/* Title */}
        <motion.h1
          ref={titleRef}
          className="text-6xl md:text-8xl lg:text-9xl font-black mb-6 leading-tight"
          variants={titleVariants}
          animate={titleAnimation}
        >
          <AnimatedText
            text={title}
            gradient="rainbow"
            animationType="wave"
            className="windsurf-smooth-edges"
          />
        </motion.h1>

        {/* Subtitle */}
        <motion.h2
          className="text-2xl md:text-4xl lg:text-5xl font-bold mb-8 text-white/90"
          variants={textVariants}
          animate={subtitleAnimation}
        >
          <AnimatedText
            text={subtitle}
            gradient="sunset"
            animationType="glow"
            delay={0.2}
          />
        </motion.h2>

        {/* Description */}
        <motion.p
          className="text-lg md:text-xl lg:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed text-white/80"
          variants={textVariants}
          animate={descriptionAnimation}
        >
          {description}
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          variants={buttonVariants}
          animate={buttonsAnimation}
        >
          <WindsurfButton
            variant="primary"
            size="large"
            onClick={onPrimaryClick}
            className="transform hover:scale-105 transition-all duration-300"
            rippleColor="rgba(255, 255, 255, 0.3)"
          >
            {primaryButtonText}
          </WindsurfButton>

          <WindsurfButton
            variant="secondary"
            size="large"
            onClick={onSecondaryClick}
            className="transform hover:scale-105 transition-all duration-300"
            rippleColor="rgba(255, 255, 255, 0.2)"
          >
            {secondaryButtonText}
          </WindsurfButton>
        </motion.div>
      </motion.div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-black/20 to-black/40 pointer-events-none" />

      {/* Performance Monitoring */}
      {process.env.NODE_ENV === 'development' && isLoaded && (
        <div className="fixed bottom-4 right-4 bg-black/80 text-white p-2 rounded text-xs font-mono z-50">
          <div>Hero: Loaded</div>
          <div>Particles: {particles.length}</div>
          <div>Mouse: {mousePosition.x.toFixed(1)}, {mousePosition.y.toFixed(1)}</div>
        </div>
      )}
    </section>
  );
};

export default HeroWindsurf;