/**
 * WINDSURF WAVE BACKGROUND COMPONENT
 * Replica exacta del efecto visual de ondas gradientes de Windsurf.com
 * Implementa SVG con paths curvos y gradientes radiales animados
 */

'use client';

import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';

// ===== INTERFACES =====

export interface WindsurfWaveBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  intensity?: 'low' | 'medium' | 'high';
  animated?: boolean;
  responsive?: boolean;
}

// ===== COLORES EXACTOS DE WINDSURF =====

const WINDSURF_COLORS = {
  lightGreen: '#ECFBA9',    // Verde claro
  brightYellow: '#D7FF25',  // Amarillo brillante  
  fuchsiaPink: '#FB9CE5',   // Rosa fucsia
  transparent: 'transparent'
};

// ===== WINDSURF WAVE BACKGROUND COMPONENT =====

export const WindsurfWaveBackground = forwardRef<HTMLDivElement, WindsurfWaveBackgroundProps>(({
  children,
  className = '',
  style,
  intensity = 'medium',
  animated = true,
  responsive = true,
  ...props
}, ref) => {

  // ===== ANIMATION VARIANTS =====

  const waveVariants = {
    initial: {
      opacity: 0,
      scale: 0.95
    },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 2,
        ease: "easeOut"
      }
    }
  };

  const flowVariants = {
    animate: {
      backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  // ===== COMPUTED STYLES =====

  const getIntensityOpacity = () => {
    const intensityMap = {
      low: 0.6,
      medium: 0.8,
      high: 1.0
    };
    return intensityMap[intensity];
  };

  const backgroundStyle = {
    opacity: getIntensityOpacity(),
    ...style
  };

  const combinedClassName = [
    'windsurf-wave-background',
    'absolute inset-0 overflow-hidden',
    responsive ? 'w-full h-full' : '',
    className
  ].filter(Boolean).join(' ');

  // ===== RENDER =====

  return (
    <motion.div
      ref={ref}
      className={combinedClassName}
      style={backgroundStyle}
      variants={waveVariants}
      initial="initial"
      animate="animate"
      {...props}
    >
      {/* SVG Wave Background - Replica exacta de Windsurf */}
      <motion.div
        className="absolute inset-0"
        variants={animated ? flowVariants : undefined}
        animate={animated ? "animate" : undefined}
      >
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 4682 2581"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Definición de gradientes radiales */}
          <defs>
            {/* Gradiente 1 - Verde claro a transparente */}
            <radialGradient id="windsurf-gradient-1" cx="20%" cy="30%" r="40%">
              <stop offset="0%" stopColor={WINDSURF_COLORS.lightGreen} stopOpacity="0.9" />
              <stop offset="50%" stopColor={WINDSURF_COLORS.lightGreen} stopOpacity="0.5" />
              <stop offset="100%" stopColor={WINDSURF_COLORS.lightGreen} stopOpacity="0" />
            </radialGradient>

            {/* Gradiente 2 - Amarillo brillante a transparente */}
            <radialGradient id="windsurf-gradient-2" cx="70%" cy="20%" r="35%">
              <stop offset="0%" stopColor={WINDSURF_COLORS.brightYellow} stopOpacity="0.8" />
              <stop offset="40%" stopColor={WINDSURF_COLORS.brightYellow} stopOpacity="0.4" />
              <stop offset="100%" stopColor={WINDSURF_COLORS.brightYellow} stopOpacity="0" />
            </radialGradient>

            {/* Gradiente 3 - Rosa fucsia a transparente */}
            <radialGradient id="windsurf-gradient-3" cx="50%" cy="70%" r="45%">
              <stop offset="0%" stopColor={WINDSURF_COLORS.fuchsiaPink} stopOpacity="0.7" />
              <stop offset="60%" stopColor={WINDSURF_COLORS.fuchsiaPink} stopOpacity="0.3" />
              <stop offset="100%" stopColor={WINDSURF_COLORS.fuchsiaPink} stopOpacity="0" />
            </radialGradient>

            {/* Gradiente 4 - Mezcla verde-amarillo */}
            <radialGradient id="windsurf-gradient-4" cx="10%" cy="80%" r="30%">
              <stop offset="0%" stopColor={WINDSURF_COLORS.lightGreen} stopOpacity="0.6" />
              <stop offset="30%" stopColor={WINDSURF_COLORS.brightYellow} stopOpacity="0.4" />
              <stop offset="100%" stopColor={WINDSURF_COLORS.transparent} stopOpacity="0" />
            </radialGradient>

            {/* Gradiente 5 - Mezcla amarillo-rosa */}
            <radialGradient id="windsurf-gradient-5" cx="90%" cy="60%" r="38%">
              <stop offset="0%" stopColor={WINDSURF_COLORS.brightYellow} stopOpacity="0.7" />
              <stop offset="40%" stopColor={WINDSURF_COLORS.fuchsiaPink} stopOpacity="0.5" />
              <stop offset="100%" stopColor={WINDSURF_COLORS.transparent} stopOpacity="0" />
            </radialGradient>

            {/* Gradiente 6 - Mezcla rosa-verde */}
            <radialGradient id="windsurf-gradient-6" cx="30%" cy="10%" r="42%">
              <stop offset="0%" stopColor={WINDSURF_COLORS.fuchsiaPink} stopOpacity="0.6" />
              <stop offset="50%" stopColor={WINDSURF_COLORS.lightGreen} stopOpacity="0.3" />
              <stop offset="100%" stopColor={WINDSURF_COLORS.transparent} stopOpacity="0" />
            </radialGradient>

            {/* Gradiente 7 - Verde intenso centro */}
            <radialGradient id="windsurf-gradient-7" cx="60%" cy="40%" r="25%">
              <stop offset="0%" stopColor={WINDSURF_COLORS.lightGreen} stopOpacity="0.9" />
              <stop offset="70%" stopColor={WINDSURF_COLORS.lightGreen} stopOpacity="0.2" />
              <stop offset="100%" stopColor={WINDSURF_COLORS.transparent} stopOpacity="0" />
            </radialGradient>

            {/* Gradiente 8 - Amarillo difuso */}
            <radialGradient id="windsurf-gradient-8" cx="80%" cy="90%" r="50%">
              <stop offset="0%" stopColor={WINDSURF_COLORS.brightYellow} stopOpacity="0.5" />
              <stop offset="80%" stopColor={WINDSURF_COLORS.brightYellow} stopOpacity="0.1" />
              <stop offset="100%" stopColor={WINDSURF_COLORS.transparent} stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Ondas con paths curvos - Layer 1 */}
          <path
            d="M0,1200 Q1170,800 2341,1000 T4682,1200 L4682,2581 L0,2581 Z"
            fill="url(#windsurf-gradient-1)"
            className="windsurf-wave-path"
          />

          {/* Ondas con paths curvos - Layer 2 */}
          <path
            d="M0,1400 Q1170,1100 2341,1300 T4682,1400 L4682,2581 L0,2581 Z"
            fill="url(#windsurf-gradient-2)"
            className="windsurf-wave-path"
          />

          {/* Ondas con paths curvos - Layer 3 */}
          <path
            d="M0,1600 Q1170,1200 2341,1500 T4682,1600 L4682,2581 L0,2581 Z"
            fill="url(#windsurf-gradient-3)"
            className="windsurf-wave-path"
          />

          {/* Ondas flotantes - Elementos adicionales */}
          <ellipse
            cx="1000"
            cy="600"
            rx="400"
            ry="200"
            fill="url(#windsurf-gradient-4)"
            className="windsurf-floating-wave"
          />

          <ellipse
            cx="3500"
            cy="800"
            rx="600"
            ry="300"
            fill="url(#windsurf-gradient-5)"
            className="windsurf-floating-wave"
          />

          <ellipse
            cx="2300"
            cy="400"
            rx="500"
            ry="250"
            fill="url(#windsurf-gradient-6)"
            className="windsurf-floating-wave"
          />

          <ellipse
            cx="800"
            cy="1800"
            rx="300"
            ry="150"
            fill="url(#windsurf-gradient-7)"
            className="windsurf-floating-wave"
          />

          <ellipse
            cx="3800"
            cy="1600"
            rx="700"
            ry="350"
            fill="url(#windsurf-gradient-8)"
            className="windsurf-floating-wave"
          />
        </svg>
      </motion.div>

      {/* Content Layer */}
      <div className="relative z-10">
        {children}
      </div>

    </motion.div>
  );
});

WindsurfWaveBackground.displayName = 'WindsurfWaveBackground';

export default WindsurfWaveBackground;