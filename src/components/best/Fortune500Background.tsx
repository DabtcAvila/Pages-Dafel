'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function Fortune500Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(dpr, dpr);
    };

    const createGradientMesh = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create sophisticated gradient mesh
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      // Primary gradient
      const gradient1 = ctx.createRadialGradient(
        centerX + Math.sin(time * 0.001) * 200, 
        centerY + Math.cos(time * 0.001) * 200, 
        0,
        centerX, 
        centerY, 
        Math.max(window.innerWidth, window.innerHeight)
      );
      gradient1.addColorStop(0, 'rgba(167, 201, 234, 0.03)');
      gradient1.addColorStop(0.5, 'rgba(167, 201, 234, 0.01)');
      gradient1.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = gradient1;
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      // Secondary gradient
      const gradient2 = ctx.createRadialGradient(
        centerX - Math.sin(time * 0.0015) * 300,
        centerY - Math.cos(time * 0.0015) * 300,
        0,
        centerX,
        centerY,
        Math.max(window.innerWidth, window.innerHeight) * 0.8
      );
      gradient2.addColorStop(0, 'rgba(234, 234, 234, 0.02)');
      gradient2.addColorStop(0.3, 'rgba(234, 234, 234, 0.005)');
      gradient2.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      // Subtle geometric patterns
      ctx.strokeStyle = 'rgba(167, 201, 234, 0.05)';
      ctx.lineWidth = 1;
      
      for (let i = 0; i < 5; i++) {
        const radius = 100 + i * 80;
        const x = centerX + Math.sin(time * 0.0008 + i) * 50;
        const y = centerY + Math.cos(time * 0.0008 + i) * 50;
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Floating dots
      ctx.fillStyle = 'rgba(167, 201, 234, 0.08)';
      for (let i = 0; i < 20; i++) {
        const x = (centerX + Math.sin(time * 0.001 + i * 0.5) * (window.innerWidth * 0.4));
        const y = (centerY + Math.cos(time * 0.0012 + i * 0.3) * (window.innerHeight * 0.4));
        const size = 2 + Math.sin(time * 0.002 + i) * 1;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const animate = () => {
      time += 16; // ~60fps
      createGradientMesh();
      animationId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ mixBlendMode: 'multiply' }}
      />
      
      {/* Premium overlay patterns */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30">
        <motion.div
          className="absolute top-20 left-20 w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(167, 201, 234, 0.1) 0%, transparent 70%)',
            filter: 'blur(40px)'
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute bottom-20 right-20 w-80 h-80 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(234, 234, 234, 0.08) 0%, transparent 70%)',
            filter: 'blur(30px)'
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.08, 0.15, 0.08]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, rgba(167, 201, 234, 0.02), rgba(234, 234, 234, 0.02), rgba(167, 201, 234, 0.02))',
            filter: 'blur(60px)'
          }}
          animate={{
            rotate: [0, 360]
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
    </>
  );
}