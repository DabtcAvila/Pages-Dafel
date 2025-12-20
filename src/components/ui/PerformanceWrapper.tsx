'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface PerformanceWrapperProps {
  children: React.ReactNode;
  threshold?: number;
}

export default function PerformanceWrapper({ children, threshold = 60 }: PerformanceWrapperProps) {
  const [isHighPerformance, setIsHighPerformance] = useState(true);
  const [frameRate, setFrameRate] = useState(60);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        setFrameRate(fps);
        setIsHighPerformance(fps >= threshold);
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      animationId = requestAnimationFrame(measureFPS);
    };

    animationId = requestAnimationFrame(measureFPS);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [threshold]);

  const optimizedVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        duration: isHighPerformance ? 0.5 : 0.2,
        ease: isHighPerformance ? "easeOut" : "linear"
      }
    }
  };

  return (
    <motion.div
      variants={optimizedVariants}
      initial="initial"
      animate="animate"
      style={{
        willChange: isHighPerformance ? 'transform, opacity' : 'opacity',
        transform: isHighPerformance ? 'translateZ(0)' : 'none'
      }}
    >
      {children}
      
      {process.env.NODE_ENV === 'development' && (
        <motion.div
          className="fixed top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded text-sm z-[10000]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <div>FPS: {frameRate}</div>
          <div>Mode: {isHighPerformance ? 'High' : 'Optimized'}</div>
        </motion.div>
      )}
    </motion.div>
  );
}