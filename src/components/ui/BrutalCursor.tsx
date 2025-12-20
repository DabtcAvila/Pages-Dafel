'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function BrutalCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.classList.contains('interactive')) {
        setIsHovering(true);
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.classList.contains('interactive')) {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseenter', handleMouseEnter, true);
    document.addEventListener('mouseleave', handleMouseLeave, true);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      document.removeEventListener('mouseleave', handleMouseLeave, true);
    };
  }, []);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-6 h-6 bg-white rounded-full mix-blend-difference pointer-events-none z-[9999]"
        style={{
          translateX: mousePosition.x - 12,
          translateY: mousePosition.y - 12,
        }}
        animate={{
          scale: isClicking ? 0.5 : isHovering ? 2 : 1,
          backgroundColor: isHovering ? '#ff00ff' : '#ffffff',
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      />
      
      <motion.div
        className="fixed top-0 left-0 w-12 h-12 border-2 border-white rounded-full pointer-events-none z-[9998] opacity-30"
        style={{
          translateX: mousePosition.x - 24,
          translateY: mousePosition.y - 24,
        }}
        animate={{
          scale: isClicking ? 1.5 : isHovering ? 0.5 : 1,
          opacity: isHovering ? 0.8 : 0.3,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
      />
    </>
  );
}