'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function FloatingPaths({ position }: { position: number }) {
  // PALETA VISIBLE Y VIBRANTE - Solo colores que se ven claramente
  const dafelColors = [
    // AZULES VIBRANTES Y VISIBLES
    '#87CEEB', '#87CEFA', '#00BFFF', '#1E90FF', '#4FC3F7', '#40A9FF',
    '#29B6F6', '#03A9F4', '#2196F3', '#42A5F5', '#64B5F6', '#90CAF9',
    '#BBDEFB', '#1890FF', '#00CCFF', '#33DDFF', '#66EEFF', '#00BBFF',
    '#33BBFF', '#66CCFF', '#4A90E2', '#5DADE2', '#74B9FF', '#6BB6FF',
    
    // AZULES CORPORATIVOS DAFEL VISIBLES
    '#1976D2', '#2196F3', '#42A5F5', '#64B5F6', '#90CAF9', '#BBDEFB',
    '#E3F2FD', '#91D5FF', '#69C0FF', '#40A9FF', '#1890FF', '#0D47A1',
    
    // VERDES NATURALES QUE SE VEN BIEN
    '#98FB98', '#90EE90', '#66CDAA', '#C4EB92', '#B7E779', '#A9E260',
    '#9CDE47', '#D1EFAB', '#C3E6CB', '#D4EDDA', '#DDF2C4', '#E8F5D6',
    
    // TURQUESA Y CYAN VISIBLES
    '#00BCD4', '#26C6DA', '#4DD0E1', '#80DEEA', '#B2EBF2', '#E0F7FA',
    '#81D4FA', '#B3E5FC', '#ADD8E6', '#B0E0E6', '#87CEEB', '#87CEFA',
    
    // VERDE AGUA ELEGANTE Y VISIBLE
    '#00BCD4', '#26C6DA', '#4DD0E1', '#80DEEA', '#B2EBF2', '#E0F7FA',
    '#48D1CC', '#40E0D0', '#7FDBFF', '#39CCCC', '#20B2AA', '#66CDAA',
    
    // MÁS AZULES CLAROS PERO VISIBLES
    '#E6F7FF', '#BAE7FF', '#91D5FF', '#69C0FF', '#40A9FF', '#1890FF',
    '#E3F2FD', '#BBDEFB', '#90CAF9', '#64B5F6', '#42A5F5', '#2196F3',
    
    // REPETIR FAVORITOS PARA MÁS PRESENCIA
    '#87CEEB', '#87CEFA', '#00BFFF', '#1E90FF', '#4FC3F7', '#40A9FF',
    '#98FB98', '#90EE90', '#66CDAA', '#00BCD4', '#26C6DA', '#4DD0E1'
  ];

  // Ajustar separación: 30% + 35% + 35% + 35% = 85.2% menor para paths hiper juntitos
  const horizontalSpacing = position === -1 ? (5 * 0.4) * 0.7 * 0.65 * 0.65 * 0.65 : 5 * 0.7 * 0.65 * 0.65 * 0.65; // 0.384 para traseros, 0.961 para delanteros  
  const verticalSpacing = position === -1 ? (6 * 0.4) * 0.7 * 0.65 * 0.65 * 0.65 : 6 * 0.7 * 0.65 * 0.65 * 0.65;   // 0.461 para traseros, 1.154 para delanteros

  // Ajustar posición inicial Y y ángulo de bajada para cruzamiento moderado
  const initialY = position === -1 ? -315 : -235; // Punto medio entre -350/-280 y -250/-220
  const descentRate = position === -1 ? 11 : 9;   // Punto medio entre 15/12 y 8/6

  const paths = Array.from({ length: 36 }, (_, i) => {
    // ENCIMAMIENTO VISIBLE - Separación mínima pero perceptible
    const startX = -450 + i * 5; // Separación visible en el inicio
    const startY = initialY + i * descentRate;
    
    const midX = 82 + i * 2; // Convergencia fuerte en el centro 
    const midY = 343 + i * descentRate;
    
    const endX = 614 + i * 8; // Separación visible en el final
    const endY = 875 + i * descentRate;
    
    // Controles MICROSCÓPICOS - zoom extremo a curva masiva
    const control1X = startX + (midX - startX) * 0.001; // 0.1% - casi pegado al inicio
    const control1Y = startY + (midY - startY) * 1.002; // Curvatura de 0.2% extra
    
    const control2X = startX + (midX - startX) * 0.999; // 99.9% - casi pegado al punto medio
    const control2Y = startY + (midY - startY) * 0.001; // Control de 0.1%
    
    const control3X = midX + (endX - midX) * 0.001; // 0.1% - casi pegado después del medio
    const control3Y = midY + (endY - midY) * 1.001; // Curvatura de 0.1% extra
    
    const control4X = midX + (endX - midX) * 0.999; // 99.9% - casi pegado al final
    const control4Y = midY + (endY - midY) * 0.0005; // Control microscópico 0.05%

    // ARCOÍRIS CON VERDES VISIBLES EN AMBOS EXTREMOS
    const totalPaths = 36;
    const greenFavorites = [
      '#98FB98', '#90EE90', '#66CDAA', '#C4EB92', '#B7E779', '#A9E260', // Verdes naturales visibles
      '#9CDE47', '#D1EFAB', '#C3E6CB', '#D4EDDA', '#DDF2C4', '#E8F5D6', // Verdes suaves pero visibles
      '#00BCD4', '#26C6DA', '#4DD0E1', '#80DEEA', '#B2EBF2', '#E0F7FA', // Turquesa visible
      '#48D1CC', '#40E0D0', '#7FDBFF', '#39CCCC', '#20B2AA', '#66CDAA', // Verde agua que se ve
      '#81D4FA', '#B3E5FC', '#ADD8E6', '#B0E0E6', '#87CEEB', '#87CEFA'  // Azul-verde visible
    ];
    
    let selectedColor;
    if (i < 6) {
      // PARTE INFERIOR (primeros 6): Verde-amarilloso dominante
      selectedColor = greenFavorites[i % greenFavorites.length];
    } else if (i >= totalPaths - 6) {
      // PARTE SUPERIOR (últimos 6): Verde-amarilloso dominante también
      selectedColor = greenFavorites[(i - (totalPaths - 6)) % greenFavorites.length];
    } else {
      // PARTE MEDIA: paleta completa con verde ya ultra presente
      selectedColor = dafelColors[i % dafelColors.length];
    }

    return {
      id: i,
      d: `M${startX} ${startY}C${control1X} ${control1Y} ${control2X} ${control2Y} ${midX} ${midY}C${control3X} ${control3Y} ${control4X} ${control4Y} ${endX} ${endY}`,
      color: selectedColor,
      width: (0.5 + i * 0.03) * 10, // Grosor 1000% (súper grueso)
    };
  });

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className="w-full h-full md:hidden"
        viewBox="0 0 696 1000"
        fill="none"
      >
        <title>Background Paths Mobile</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke={path.color}
            strokeWidth={path.width}
            strokeOpacity={(0.1 + path.id * 0.03) + 0.2}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: 1,
              opacity: 0.8,
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              delay: path.id * 0.1,
              ease: 'easeOut',
            }}
          />
        ))}
      </svg>
      
      {/* Desktop version - más zoom, menos curvas visibles */}
      <svg
        className="w-full h-full hidden md:block"
        viewBox="100 200 400 600"
        fill="none"
      >
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke={path.color}
            strokeWidth={path.width}
            strokeOpacity={(0.1 + path.id * 0.03) + 0.2}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: 1,
              opacity: 0.8,
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              delay: path.id * 0.1,
              ease: 'easeOut',
            }}
          />
        ))}
      </svg>
    </div>
  );
}

