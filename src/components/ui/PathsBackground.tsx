'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState, useEffect, useMemo } from 'react';

interface PathsBackgroundProps {
  className?: string;
  pathCount?: number;
}

function PathsBackground({ 
  className, 
  pathCount = 36
}: PathsBackgroundProps) {
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate paths using shadcn.io mathematical formula
  const paths = useMemo(() => 
    Array.from({ length: pathCount }, (_, i) => {
      const row = Math.floor(i / 6);
      const col = i % 6;
      
      // Base grid positioning with organic variations
      const baseX = col * 200 - 100;
      const baseY = row * 120 + 50;
      
      // Add organic randomness based on index (deterministic)
      const seed = i * 2.3849 % 1;
      const offsetX = (seed * 80 - 40);
      const offsetY = ((seed * 1.618) % 1) * 60 - 30;
      
      // Start and end points
      const startX = baseX + offsetX;
      const startY = baseY + offsetY;
      const endX = startX + 300 + (seed * 200 - 100);
      const endY = startY + 80 + (seed * 120 - 60);
      
      // Control points for smooth curves
      const cp1X = startX + 120 + offsetX;
      const cp1Y = startY - 40 + offsetY;
      const cp2X = endX - 120 + offsetX;
      const cp2Y = endY + 40 + offsetY;
      
      return {
        id: i,
        d: `M${startX},${startY} C${cp1X},${cp1Y} ${cp2X},${cp2Y} ${endX},${endY}`,
        strokeWidth: 0.8 + (i % 6) * 0.2,
        opacity: 0.15 + (i % 4) * 0.08,
        duration: 2 + (i % 4) * 1.5,
        delay: (i * 0.2) % 3
      };
    }), [pathCount]);

  // Static fallback to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className={cn("absolute inset-0 pointer-events-none overflow-hidden", className)}>
        <svg
          className="w-full h-full"
          viewBox="0 0 1200 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          <title>Dafel Technologies - Background Paths</title>
          <defs>
            <linearGradient id="staticGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#1a1a1a" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          {Array.from({ length: 12 }, (_, i) => {
            const x1 = i * 100;
            const y1 = 100 + i * 50;
            const x2 = x1 + 400;
            const y2 = y1 + 100;
            return (
              <path
                key={i}
                d={`M${x1},${y1} Q${x1 + 200},${y1 - 50} ${x2},${y2}`}
                stroke="url(#staticGradient)"
                strokeWidth={1 + i * 0.1}
                fill="none"
                opacity={0.3}
              />
            );
          })}
        </svg>
      </div>
    );
  }

  // Split paths into two layers for depth effect
  const backgroundPaths = paths.slice(0, 18);
  const foregroundPaths = paths.slice(18);

  return (
    <div className={cn("absolute inset-0 pointer-events-none overflow-hidden", className)}>
      {/* Background Layer */}
      <div 
        className="absolute inset-0 -z-10"
        style={{ zIndex: -1 }}
      >
        <svg
          className="w-full h-full text-black dark:text-white"
          viewBox="0 0 1200 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          <title>Dafel Technologies - Background Paths</title>
          
          <defs>
            <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.1" />
              <stop offset="30%" stopColor="#1a1a1a" stopOpacity="0.2" />
              <stop offset="70%" stopColor="#000000" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#1a1a1a" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          
          {backgroundPaths.map((path) => (
            <motion.path
              key={`bg-${path.id}`}
              d={path.d}
              stroke="url(#bgGradient)"
              strokeWidth={path.strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              initial={{ 
                pathLength: 0,
                opacity: 0
              }}
              animate={{
                pathLength: [0, 1, 0.8, 1],
                opacity: [0, path.opacity * 0.6, path.opacity * 0.4, path.opacity * 0.8]
              }}
              transition={{
                duration: path.duration,
                repeat: Infinity,
                repeatType: "reverse",
                ease: [0.4, 0, 0.2, 1],
                delay: path.delay
              }}
              style={{
                transform: 'translateZ(0)'
              }}
            />
          ))}
        </svg>
      </div>

      {/* Foreground Layer */}
      <div 
        className="absolute inset-0 z-10"
        style={{ zIndex: 1 }}
      >
        <svg
          className="w-full h-full text-black dark:text-white"
          viewBox="0 0 1200 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="fgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.2" />
              <stop offset="25%" stopColor="#2d2d2d" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#000000" stopOpacity="0.35" />
              <stop offset="75%" stopColor="#2d2d2d" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          
          {foregroundPaths.map((path) => (
            <motion.path
              key={`fg-${path.id}`}
              d={path.d}
              stroke="url(#fgGradient)"
              strokeWidth={path.strokeWidth * 1.2}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              initial={{ 
                pathLength: 0,
                opacity: 0
              }}
              animate={{
                pathLength: [0, 1],
                opacity: [0, path.opacity, path.opacity * 0.6, path.opacity]
              }}
              transition={{
                duration: path.duration * 0.8,
                repeat: Infinity,
                repeatType: "reverse",
                ease: [0.25, 0.1, 0.25, 1],
                delay: path.delay + 0.5
              }}
              style={{
                transform: 'translateZ(0)'
              }}
            />
          ))}
          
          {/* Decorative animated dots for enhanced effect */}
          <motion.circle
            cx="200"
            cy="150"
            r="2"
            fill="currentColor"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 0.6, 0],
              scale: [0, 1.2, 0] 
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
          <motion.circle
            cx="800"
            cy="400"
            r="1.5"
            fill="currentColor"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 0.4, 0],
              scale: [0, 1, 0] 
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3
            }}
          />
          <motion.circle
            cx="600"
            cy="600"
            r="1"
            fill="currentColor"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 0.5, 0],
              scale: [0, 1, 0] 
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2.5
            }}
          />
        </svg>
      </div>
    </div>
  );
}

export default PathsBackground;