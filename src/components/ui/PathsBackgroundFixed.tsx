'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';

// Componente de paths flotantes COMPLETAMENTE NUEVO
function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => {
    // Generar paths SVG únicos con matemáticas correctas
    const offset = i * 10 * position;
    const yVariation = i * 8;
    const path = `M-${380 + offset} -${189 + yVariation}C-${380 + offset} -${189 + yVariation} -${312 + offset} ${216 - yVariation} ${152 + offset} ${343 - yVariation}C${616 + offset} ${470 - yVariation} ${684 + offset} ${875 - yVariation} ${684 + offset} ${875 - yVariation}`;
    
    return {
      id: i,
      d: path,
      strokeWidth: 1 + (i * 0.05),
      opacity: 0.1 + (i * 0.02),
      duration: 15 + (i * 0.5),
      delay: i * 0.2,
    };
  });

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className="w-full h-full"
        viewBox="0 0 696 316"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.strokeWidth}
            fill="none"
            className="text-slate-900/10 dark:text-white/10"
            initial={{ 
              pathLength: 0,
              opacity: 0
            }}
            animate={{
              pathLength: [0, 1, 1, 0],
              opacity: [0, path.opacity, path.opacity, 0],
            }}
            transition={{
              duration: path.duration,
              repeat: Infinity,
              ease: "linear",
              delay: path.delay,
            }}
          />
        ))}
      </svg>
    </div>
  );
}

interface PathsBackgroundFixedProps {
  title?: string;
  buttonText?: string;
  buttonAction?: () => void;
}

export function PathsBackgroundFixed({
  title = 'Hola mundo',
  buttonText = 'Explorar Dafel Technologies',
  buttonAction,
}: PathsBackgroundFixedProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevenir hydration issues
  if (!mounted) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-neutral-950">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-8">
            {title}
          </h1>
          <Button variant="primary" onClick={buttonAction}>
            {buttonText}
          </Button>
        </div>
      </div>
    );
  }

  // Dividir título en palabras para animación
  const words = title.split(' ');

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-white dark:bg-neutral-950">
      {/* Fondo de paths animados - TRIPLE CAPA */}
      <div className="absolute inset-0 opacity-60">
        <FloatingPaths position={1} />
      </div>
      <div className="absolute inset-0 opacity-40">
        <FloatingPaths position={-0.7} />
      </div>
      <div className="absolute inset-0 opacity-30">
        <FloatingPaths position={0.3} />
      </div>
      
      {/* Contenido principal */}
      <div className="relative z-10 text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Título animado letra por letra */}
          <h1 className="text-6xl sm:text-8xl md:text-9xl font-bold mb-12 tracking-tight">
            {words.map((word, wordIndex) => (
              <span key={wordIndex} className="inline-block mr-6 last:mr-0">
                {word.split('').map((letter, letterIndex) => (
                  <motion.span
                    key={`${wordIndex}-${letterIndex}`}
                    initial={{ y: 100, opacity: 0, rotateX: -90 }}
                    animate={{ y: 0, opacity: 1, rotateX: 0 }}
                    transition={{
                      delay: (wordIndex * 0.3) + (letterIndex * 0.05),
                      type: 'spring',
                      stiffness: 200,
                      damping: 20,
                    }}
                    className="inline-block text-transparent bg-clip-text bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 dark:from-white dark:via-gray-200 dark:to-gray-300"
                  >
                    {letter === ' ' ? '\u00A0' : letter}
                  </motion.span>
                ))}
              </span>
            ))}
          </h1>

          {/* Botón con efectos profesionales */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, duration: 0.6, ease: "easeOut" }}
          >
            <Button
              variant="primary"
              size="xl"
              onClick={buttonAction}
              className="relative overflow-hidden group"
            >
              <span className="relative z-10">{buttonText}</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100"
                initial={{ x: '-100%' }}
                whileHover={{ x: '0%' }}
                transition={{ duration: 0.3 }}
              />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}