'use client';

import React, { useEffect, useRef, useState } from 'react';

interface PremiumCursorProps {
  className?: string;
  disabled?: boolean;
  trailLength?: number;
  glowIntensity?: number;
}

export const PremiumCursor: React.FC<PremiumCursorProps> = ({
  className = '',
  disabled = false,
  trailLength = 20,
  glowIntensity = 1
}) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [clickEffect, setClickEffect] = useState(false);
  
  const trailPositions = useRef<Array<{ x: number; y: number; timestamp: number }>>([]);

  useEffect(() => {
    if (disabled || typeof window === 'undefined') return;

    const handleMouseMove = (e: MouseEvent) => {
      const newPos = { x: e.clientX, y: e.clientY };
      setMousePos(newPos);
      
      // Add to trail
      trailPositions.current.push({
        ...newPos,
        timestamp: Date.now()
      });
      
      // Keep only recent positions
      const now = Date.now();
      trailPositions.current = trailPositions.current.filter(
        pos => now - pos.timestamp < 1000
      ).slice(-trailLength);
    };

    const handleMouseDown = () => {
      setClickEffect(true);
      setTimeout(() => setClickEffect(false), 200);
    };

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target?.tagName === 'BUTTON' || target?.tagName === 'A' || 
          target?.classList.contains('interactive') ||
          target?.closest('button') || target?.closest('a')) {
        setIsHovering(true);
      }
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseenter', handleMouseEnter, true);
    document.addEventListener('mouseleave', handleMouseLeave, true);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      document.removeEventListener('mouseleave', handleMouseLeave, true);
    };
  }, [disabled, trailLength]);

  if (disabled || typeof window === 'undefined') return null;

  return (
    <div className={`premium-cursor-container ${className}`}>
      {/* Main cursor */}
      <div
        ref={cursorRef}
        className={`premium-cursor ${isHovering ? 'hovering' : ''} ${clickEffect ? 'clicking' : ''}`}
        style={{
          transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)`,
          '--glow-intensity': glowIntensity
        } as React.CSSProperties}
      >
        <div className="cursor-core" />
        <div className="cursor-glow" />
        {clickEffect && (
          <div className="cursor-ripple" />
        )}
      </div>

      {/* Trail effect */}
      <div className="cursor-trail">
        {trailPositions.current.map((pos, index) => {
          const age = Date.now() - pos.timestamp;
          const opacity = Math.max(0, 1 - age / 1000);
          const scale = Math.max(0.1, 1 - age / 1000);
          
          return (
            <div
              key={`${pos.timestamp}-${index}`}
              className="cursor-trail-dot"
              style={{
                transform: `translate3d(${pos.x}px, ${pos.y}px, 0) scale(${scale})`,
                opacity: opacity * 0.6
              }}
            />
          );
        })}
      </div>

      <style jsx>{`
        .premium-cursor-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
          z-index: 9999;
          mix-blend-mode: difference;
        }

        .premium-cursor {
          position: fixed;
          top: -12px;
          left: -12px;
          width: 24px;
          height: 24px;
          pointer-events: none;
          transition: all 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          z-index: 10000;
        }

        .cursor-core {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 8px;
          height: 8px;
          background: linear-gradient(135deg, 
            rgb(37, 99, 235), 
            rgb(16, 185, 129),
            rgb(249, 115, 22)
          );
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: all 0.2s ease;
        }

        .cursor-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 24px;
          height: 24px;
          background: radial-gradient(circle, 
            rgba(37, 99, 235, 0.3) 0%,
            rgba(16, 185, 129, 0.2) 50%,
            transparent 70%
          );
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: glow-pulse 2s ease-in-out infinite;
          opacity: var(--glow-intensity, 1);
        }

        .premium-cursor.hovering .cursor-core {
          width: 12px;
          height: 12px;
          background: linear-gradient(135deg, 
            rgb(59, 130, 246), 
            rgb(34, 197, 94),
            rgb(251, 146, 60)
          );
          box-shadow: 0 0 20px rgba(37, 99, 235, 0.4);
        }

        .premium-cursor.hovering .cursor-glow {
          width: 32px;
          height: 32px;
          background: radial-gradient(circle, 
            rgba(59, 130, 246, 0.4) 0%,
            rgba(34, 197, 94, 0.3) 50%,
            transparent 70%
          );
        }

        .premium-cursor.clicking .cursor-core {
          width: 6px;
          height: 6px;
          background: linear-gradient(135deg, 
            rgb(29, 78, 216), 
            rgb(5, 150, 105),
            rgb(234, 88, 12)
          );
        }

        .cursor-ripple {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 4px;
          height: 4px;
          border: 2px solid rgba(37, 99, 235, 0.6);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          animation: ripple 0.6s ease-out forwards;
        }

        .cursor-trail-dot {
          position: fixed;
          top: -3px;
          left: -3px;
          width: 6px;
          height: 6px;
          background: linear-gradient(135deg, 
            rgba(37, 99, 235, 0.8), 
            rgba(16, 185, 129, 0.6)
          );
          border-radius: 50%;
          pointer-events: none;
          transition: opacity 0.1s ease;
        }

        @keyframes glow-pulse {
          0%, 100% {
            opacity: 0.6;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.1);
          }
        }

        @keyframes ripple {
          0% {
            width: 4px;
            height: 4px;
            opacity: 1;
          }
          100% {
            width: 40px;
            height: 40px;
            opacity: 0;
          }
        }

        /* Dark mode adjustments */
        @media (prefers-color-scheme: dark) {
          .cursor-core {
            background: linear-gradient(135deg, 
              rgb(59, 130, 246), 
              rgb(34, 197, 94),
              rgb(251, 146, 60)
            );
          }
          
          .cursor-glow {
            background: radial-gradient(circle, 
              rgba(59, 130, 246, 0.4) 0%,
              rgba(34, 197, 94, 0.3) 50%,
              transparent 70%
            );
          }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .premium-cursor,
          .cursor-core,
          .cursor-glow,
          .cursor-trail-dot {
            animation: none;
            transition: none;
          }
        }

        /* Hide on touch devices */
        @media (hover: none) and (pointer: coarse) {
          .premium-cursor-container {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default PremiumCursor;