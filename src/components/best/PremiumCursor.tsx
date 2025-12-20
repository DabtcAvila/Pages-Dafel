'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export default function PremiumCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [trail, setTrail] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const cursorX = useSpring(0, { stiffness: 500, damping: 28 });
  const cursorY = useSpring(0, { stiffness: 500, damping: 28 });

  useEffect(() => {
    let trailId = 0;

    const updateMousePosition = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      
      setMousePosition({ x, y });
      cursorX.set(x);
      cursorY.set(y);

      // Add trail point
      setTrail(prev => [
        { x, y, id: trailId++ },
        ...prev.slice(0, 8) // Keep only last 8 points
      ]);

      // Check if hovering over interactive elements
      const target = e.target as HTMLElement;
      const isInteractive = target.tagName === 'BUTTON' || 
                           target.tagName === 'A' || 
                           target.classList.contains('cursor-pointer') ||
                           getComputedStyle(target).cursor === 'pointer';
      setIsPointer(isInteractive);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    document.addEventListener('mousemove', updateMousePosition);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      {/* Cursor trail */}
      {trail.map((point, index) => (
        <motion.div
          key={point.id}
          className="fixed top-0 left-0 pointer-events-none z-[9997] w-2 h-2 bg-blue-400 rounded-full mix-blend-difference"
          style={{
            x: point.x - 4,
            y: point.y - 4,
          }}
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ 
            scale: 0,
            opacity: 0 
          }}
          transition={{ 
            duration: 0.6,
            delay: index * 0.05
          }}
        />
      ))}

      {/* Main cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] w-4 h-4 border-2 border-blue-600 rounded-full mix-blend-difference"
        style={{
          x: mousePosition.x - 8,
          y: mousePosition.y - 8,
        }}
        animate={{
          scale: isClicking ? 0.8 : isPointer ? 2 : 1,
          borderColor: isPointer ? '#3B82F6' : '#1E40AF',
          backgroundColor: isClicking ? '#3B82F6' : 'transparent'
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      />

      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] w-8 h-8 border border-blue-400 rounded-full opacity-40"
        style={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
        }}
        animate={{
          scale: isClicking ? 1.5 : isPointer ? 0.5 : 1,
          opacity: isPointer ? 0.8 : 0.4
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.05 }}
      />
    </>
  );
}