'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, useMemo } from 'react'
import { cn } from '@/lib/utils'

interface RainbowRainProps {
  className?: string
  lineCount?: number
  speed?: number
}

export default function RainbowRain({ 
  className, 
  lineCount = 50,
  speed = 1 
}: RainbowRainProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Colores del arcoíris en gradiente
  const rainbowColors = [
    '#ff0000', // Rojo
    '#ff4000', // Rojo-Naranja
    '#ff8000', // Naranja
    '#ffbf00', // Naranja-Amarillo
    '#ffff00', // Amarillo
    '#bfff00', // Amarillo-Verde
    '#80ff00', // Verde Lima
    '#40ff00', // Verde
    '#00ff00', // Verde Puro
    '#00ff40', // Verde-Cian
    '#00ff80', // Verde Agua
    '#00ffbf', // Cian-Verde
    '#00ffff', // Cian
    '#00bfff', // Cian-Azul
    '#0080ff', // Azul Cielo
    '#0040ff', // Azul
    '#0000ff', // Azul Puro
    '#4000ff', // Azul-Violeta
    '#8000ff', // Violeta
    '#bf00ff', // Violeta-Magenta
    '#ff00ff', // Magenta
    '#ff00bf', // Magenta-Rosa
    '#ff0080', // Rosa
    '#ff0040', // Rosa-Rojo
  ]

  const rainLines = useMemo(() => {
    return Array.from({ length: lineCount }, (_, i) => {
      const colorIndex = i % rainbowColors.length
      const startDelay = (i * 0.1) % 5 // Escalonar inicio
      const duration = 3 + (Math.random() * 4) // Duración variable 3-7s
      const thickness = 1 + Math.random() * 3 // Grosor variable
      const opacity = 0.3 + Math.random() * 0.7 // Opacidad variable
      
      return {
        id: i,
        x: (i / lineCount) * 100, // Distribuir en todo el ancho
        color: rainbowColors[colorIndex],
        delay: startDelay,
        duration: duration * speed,
        thickness,
        opacity,
        // Altura variable para efecto más natural
        height: 20 + Math.random() * 60
      }
    })
  }, [lineCount, speed, rainbowColors])

  if (!mounted) {
    // Fallback estático para evitar hydration mismatch
    return (
      <div className={cn("fixed inset-0 -z-10", className)}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/20 to-transparent" />
      </div>
    )
  }

  return (
    <div className={cn("fixed inset-0 -z-10 overflow-hidden", className)}>
      {/* Fondo base con gradiente sutil */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />
      
      {/* Líneas de lluvia arcoíris */}
      {rainLines.map((line) => (
        <motion.div
          key={line.id}
          className="absolute top-0"
          style={{
            left: `${line.x}%`,
            width: `${line.thickness}px`,
            background: `linear-gradient(180deg, transparent 0%, ${line.color} 20%, ${line.color} 80%, transparent 100%)`,
            height: `${line.height}vh`,
            opacity: line.opacity,
          }}
          initial={{
            y: -window.innerHeight,
            scaleY: 0,
          }}
          animate={{
            y: window.innerHeight + 200,
            scaleY: [0, 1, 1, 0],
          }}
          transition={{
            duration: line.duration,
            delay: line.delay,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.1, 0.9, 1], // Control del fade in/out
          }}
        />
      ))}

      {/* Efecto de brillo superior */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white/30 to-transparent dark:from-slate-900/30 pointer-events-none" />
      
      {/* Efecto de desvanecimiento inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/50 to-transparent dark:from-slate-900/50 pointer-events-none" />

      {/* Partículas adicionales de brillo */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            background: rainbowColors[i % rainbowColors.length],
            boxShadow: `0 0 4px ${rainbowColors[i % rainbowColors.length]}`,
          }}
          initial={{
            y: -10,
            opacity: 0,
          }}
          animate={{
            y: window.innerHeight + 10,
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 6,
            delay: Math.random() * 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
}