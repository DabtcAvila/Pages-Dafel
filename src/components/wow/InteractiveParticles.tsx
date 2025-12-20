'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
  type: 'primary' | 'secondary' | 'accent';
}

interface InteractiveParticlesProps {
  className?: string;
  particleCount?: number;
  mouseInfluence?: number;
  connectionDistance?: number;
  animationSpeed?: number;
  colorScheme?: 'dafel' | 'corporate' | 'creative';
  disabled?: boolean;
}

export const InteractiveParticles: React.FC<InteractiveParticlesProps> = ({
  className = '',
  particleCount = 60,
  mouseInfluence = 150,
  connectionDistance = 120,
  animationSpeed = 1,
  colorScheme = 'dafel',
  disabled = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, isActive: false });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Color schemes based on the Dafel design system
  const colorSchemes = {
    dafel: {
      primary: ['rgb(37, 99, 235)', 'rgb(29, 78, 216)', 'rgb(59, 130, 246)'], // dafel-blue
      secondary: ['rgb(71, 85, 105)', 'rgb(51, 65, 85)', 'rgb(100, 116, 139)'], // dafel-slate
      accent: ['rgb(249, 115, 22)', 'rgb(234, 88, 12)', 'rgb(251, 146, 60)'] // dafel-orange
    },
    corporate: {
      primary: ['rgb(16, 185, 129)', 'rgb(5, 150, 105)', 'rgb(34, 197, 94)'], // emerald
      secondary: ['rgb(113, 113, 122)', 'rgb(82, 82, 91)', 'rgb(161, 161, 170)'], // zinc
      accent: ['rgb(139, 92, 246)', 'rgb(124, 58, 237)', 'rgb(168, 85, 247)'] // violet
    },
    creative: {
      primary: ['rgb(236, 72, 153)', 'rgb(219, 39, 119)', 'rgb(244, 114, 182)'], // pink
      secondary: ['rgb(183, 173, 148)', 'rgb(161, 149, 128)', 'rgb(199, 186, 156)'], // sand
      accent: ['rgb(14, 165, 233)', 'rgb(2, 132, 199)', 'rgb(56, 189, 248)'] // sky
    }
  };

  const colors = colorSchemes[colorScheme];

  // Initialize particles
  const initializeParticles = useCallback(() => {
    if (!dimensions.width || !dimensions.height) return;
    
    particlesRef.current = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * dimensions.width,
      y: Math.random() * dimensions.height,
      vx: (Math.random() - 0.5) * animationSpeed,
      vy: (Math.random() - 0.5) * animationSpeed,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.3,
      color: colors.primary[Math.floor(Math.random() * colors.primary.length)],
      life: Math.random() * 1000 + 500,
      maxLife: Math.random() * 1000 + 500,
      type: ['primary', 'secondary', 'accent'][Math.floor(Math.random() * 3)] as Particle['type']
    }));
  }, [dimensions, particleCount, animationSpeed, colors]);

  // Update particle positions and properties
  const updateParticles = useCallback(() => {
    const { width, height } = dimensions;
    const mouse = mouseRef.current;

    particlesRef.current.forEach(particle => {
      // Mouse influence
      if (mouse.isActive) {
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouseInfluence) {
          const force = (mouseInfluence - distance) / mouseInfluence;
          const angle = Math.atan2(dy, dx);
          particle.vx += Math.cos(angle) * force * 0.2;
          particle.vy += Math.sin(angle) * force * 0.2;
        }
      }

      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Boundary collision with soft bounce
      if (particle.x < 0 || particle.x > width) {
        particle.vx *= -0.8;
        particle.x = Math.max(0, Math.min(width, particle.x));
      }
      if (particle.y < 0 || particle.y > height) {
        particle.vy *= -0.8;
        particle.y = Math.max(0, Math.min(height, particle.y));
      }

      // Apply friction
      particle.vx *= 0.99;
      particle.vy *= 0.99;

      // Update life and opacity
      particle.life -= 1;
      if (particle.life <= 0) {
        // Respawn particle
        particle.x = Math.random() * width;
        particle.y = Math.random() * height;
        particle.vx = (Math.random() - 0.5) * animationSpeed;
        particle.vy = (Math.random() - 0.5) * animationSpeed;
        particle.life = particle.maxLife;
        particle.type = ['primary', 'secondary', 'accent'][Math.floor(Math.random() * 3)] as Particle['type'];
        
        // Update color based on type
        switch (particle.type) {
          case 'primary':
            particle.color = colors.primary[Math.floor(Math.random() * colors.primary.length)];
            break;
          case 'secondary':
            particle.color = colors.secondary[Math.floor(Math.random() * colors.secondary.length)];
            break;
          case 'accent':
            particle.color = colors.accent[Math.floor(Math.random() * colors.accent.length)];
            break;
        }
      }

      // Pulsing opacity effect
      const lifeFactor = particle.life / particle.maxLife;
      particle.opacity = 0.3 + 0.4 * Math.sin(Date.now() * 0.003 + particle.id) * lifeFactor;
    });
  }, [dimensions, mouseInfluence, animationSpeed, colors]);

  // Draw particles and connections
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    // Draw connections first (behind particles)
    particlesRef.current.forEach((particle, i) => {
      particlesRef.current.slice(i + 1).forEach(otherParticle => {
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < connectionDistance) {
          const opacity = (1 - distance / connectionDistance) * 0.3;
          ctx.strokeStyle = `rgba(37, 99, 235, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(otherParticle.x, otherParticle.y);
          ctx.stroke();
        }
      });
    });

    // Draw particles
    particlesRef.current.forEach(particle => {
      ctx.save();
      
      // Create gradient for each particle
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size * 2
      );
      
      // Extract RGB values and add alpha
      const colorMatch = particle.color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (colorMatch) {
        const [, r, g, b] = colorMatch;
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${particle.opacity})`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
      }

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();

      // Add subtle glow effect for accent particles
      if (particle.type === 'accent') {
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = particle.size * 2;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });
  }, [dimensions, connectionDistance]);

  // Animation loop
  const animate = useCallback(() => {
    if (disabled) return;
    
    updateParticles();
    draw();
    animationRef.current = requestAnimationFrame(animate);
  }, [updateParticles, draw, disabled]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      
      const rect = canvasRef.current.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        isActive: true
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.isActive = false;
    };

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseleave', handleMouseLeave);
      return () => {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);

  // Initialize and start animation
  useEffect(() => {
    if (dimensions.width && dimensions.height && !disabled) {
      initializeParticles();
      animate();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initializeParticles, animate, dimensions, disabled]);

  if (disabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className={`interactive-particles ${className}`}
      width={dimensions.width}
      height={dimensions.height}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1
      }}
    />
  );
};

export default InteractiveParticles;