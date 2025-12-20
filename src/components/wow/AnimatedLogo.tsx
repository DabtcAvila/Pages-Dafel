'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';

interface AnimatedLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
  autoPlay?: boolean;
  showParticles?: boolean;
  quality?: 'high' | 'ultra';
}

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({
  className = '',
  size = 'md',
  interactive = true,
  autoPlay = true,
  showParticles = true,
  quality = 'high'
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [animationState, setAnimationState] = useState('idle');
  const logoRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Motion values for smooth animations
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);
  const scale = useTransform(mouseX, [-300, 300], [0.95, 1.05]);

  // Animation controllers
  const mainControls = useAnimation();
  const glowControls = useAnimation();
  const pathControls = useAnimation();

  // Size configurations
  const sizeConfig = {
    sm: { width: 150, height: 90, fontSize: '0.8rem' },
    md: { width: 250, height: 150, fontSize: '1rem' },
    lg: { width: 350, height: 210, fontSize: '1.2rem' },
    xl: { width: 500, height: 300, fontSize: '1.5rem' }
  };

  const currentSize = sizeConfig[size];

  // Brand colors
  const colors = {
    primary: '#eaeaea',
    secondary: '#a7c9ea', 
    accent: '#241f1f',
    muted: '#666666',
    glow: '#a7c9ea',
    particle: '#eaeaea'
  };

  // Particle system
  const createParticles = () => {
    if (!showParticles) return;
    
    const newParticles: Particle[] = [];
    const particleCount = quality === 'ultra' ? 50 : 30;
    
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: Math.random().toString(36).substr(2, 9),
        x: Math.random() * currentSize.width,
        y: Math.random() * currentSize.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        color: Math.random() > 0.5 ? colors.primary : colors.secondary
      });
    }
    setParticles(newParticles);
  };

  // Advanced animation sequences
  const startEntranceAnimation = async () => {
    setAnimationState('entering');
    
    await Promise.all([
      mainControls.start({
        scale: [0, 1.2, 1],
        opacity: [0, 1],
        rotateZ: [180, 0],
        transition: { duration: 2, ease: 'easeOut' }
      }),
      glowControls.start({
        opacity: [0, 0.8, 0.4],
        scale: [0.8, 1.5, 1],
        transition: { duration: 2, ease: 'easeOut' }
      }),
      pathControls.start({
        pathLength: [0, 1],
        opacity: [0, 1],
        transition: { duration: 3, ease: 'easeInOut', delay: 0.5 }
      })
    ]);
    
    setAnimationState('idle');
  };

  const startHoverAnimation = async () => {
    if (!interactive) return;
    
    setAnimationState('hovering');
    
    await Promise.all([
      mainControls.start({
        scale: 1.1,
        rotateZ: [0, 5, -5, 0],
        transition: { duration: 0.6, ease: 'easeInOut' }
      }),
      glowControls.start({
        opacity: 0.9,
        scale: 1.3,
        transition: { duration: 0.3 }
      }),
      pathControls.start({
        stroke: colors.glow,
        strokeWidth: 3,
        filter: 'drop-shadow(0 0 10px #a7c9ea)',
        transition: { duration: 0.3 }
      })
    ]);
  };

  const resetHoverAnimation = async () => {
    if (!interactive) return;
    
    await Promise.all([
      mainControls.start({
        scale: 1,
        rotateZ: 0,
        transition: { duration: 0.3 }
      }),
      glowControls.start({
        opacity: 0.4,
        scale: 1,
        transition: { duration: 0.3 }
      }),
      pathControls.start({
        stroke: 'none',
        strokeWidth: 0,
        filter: 'none',
        transition: { duration: 0.3 }
      })
    ]);
    
    setAnimationState('idle');
  };

  // Morphing animation for paths
  const morphingAnimation = {
    animate: {
      d: [
        "m55.362 9.1105c8.9043 81.586 176.22 132.89 159.45 45.069-0.49946 48.459-105.51 38.019-159.45-45.069z",
        "m55.362 9.1105c15.9043 75.586 170.22 140.89 159.45 45.069-0.49946 55.459-110.51 32.019-159.45-45.069z",
        "m55.362 9.1105c8.9043 81.586 176.22 132.89 159.45 45.069-0.49946 48.459-105.51 38.019-159.45-45.069z"
      ],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  // Mouse tracking for 3D effect
  const handleMouseMove = (event: React.MouseEvent) => {
    if (!interactive || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    mouseX.set(event.clientX - centerX);
    mouseY.set(event.clientY - centerY);
  };

  // Particle animation loop
  useEffect(() => {
    if (!showParticles) return;
    
    const animateParticles = () => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        vx: particle.x > currentSize.width || particle.x < 0 ? -particle.vx : particle.vx,
        vy: particle.y > currentSize.height || particle.y < 0 ? -particle.vy : particle.vy,
        opacity: particle.opacity + (Math.random() - 0.5) * 0.02
      })));
    };

    const interval = setInterval(animateParticles, 16);
    return () => clearInterval(interval);
  }, [showParticles, currentSize]);

  // Initialize animations
  useEffect(() => {
    createParticles();
    if (autoPlay) {
      startEntranceAnimation();
    }
  }, [autoPlay, showParticles, quality]);

  return (
    <div
      ref={containerRef}
      className={`relative inline-block ${className}`}
      style={{
        width: currentSize.width,
        height: currentSize.height,
        perspective: '1000px'
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => {
        setIsHovered(true);
        startHoverAnimation();
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        resetHoverAnimation();
        mouseX.set(0);
        mouseY.set(0);
      }}
    >
      {/* Particle System */}
      <AnimatePresence>
        {showParticles && particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              opacity: particle.opacity,
              filter: 'blur(0.5px)'
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [particle.opacity, particle.opacity * 0.7, particle.opacity]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        ))}
      </AnimatePresence>

      {/* Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${colors.glow}20, transparent 70%)`,
          filter: 'blur(20px)',
          transformStyle: 'preserve-3d'
        }}
        animate={glowControls}
        initial={{ opacity: 0, scale: 0.8 }}
      />

      {/* Main Logo Container */}
      <motion.div
        ref={logoRef}
        className="relative w-full h-full"
        style={{
          rotateX,
          rotateY,
          scale,
          transformStyle: 'preserve-3d'
        }}
        animate={mainControls}
        initial={{ scale: 0, opacity: 0 }}
      >
        {/* SVG Logo with Advanced Animations */}
        <motion.svg
          viewBox="0 0 264.58 158.75"
          className="w-full h-full drop-shadow-2xl"
          style={{
            filter: isHovered ? `drop-shadow(0 0 20px ${colors.glow}60)` : 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
          }}
        >
          {/* Animated Gradient Definitions */}
          <defs>
            <motion.linearGradient
              id="morphingGradient"
              x1="0%" y1="0%" x2="100%" y2="100%"
              animate={{
                x1: ['0%', '100%', '0%'],
                y1: ['0%', '100%', '0%'],
                x2: ['100%', '0%', '100%'],
                y2: ['100%', '0%', '100%']
              }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            >
              <stop offset="0%" stopColor={colors.primary} />
              <stop offset="50%" stopColor={colors.secondary} />
              <stop offset="100%" stopColor={colors.primary} />
            </motion.linearGradient>
            
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Grey Curve Complete - Layer 1 */}
          <g transform="translate(-13.827 16.81)">
            <motion.path
              d="m55.362 9.1105c8.9043 81.586 176.22 132.89 159.45 45.069-0.49946 48.459-105.51 38.019-159.45-45.069z"
              fill={colors.primary}
              animate={pathControls}
              variants={morphingAnimation}
              whileHover={{
                fill: `url(#morphingGradient)`,
                transition: { duration: 0.3 }
              }}
              style={{ filter: isHovered ? 'url(#glow)' : 'none' }}
            />
            <motion.path
              d="m181.23 129.82c-24.565-59.754-0.06227-109.98 26.316-94.08-37.622-38.807-67.429 48.496-26.316 94.08z"
              fill={colors.primary}
              animate={pathControls}
              whileHover={{
                fill: colors.secondary,
                transition: { duration: 0.3 }
              }}
            />
            <motion.ellipse
              cx="212.5" cy="42.875" rx="5.5644" ry="4.5354"
              fill={colors.primary}
              animate={{
                rx: [5.5644, 7, 5.5644],
                ry: [4.5354, 6, 4.5354],
                opacity: [1, 0.7, 1]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              whileHover={{
                fill: colors.glow,
                filter: 'drop-shadow(0 0 5px #a7c9ea)'
              }}
            />
          </g>

          {/* Blue Curve Complete - Layer 2 */}
          <g transform="translate(-56.555 18.389)">
            <g transform="translate(27.41 -13.531)">
              <motion.path
                d="m55.362 9.1105c8.9043 81.586 176.22 132.89 159.45 45.069-0.49946 48.459-105.51 38.019-159.45-45.069z"
                fill={colors.secondary}
                animate={{
                  opacity: [0.8, 1, 0.8],
                  scale: [1, 1.02, 1]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                whileHover={{
                  fill: colors.glow,
                  filter: 'drop-shadow(0 0 10px #a7c9ea)',
                  transition: { duration: 0.3 }
                }}
              />
              <motion.path
                d="m181.23 129.82c-24.565-59.754-0.06227-109.98 26.316-94.08-37.622-38.807-67.429 48.496-26.316 94.08z"
                fill={colors.secondary}
                animate={{
                  rotateZ: [0, 1, -1, 0],
                  opacity: [0.9, 1, 0.9]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.ellipse
                cx="212.5" cy="42.875" rx="5.5644" ry="4.5354"
                fill={colors.secondary}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [1, 0.6, 1]
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              />
            </g>
          </g>

          {/* DAFEL Text - Layer 3 */}
          <motion.path
            d="m22.601 72.512h11.826c2.8331 0 4.7467 0.26714 6.7882 0.80141 6.6481 1.4522 9.2672 8.3348 9.2672 12.928 0 7.654-5.4362 11.923-8.6422 13.118-1.986 0.74516-3.7398 1.1177-6.3091 1.1177h-12.93zm3.598 26.448h8.6033c1.5554 0 3.5443-0.26011 4.9192-0.78031 5.2228-1.9282 6.8953-7.8429 6.8953-11.833 0-2.7019-0.72164-8.674-6.7495-11.433-1.3749-0.57645-3.4055-0.86468-5.0442-0.86468h-8.6241zm53.831 1.5165h-4.1996l-4.7372-10.909h-11.324l-4.883 10.909h-2.3331l13.922-28.521zm-19.448-12.723h9.6575l-4.4913-10.543zm42.172-15.242v1.8137h-13.478v10.526h10.808v1.8137h-10.808v13.812h-3.058v-27.965zm22.127 0v1.8137h-12.445v9.9965h7.6326v1.8137h-7.6326v12.527h12.445v1.8137h-16.032v-27.965zm6.5162 0h3.5871l0.52917 26.151h12.328v1.8137h-16.444z"
            fill={colors.accent}
            animate={{
              opacity: [0.9, 1, 0.9],
              textShadow: ['0 0 0px transparent', `0 0 5px ${colors.accent}50`, '0 0 0px transparent']
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{
              fill: colors.secondary,
              filter: `drop-shadow(0 2px 4px ${colors.accent}40)`,
              transition: { duration: 0.3 }
            }}
          />

          {/* Consulting Services Text - Layer 4 */}
          <motion.text
            x="21.478451" y="125.46717"
            fill={colors.muted}
            fontSize="20.663"
            fontFamily="'Bangla MN'"
            animate={{
              opacity: [0.7, 1, 0.7],
              y: [125.46717, 124, 125.46717]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{
              fill: colors.secondary,
              fontSize: 22,
              transition: { duration: 0.3 }
            }}
          >
            Consulting Services
          </motion.text>
        </motion.svg>

        {/* Interactive Overlay Effects */}
        {interactive && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={isHovered ? {
              background: `radial-gradient(circle at 50% 50%, ${colors.glow}10, transparent 80%)`,
              opacity: 1
            } : {
              opacity: 0
            }}
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.div>

      {/* Performance indicator for ultra quality */}
      {quality === 'ultra' && (
        <div className="absolute -bottom-6 left-0 text-xs text-gray-500 font-mono">
          {animationState} | {particles.length}p | {size}
        </div>
      )}
    </div>
  );
};

export default AnimatedLogo;