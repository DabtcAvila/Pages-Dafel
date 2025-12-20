'use client';

import { motion } from 'framer-motion';

export function DafelLogo3D({ className = "", size = "md" }: { 
  className?: string, 
  size?: "sm" | "md" | "lg" | "xl" 
}) {
  const sizes = {
    sm: { width: "120px", height: "80px", fontSize: "16px", subFont: "8px" },
    md: { width: "200px", height: "120px", fontSize: "28px", subFont: "12px" },
    lg: { width: "300px", height: "180px", fontSize: "42px", subFont: "16px" },
    xl: { width: "400px", height: "240px", fontSize: "56px", subFont: "20px" }
  };

  const currentSize = sizes[size];

  return (
    <motion.div 
      className={`relative ${className}`}
      style={{ 
        width: currentSize.width, 
        height: currentSize.height,
        perspective: "1000px"
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 400 240"
        className="relative z-10"
        style={{ filter: "drop-shadow(0 8px 32px rgba(0, 128, 255, 0.3))" }}
      >
        {/* Definiciones para gradientes 3D y efectos */}
        <defs>
          {/* Gradiente principal azul 3D */}
          <linearGradient id="blueGradient3D" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#60A5FA", stopOpacity: 1 }} />
            <stop offset="30%" style={{ stopColor: "#3B82F6", stopOpacity: 1 }} />
            <stop offset="70%" style={{ stopColor: "#1D4ED8", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#1E3A8A", stopOpacity: 1 }} />
          </linearGradient>

          {/* Gradiente para texto 3D */}
          <linearGradient id="textGradient3D" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#1F2937", stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: "#374151", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#111827", stopOpacity: 1 }} />
          </linearGradient>

          {/* Filtro glow para efectos luminosos */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Patrón de rejilla tech */}
          <pattern id="techGrid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(59, 130, 246, 0.1)" strokeWidth="0.5"/>
          </pattern>
        </defs>

        {/* Fondo tech con rejilla */}
        <rect width="100%" height="100%" fill="url(#techGrid)" opacity="0.3" />

        {/* Curva principal 3D modernizada */}
        <motion.g
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, delay: 0.3 }}
        >
          {/* Sombra de la curva */}
          <path
            d="M 80 60 Q 120 40 160 60 Q 200 80 240 70 Q 280 60 320 80 Q 340 90 350 110"
            fill="none"
            stroke="rgba(0, 0, 0, 0.2)"
            strokeWidth="12"
            transform="translate(3, 5)"
          />
          
          {/* Curva principal con gradiente 3D */}
          <path
            d="M 80 60 Q 120 40 160 60 Q 200 80 240 70 Q 280 60 320 80 Q 340 90 350 110"
            fill="none"
            stroke="url(#blueGradient3D)"
            strokeWidth="8"
            filter="url(#glow)"
          />
          
          {/* Línea de brillo superior */}
          <path
            d="M 80 60 Q 120 40 160 60 Q 200 80 240 70 Q 280 60 320 80 Q 340 90 350 110"
            fill="none"
            stroke="rgba(255, 255, 255, 0.6)"
            strokeWidth="2"
            transform="translate(0, -1)"
          />
        </motion.g>

        {/* Elementos tecnológicos flotantes */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 1 }}
        >
          {/* Partículas tech */}
          {[...Array(6)].map((_, i) => (
            <motion.circle
              key={i}
              cx={100 + i * 40}
              cy={40 + (i % 2) * 20}
              r="2"
              fill="#3B82F6"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 0], 
                scale: [0, 1, 0] 
              }}
              transition={{
                duration: 2,
                delay: i * 0.2 + 1.5,
                repeat: Infinity,
                repeatDelay: 3
              }}
            />
          ))}
        </motion.g>

        {/* Punto distintivo 3D modernizado */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.8 }}
        >
          {/* Sombra del punto */}
          <circle
            cx="353"
            cy="115" 
            r="8"
            fill="rgba(0, 0, 0, 0.3)"
          />
          
          {/* Punto principal */}
          <circle
            cx="350"
            cy="110" 
            r="6"
            fill="url(#blueGradient3D)"
            filter="url(#glow)"
          />
          
          {/* Brillo del punto */}
          <circle
            cx="348"
            cy="108" 
            r="2"
            fill="rgba(255, 255, 255, 0.8)"
          />
        </motion.g>

        {/* Texto DAFEL 3D */}
        <motion.g
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {/* Sombra del texto */}
          <text
            x="52"
            y="155"
            fontSize={currentSize.fontSize}
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight="800"
            fill="rgba(0, 0, 0, 0.3)"
            letterSpacing="2px"
          >
            DAFEL
          </text>
          
          {/* Texto principal */}
          <text
            x="50"
            y="150"
            fontSize={currentSize.fontSize}
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight="800"
            fill="url(#textGradient3D)"
            letterSpacing="2px"
            filter="url(#glow)"
          >
            DAFEL
          </text>
          
          {/* Brillo del texto */}
          <text
            x="50"
            y="150"
            fontSize={currentSize.fontSize}
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight="800"
            fill="rgba(255, 255, 255, 0.3)"
            letterSpacing="2px"
            mask="url(#textMask)"
          >
            DAFEL
          </text>
        </motion.g>

        {/* Subtexto modernizado */}
        <motion.text
          x="50"
          y="175"
          fontSize={currentSize.subFont}
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="400"
          fill="#6B7280"
          letterSpacing="3px"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          TECHNOLOGIES & AI
        </motion.text>

        {/* Líneas tech decorativas */}
        <motion.g
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <line x1="50" y1="185" x2="200" y2="185" stroke="#3B82F6" strokeWidth="1" opacity="0.6" />
          <line x1="50" y1="190" x2="150" y2="190" stroke="#60A5FA" strokeWidth="0.5" opacity="0.4" />
        </motion.g>
      </svg>
    </motion.div>
  );
}