export interface BackgroundPathsProps {
  title?: string;
}

export function BackgroundPathsAzure({
  title = 'Background Paths',
}: BackgroundPathsProps) {
  const words = title.split(' ');

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-white dark:bg-neutral-950">
      <div className="absolute inset-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      <div className="relative z-10 container mx-auto px-8 md:px-12 text-center overflow-visible">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="max-w-7xl mx-auto px-8"
        >
          <h1 className="text-8xl sm:text-9xl md:text-[12rem] font-bold mb-8 tracking-tight overflow-visible">
            {words.map((word, wordIndex) => (
              <span
                key={wordIndex}
                className="inline-block mr-6 last:mr-0 overflow-visible"
              >
                {word.split('').map((letter, letterIndex) => (
                  <motion.span
                    key={`${wordIndex}-${letterIndex}`}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      delay: wordIndex * 0.5 + letterIndex * 0.15,
                      type: 'spring',
                      stiffness: 80,
                      damping: 20,
                    }}
                    className="inline-block text-transparent bg-clip-text 
                      bg-gradient-to-r from-neutral-900 to-neutral-900 
                      dark:from-white dark:to-white overflow-visible"
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
            ))}
          </h1>

          <div
            className="inline-block group relative bg-gradient-to-b from-black/10 to-white/10 
              dark:from-white/10 dark:to-black/10 p-px rounded-2xl backdrop-blur-lg 
              overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <Button
              variant="ghost"
              className="rounded-[1.15rem] px-8 py-6 text-lg font-semibold backdrop-blur-md 
                bg-white/95 hover:bg-white/100 dark:bg-black/95 dark:hover:bg-black/100 
                text-black dark:text-white transition-all duration-300 
                group-hover:-translate-y-0.5 border border-black/10 dark:border-white/10
                hover:shadow-md dark:hover:shadow-neutral-800/50"
            >
              <span className="opacity-90 group-hover:opacity-100 transition-opacity">
                Discover Excellence
              </span>
              <span
                className="ml-3 opacity-70 group-hover:opacity-100 group-hover:translate-x-1.5 
                  transition-all duration-300"
              >
                →
              </span>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}