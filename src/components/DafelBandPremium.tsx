'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface DafelBandPremiumProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
}

export function DafelBandPremium({ 
  className = "", 
  size = "lg",
  animated = true 
}: DafelBandPremiumProps) {
  const sizes = {
    sm: { width: "400px", height: "200px" },
    md: { width: "600px", height: "300px" },
    lg: { width: "800px", height: "400px" },
    xl: { width: "1200px", height: "600px" }
  };

  const currentSize = sizes[size];

  return (
    <motion.div 
      className={cn("relative overflow-hidden", className)}
      style={{ 
        width: currentSize.width, 
        height: currentSize.height
      }}
      initial={animated ? { opacity: 0, scale: 0.95 } : {}}
      animate={animated ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 938 375"
        className="absolute inset-0"
        preserveAspectRatio="none"
      >
        <defs>
          {/* GRADIENTES EXACTOS DEL ORIGINAL */}
          
          {/* Azul claro translúcido - capas externas */}
          <radialGradient id="lightBlue" cx="30%" cy="70%" r="80%">
            <stop offset="0%" style={{ stopColor: "#B3E5FC", stopOpacity: 0.3 }} />
            <stop offset="40%" style={{ stopColor: "#87CEEB", stopOpacity: 0.4 }} />
            <stop offset="80%" style={{ stopColor: "#E1F5FE", stopOpacity: 0.2 }} />
            <stop offset="100%" style={{ stopColor: "#F0F8FF", stopOpacity: 0.1 }} />
          </radialGradient>

          {/* Azul medio - capas intermedias */}
          <radialGradient id="mediumBlue" cx="35%" cy="65%" r="70%">
            <stop offset="0%" style={{ stopColor: "#4FC3F7", stopOpacity: 0.4 }} />
            <stop offset="50%" style={{ stopColor: "#29B6F6", stopOpacity: 0.5 }} />
            <stop offset="100%" style={{ stopColor: "#81D4FA", stopOpacity: 0.3 }} />
          </radialGradient>

          {/* Verde agua - exacto del original */}
          <radialGradient id="aquaGreen" cx="40%" cy="60%" r="60%">
            <stop offset="0%" style={{ stopColor: "#26C6DA", stopOpacity: 0.5 }} />
            <stop offset="30%" style={{ stopColor: "#00BCD4", stopOpacity: 0.6 }} />
            <stop offset="70%" style={{ stopColor: "#4DD0E1", stopOpacity: 0.4 }} />
            <stop offset="100%" style={{ stopColor: "#B2EBF2", stopOpacity: 0.2 }} />
          </radialGradient>

          {/* Azul intenso - capa interna */}
          <radialGradient id="deepBlue" cx="45%" cy="55%" r="50%">
            <stop offset="0%" style={{ stopColor: "#1976D2", stopOpacity: 0.6 }} />
            <stop offset="40%" style={{ stopColor: "#2196F3", stopOpacity: 0.7 }} />
            <stop offset="100%" style={{ stopColor: "#42A5F5", stopOpacity: 0.4 }} />
          </radialGradient>

          {/* Verde claro para segmentos */}
          <linearGradient id="lightGreen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#A8E6CF", stopOpacity: 0.4 }} />
            <stop offset="50%" style={{ stopColor: "#88D8A3", stopOpacity: 0.5 }} />
            <stop offset="100%" style={{ stopColor: "#68B684", stopOpacity: 0.3 }} />
          </linearGradient>
        </defs>

        {/* ARCO PRINCIPAL - Capa externa azul muy claro */}
        <motion.path
          d="M 50 320 Q 200 120 400 180 Q 600 240 750 150 Q 850 100 938 140"
          fill="url(#lightBlue)"
          stroke="none"
          initial={animated ? { pathLength: 0, opacity: 0 } : {}}
          animate={animated ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 2, delay: 0.2, ease: "easeOut" }}
        />

        {/* ARCO INTERMEDIO - Capa azul medio */}
        <motion.path
          d="M 80 310 Q 220 130 420 190 Q 620 250 760 160 Q 860 110 920 150"
          fill="url(#mediumBlue)"
          stroke="none"
          initial={animated ? { pathLength: 0, opacity: 0 } : {}}
          animate={animated ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 1.8, delay: 0.4, ease: "easeOut" }}
        />

        {/* ARCO VERDE AGUA - Como en el original */}
        <motion.path
          d="M 120 300 Q 260 140 440 200 Q 640 260 780 170 Q 880 120 900 160"
          fill="url(#aquaGreen)"
          stroke="none"
          initial={animated ? { pathLength: 0, opacity: 0 } : {}}
          animate={animated ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 1.6, delay: 0.6, ease: "easeOut" }}
        />

        {/* ARCO INTERNO - Azul intenso */}
        <motion.path
          d="M 160 290 Q 300 150 460 210 Q 660 270 800 180 Q 900 130 880 170"
          fill="url(#deepBlue)"
          stroke="none"
          initial={animated ? { pathLength: 0, opacity: 0 } : {}}
          animate={animated ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 1.4, delay: 0.8, ease: "easeOut" }}
        />

        {/* SEGMENTOS RECTANGULARES - EXACTOS DEL ORIGINAL */}
        <g>
          {/* Segmentos azules del área central */}
          {[
            { x: 380, y: 195, w: 25, h: 55, angle: -8 },
            { x: 410, y: 205, w: 30, h: 50, angle: -5 },
            { x: 445, y: 210, w: 28, h: 60, angle: -2 },
            { x: 480, y: 215, w: 32, h: 45, angle: 2 },
            { x: 520, y: 220, w: 26, h: 55, angle: 5 },
            { x: 555, y: 225, w: 30, h: 50, angle: 8 },
            { x: 590, y: 230, w: 24, h: 40, angle: 12 }
          ].map((seg, i) => (
            <motion.rect
              key={`blue-seg-${i}`}
              x={seg.x}
              y={seg.y}
              width={seg.w}
              height={seg.h}
              rx="2"
              fill="url(#mediumBlue)"
              opacity="0.7"
              transform={`rotate(${seg.angle} ${seg.x + seg.w/2} ${seg.y + seg.h/2})`}
              initial={animated ? { opacity: 0, scale: 0.8 } : {}}
              animate={animated ? { opacity: 0.7, scale: 1 } : {}}
              transition={{ 
                duration: 0.6, 
                delay: 1.2 + i * 0.05, 
                ease: "easeOut" 
              }}
            />
          ))}

          {/* Segmentos verdes del área superior */}
          {[
            { x: 420, y: 175, w: 22, h: 35, angle: -10 },
            { x: 460, y: 180, w: 28, h: 40, angle: -6 },
            { x: 500, y: 185, w: 25, h: 38, angle: -2 },
            { x: 540, y: 190, w: 30, h: 42, angle: 3 },
            { x: 580, y: 195, w: 26, h: 36, angle: 7 }
          ].map((seg, i) => (
            <motion.rect
              key={`green-seg-${i}`}
              x={seg.x}
              y={seg.y}
              width={seg.w}
              height={seg.h}
              rx="2"
              fill="url(#lightGreen)"
              opacity="0.6"
              transform={`rotate(${seg.angle} ${seg.x + seg.w/2} ${seg.y + seg.h/2})`}
              initial={animated ? { opacity: 0, scale: 0.9 } : {}}
              animate={animated ? { opacity: 0.6, scale: 1 } : {}}
              transition={{ 
                duration: 0.5, 
                delay: 1.8 + i * 0.04, 
                ease: "easeOut" 
              }}
            />
          ))}
        </g>

        {/* LÍNEAS BLANCAS DE CONEXIÓN - Como en el original */}
        <g stroke="rgba(255, 255, 255, 0.6)" strokeWidth="1" fill="none">
          {[
            { x1: 400, y1: 200, x2: 440, y2: 190 },
            { x1: 450, y1: 210, x2: 490, y2: 200 },
            { x1: 500, y1: 220, x2: 540, y2: 210 },
            { x1: 550, y1: 230, x2: 590, y2: 220 },
            { x1: 430, y1: 180, x2: 470, y2: 175 },
            { x1: 480, y1: 185, x2: 520, y2: 180 },
            { x1: 530, y1: 195, x2: 570, y2: 190 }
          ].map((line, i) => (
            <motion.line
              key={`line-${i}`}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              initial={animated ? { opacity: 0 } : {}}
              animate={animated ? { opacity: 0.6 } : {}}
              transition={{ 
                duration: 0.4, 
                delay: 2.2 + i * 0.03, 
                ease: "easeOut" 
              }}
            />
          ))}
        </g>
      </svg>
    </motion.div>
  );
}