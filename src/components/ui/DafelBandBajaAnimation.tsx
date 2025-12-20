'use client';

import React, { useState, useEffect } from 'react';
import { motion, useAnimation, Variants } from 'framer-motion';

// Configuración de elementos path con sus propiedades de animación
const pathElements = [
  // Bandas principales (velocidad base: 2-3 segundos)
  {
    id: 'rect6-7-8',
    d: 'm53.48 22.493s50.058 125.32 208.66 67.839c0.4001 39.429-0.0607 0.021 0.47146 39.403-182.76 63.714-244.93-91.761-244.93-91.761z',
    fill: 'url(#linearGradient39)',
    speed: 1.0,
    delay: 0,
    size: 'large'
  },
  {
    id: 'rect6-7-0-95',
    d: 'm51.671 35.732s50.929 93.351 209.53 35.875c0.4001 39.429-0.0607 0.021 0.47146 39.403-182.76 63.714-223.12-69.36-223.12-69.36z',
    fill: 'url(#linearGradient87)',
    speed: 1.0,
    delay: 0.1,
    size: 'large'
  },
  {
    id: 'rect6-7-0-4',
    d: 'm52.766 9.2604s50.058 125.32 208.66 67.839c0.4001 39.429-0.0607 0.021 0.47146 39.403-182.76 63.714-244.93-91.761-244.93-91.761z',
    fill: 'url(#linearGradient41)',
    speed: 1.0,
    delay: 0.2,
    size: 'large'
  },
  {
    id: 'rect6-7-0-7',
    d: 'm85.083 65.678s60.727 70.285 175.53 11.124c0.4001 39.429 1.2308-2.3037 1.763 37.078-115.38 47.991-197.19-30.553-197.19-30.553z',
    fill: 'url(#linearGradient61)',
    speed: 1.0,
    delay: 0.3,
    size: 'large'
  },
  
  // Elementos medios (velocidad 1.3x: 1.5-2 segundos)
  {
    id: 'rect6-7-0-9',
    d: 'm134.2 90.227s21.858 43.61 127.57 3.5392c0.65531 26.416-0.0405 0.0147 0.70287 26.398-121.84 44.488-152.1-19.212-152.1-19.212z',
    fill: 'url(#linearGradient60)',
    speed: 1.3,
    delay: 0.4,
    size: 'medium'
  },
  {
    id: 'rect6-7-0-6-0',
    d: 'm138.5 71.683s60.653 32.393 123.31-26.916c0.16921 50.63 0.13256-0.1557 0.41218 50.379-61.62 49.967-139.34 10.2-139.34 10.2z',
    fill: 'url(#linearGradient40)',
    speed: 1.3,
    delay: 0.5,
    size: 'medium'
  },
  {
    id: 'rect6-7-0-6-0-8',
    d: 'm138.68 84.608s60.198 26.624 123.01-23.091c0.16961 42.439 0.13286 4.8833 0.41315 47.243-61.766 41.884-136.38 15.56-136.38 15.56z',
    fill: 'url(#linearGradient91)',
    speed: 1.3,
    delay: 0.6,
    size: 'medium'
  },
  {
    id: 'rect6-7-0-6-9-34',
    d: 'm51.635 35.599s52.222 101.03 185.08 52.888c0.33515 33.029-0.0508 0.0176 0.39493 33.007-153.1 53.372-205.17-76.866-205.17-76.866z',
    fill: 'url(#linearGradient81)',
    speed: 1.3,
    delay: 0.7,
    size: 'medium'
  },
  {
    id: 'rect6-7-0-6-9-0',
    d: 'm124.99 74.977s71.248 34.184 136.57-13.422c0.27149 30.512-0.0412 5.8371 0.31991 36.313-92.959 39.253-153.17 8.0573-153.17 8.0573z',
    fill: 'url(#linearGradient42)',
    speed: 1.3,
    delay: 0.8,
    size: 'medium'
  },
  {
    id: 'rect6-7-6-6-3',
    d: 'm92.997 67.974s38.216 53.476 148.65 27.519c0.27858 17.806-0.0422 9e-3 0.32826 17.794-127.26 28.774-159.54-36.672-159.54-36.672z',
    fill: 'url(#linearGradient56)',
    speed: 1.3,
    delay: 0.9,
    size: 'medium'
  },
  {
    id: 'rect6-7-6-6-5',
    d: 'm64.06 53.442s38.956 78.39 162.38 42.437c0.31137 24.664-0.0472 0.0132 0.36689 24.648-142.23 39.856-190.6-57.4-190.6-57.4z',
    fill: 'url(#linearGradient55)',
    speed: 1.3,
    delay: 1.0,
    size: 'medium'
  },
  {
    id: 'rect6-7-0-6-9-3-3-1',
    d: 'm118.81 82.647s51.405 35.715 137.5 4.5154c0.21718 21.403-0.0329 0.0114 0.25591 21.389-99.209 34.586-151.11-14.299-151.11-14.299z',
    fill: 'url(#linearGradient64)',
    speed: 1.3,
    delay: 1.1,
    size: 'medium'
  },
  {
    id: 'rect6-7-0-6-9-3-3-4',
    d: 'm47.745 11.667s38.572 87.639 124.74 89.091c-23.557 13.199-0.96681 0.0863-2.7416 11.132-82.466-1.12-131.54-96.322-131.54-96.322z',
    fill: 'url(#linearGradient44)',
    speed: 1.3,
    delay: 1.2,
    size: 'medium'
  },
  {
    id: 'rect6-7-0-3-8-9-6',
    d: 'm98.4 80.655s76.588 48.371 162.68 17.171c0.21719 21.403-0.0329 0.0114 0.25592 21.389-99.209 34.586-182.37-30.157-182.37-30.157z',
    fill: 'url(#linearGradient59)',
    speed: 1.3,
    delay: 1.3,
    size: 'medium'
  },
  {
    id: 'rect6-7-0-6-9-3-3-9-8-7',
    d: 'm95.376 71.902s34.199 55.757 166.54 24.596c0.33384 21.377-0.0506 3.1864 0.39337 24.538-152.5 34.544-190.42-30.58-190.42-30.58z',
    fill: 'url(#linearGradient54)',
    speed: 1.3,
    delay: 1.4,
    size: 'medium'
  },
  {
    id: 'rect6-7-86',
    d: 'm34.817 9.6532s22.535 70.141 95.68 104.84c-0.47751 0.97568-5.7508 12.604-6.4379 13.877-70.536-33.82-108.22-118.64-108.22-118.64z',
    fill: 'url(#linearGradient46)',
    speed: 1.3,
    delay: 1.5,
    size: 'medium'
  },
  {
    id: 'rect6-7-86-8',
    d: 'm84.537 75.254s49.233 44.597 129.98 38.782c0.0651 1.0843 1.2012 13.802 1.2299 15.248-78.045 5.2973-147.69-44.613-147.69-44.613z',
    fill: 'url(#linearGradient52)',
    speed: 1.3,
    delay: 1.6,
    size: 'medium'
  },
  {
    id: 'rect6-7-0-3-8-91-1-25',
    d: 'm162.96 94.605s41.021 3.8428 84.806-2.4362c-3e-3 18.023-0.0366 0.69011 0.0181 18.537-40.759 5.7309-87.427 2.0648-87.427 2.0648z',
    fill: 'url(#linearGradient82)',
    speed: 1.3,
    delay: 1.7,
    size: 'medium'
  },

  // Fragmentos pequeños (velocidad 1.8-2.5x: 0.8-1.2 segundos)
  {
    id: 'rect6-7-0-3-8-91-3',
    d: 'm175.38 93.514s47.859 1.1706 86.516-24.851c-1.7813 22.206 9e-3 0.21597-1.6999 22.119-37.208 21.693-80.751 21.278-80.751 21.278z',
    fill: 'url(#linearGradient85)',
    speed: 1.8,
    delay: 1.8,
    size: 'small'
  },
  {
    id: 'rect6-7-6-6-3-3',
    d: 'm208.65 113.56s28.396 6.5606 44.563-8.1258c0.5626 9.0309-0.163 0.25789 0.28588 8.6606-19.551 13.782-49.215 5.8914-49.215 5.8914z',
    fill: 'url(#linearGradient58)',
    speed: 2.0,
    delay: 1.9,
    size: 'small'
  },
  {
    id: 'rect6-7-0-3-8-91-7',
    d: 'm225.66 98.88s13.637 5.6585 31.461-3.5904c-1.6939 11.733-0.0606 0.0189-1.6473 11.748-16.583 7.1473-31.578 2.0085-31.578 2.0085z',
    fill: 'url(#linearGradient84)',
    speed: 2.2,
    delay: 2.0,
    size: 'small'
  },
  {
    id: 'rect6-7-0-3-8-91-1-18',
    d: 'm187.73 95.972s13.111 3e-3 26.393-3.4818c1.2355 6.0567 0.0357 0.23309 1.2775 6.2288-12.372 3.2057-27.239 3.4393-27.239 3.4393z',
    fill: 'url(#linearGradient70)',
    speed: 2.3,
    delay: 2.1,
    size: 'small'
  },
  {
    id: 'rect6-7-0-3-8-91-1-8',
    d: 'm189.1 117.12s12.935-2.1419 25.468-7.7529c2.2097 5.773 0.0736 0.22402 2.2793 5.9358-11.681 5.1867-26.31 7.8494-26.31 7.8494z',
    fill: 'url(#linearGradient72)',
    speed: 2.4,
    delay: 2.2,
    size: 'small'
  },
  {
    id: 'rect6-7-0-3-8-91-1-34',
    d: 'm215.48 103.26s12.935-2.1419 25.468-7.7529c2.2097 5.7729 0.0736 0.22402 2.2793 5.9358-11.681 5.1867-26.31 7.8494-26.31 7.8494z',
    fill: 'url(#linearGradient69)',
    speed: 2.5,
    delay: 2.3,
    size: 'small'
  },
  {
    id: 'rect6-7-0-3-8-91-1-1',
    d: 'm229.48 95.874s12.935-2.1419 25.468-7.7529c2.2097 5.773 0.0736 0.22402 2.2793 5.9358-11.681 5.1867-26.31 7.8494-26.31 7.8494z',
    fill: 'url(#linearGradient68)',
    speed: 2.0,
    delay: 2.4,
    size: 'small'
  },
  {
    id: 'rect6-7-0-3-8-91-1-3',
    d: 'm240.42 86.778s8.6445-1.7273 19.167-7.431c-1.4235 9.8601-0.22841 1.436-1.0293 8.4524-8.1758 4.2926-18.494 7.2401-18.494 7.2401z',
    fill: 'url(#linearGradient66)',
    speed: 1.9,
    delay: 2.5,
    size: 'small'
  },
  {
    id: 'rect6-7-0-3-8-91-5',
    d: 'm226.98 109.41s13.048 8.8646 33.387-3.6377c0.0859 8.4637-0.013 5e-3 0.1012 8.4581-15.988 10.607-41.173-1.4972-41.173-1.4972z',
    fill: 'url(#linearGradient63)',
    speed: 2.1,
    delay: 2.6,
    size: 'small'
  },
  {
    id: 'rect6-7-0-3-8-91-1-4',
    d: 'm191.75 104.55s16.734 1.8435 34.176-0.74119c0.72717 7.9041 0.0132 0.30251 0.75664 8.1297-16.241 2.356-35.251 0.56817-35.251 0.56817z',
    fill: 'url(#linearGradient71)',
    speed: 2.3,
    delay: 2.7,
    size: 'small'
  },
  {
    id: 'rect6-7-0-3-8-91-1-9',
    d: 'm209.26 101.34s21.018-1.3405 41.952-8.2902c2.6021 9.5824 0.0815 0.36989 2.6871 9.8539-19.504 6.4088-43.313 8.309-43.313 8.309z',
    fill: 'url(#linearGradient67)',
    speed: 1.8,
    delay: 2.8,
    size: 'small'
  },
  {
    id: 'rect6-7-0-3-8-91-1-2',
    d: 'm243.56 109.39s5.5678-0.77253 11.002-3.0364c0.88214 2.4991 0.029 0.0968 0.91013 2.5697-5.0646 2.0916-11.364 3.0683-11.364 3.0683z',
    fill: 'url(#linearGradient73)',
    speed: 2.5,
    delay: 2.9,
    size: 'small'
  },
  {
    id: 'rect6-7-0-3-8-91-1-19',
    d: 'm219.19 112.48s20.238-1.0735 40.453-7.5453c2.4052 9.2473 0.0747 0.35675 2.4842 9.5094-18.833 5.9659-41.763 7.5493-41.763 7.5493z',
    fill: 'url(#linearGradient75)',
    speed: 2.2,
    delay: 3.0,
    size: 'small'
  },
  {
    id: 'rect6-7-0-3-8-91-1-45',
    d: 'm130.15 115.38s15.004 8.2684 43.41 9.8704c-1.4278 12.727-0.0777 0.48234-1.4547 13.093-26.433-1.5718-47.862-10.093-47.862-10.093z',
    fill: 'url(#linearGradient76)',
    speed: 1.9,
    delay: 3.1,
    size: 'small'
  },
  {
    id: 'rect6-7-0-3-8-91-1-40',
    d: 'm207.74 105.8s16.272-0.76731 32.552-5.8746c1.8898 7.4445 0.0582 0.28716 1.952 7.6556-15.167 4.7069-33.605 5.8716-33.605 5.8716z',
    fill: 'url(#linearGradient77)',
    speed: 2.4,
    delay: 3.2,
    size: 'small'
  },
  {
    id: 'rect6-7-0-3-8-91-1-7',
    d: 'm224.13 127.08s10.371-1.7453 20.412-6.2725c1.7846 4.6261 0.0595 0.17954 1.8408 4.7566-9.3587 4.185-21.088 6.3517-21.088 6.3517z',
    fill: 'url(#linearGradient78)',
    speed: 2.1,
    delay: 3.3,
    size: 'small'
  },
  {
    id: 'rect6-7-0-3-8-91-1-28',
    d: 'm205.38 128.05s13.074-0.97825 26.058-5.4477c1.6854 5.9472 0.0533 0.2297 1.7401 6.1156-12.097 4.1229-26.905 5.4686-26.905 5.4686z',
    fill: 'url(#linearGradient79)',
    speed: 2.0,
    delay: 3.4,
    size: 'small'
  },
  {
    id: 'rect6-7-0-3-8-91-1-72',
    d: 'm152.28 103.08s24.407 6.699 50.913 6.9916c-0.79191 11.907-0.0519 0.45223-0.80156 12.248-24.669-0.34769-52.468-7.5029-52.468-7.5029z',
    fill: 'url(#linearGradient80)',
    speed: 1.8,
    delay: 3.5,
    size: 'small'
  }
];

// Sistema de spring physics profesional
const springConfigs = {
  fast: {
    type: "spring" as const,
    damping: 25,
    stiffness: 400,
    mass: 0.5
  },
  medium: {
    type: "spring" as const,
    damping: 30,
    stiffness: 300,
    mass: 0.8
  },
  slow: {
    type: "spring" as const,
    damping: 35,
    stiffness: 200,
    mass: 1.2
  }
};

// Variantes de animación para cada elemento
const createPathVariants = (speed: number, delay: number): Variants => ({
  hidden: {
    x: "100vw",
    opacity: 0,
    scale: 0.8,
    rotateZ: 5
  },
  visible: {
    x: 0,
    opacity: 1,
    scale: 1,
    rotateZ: 0,
    transition: {
      ...springConfigs[speed >= 2 ? 'fast' : speed >= 1.5 ? 'medium' : 'slow'],
      delay: delay,
      duration: 3 / speed
    }
  },
  hover: {
    scale: 1.05,
    filter: "brightness(1.2)",
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 300
    }
  }
});

// Efectos visuales adicionales
const glowEffect = {
  filter: "drop-shadow(0 0 8px rgba(41, 108, 161, 0.3)) drop-shadow(0 0 16px rgba(146, 197, 223, 0.2))",
};

interface DafelBandBajaAnimationProps {
  autoPlay?: boolean;
  onAnimationComplete?: () => void;
  className?: string;
}

const DafelBandBajaAnimation: React.FC<DafelBandBajaAnimationProps> = ({
  autoPlay = true,
  onAnimationComplete,
  className = ""
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    if (autoPlay) {
      startAnimation();
    }
  }, [autoPlay]);

  const startAnimation = async () => {
    setIsAnimating(true);
    await controls.start("visible");
    if (onAnimationComplete) {
      onAnimationComplete();
    }
    setIsAnimating(false);
  };

  const resetAnimation = () => {
    controls.set("hidden");
    setIsAnimating(false);
  };

  return (
    <div className={`w-full h-screen bg-white relative overflow-hidden ${className}`}>
      {/* Contenedor principal con alineación al borde derecho */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 h-auto">
        <motion.svg
          width="100vw"
          height="auto"
          viewBox="0 0 264.58 158.75"
          className="min-w-[800px] h-auto"
          style={{
            ...glowEffect,
            maxHeight: "80vh"
          }}
          initial="hidden"
          animate={controls}
        >
          {/* Definiciones de gradientes */}
          <defs>
            <linearGradient id="linearGradient39" x1="249.55" x2="-10.804" y1="191.01" y2="130.91" gradientTransform="translate(11.728 -78.506)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#92c5df" offset="0"/>
              <stop stopColor="#92c5e1" stopOpacity="0.19784" offset="1"/>
            </linearGradient>
            
            <linearGradient id="linearGradient87" x1="249.55" x2="63.583" y1="191.01" y2="244.33" gradientTransform="translate(10.79 -97.233)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#296ca1" offset="0"/>
              <stop stopColor="#92c5e1" stopOpacity="0.19784" offset="1"/>
            </linearGradient>
            
            <linearGradient id="linearGradient60" x1="249.55" x2="-10.804" y1="191.01" y2="130.91" gradientTransform="matrix(.67008 -.0098204 .0098204 .67008 92.314 -16.91)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#296ca1" offset="0"/>
              <stop stopColor="#92c5e1" stopOpacity="0.19784" offset="1"/>
            </linearGradient>
            
            <linearGradient id="linearGradient41" x1="249.55" x2="-10.804" y1="191.01" y2="130.91" gradientTransform="translate(11.014 -91.739)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#296ca1" offset="0"/>
              <stop stopColor="#92c5e1" stopOpacity="0.035971" offset="1"/>
            </linearGradient>
            
            <linearGradient id="linearGradient40" x1="249.55" x2="159.16" y1="191.01" y2="186.5" gradientTransform="matrix(.83608 -.26447 -.0041922 1.2868 53.157 -115.4)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#699330" stopOpacity="0.14737" offset="0"/>
              <stop stopColor="#559c3e" stopOpacity="0.79474" offset="1"/>
            </linearGradient>
            
            <linearGradient id="linearGradient85" x1="285.47" x2="190.72" y1="143.06" y2="180.32" gradientTransform="matrix(.93758 -.20249 .30628 .61987 -12.92 22.241)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#096ec1" offset="0"/>
              <stop stopColor="#4ba2cc" stopOpacity="0.48421" offset="1"/>
            </linearGradient>
            
            <linearGradient id="linearGradient91" x1="394.38" x2="525.37" y1="99.875" y2="99.875" gradientTransform="matrix(1.0412 0 0 1.0412 -284.91 -8.3098)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4a8b83" stopOpacity="0.47451" offset="0"/>
              <stop stopColor="#18706a" stopOpacity="0.89804" offset="1"/>
            </linearGradient>
            
            <linearGradient id="linearGradient81" x1="249.55" x2="-10.804" y1="191.01" y2="130.91" gradientTransform="matrix(.83768 0 0 .83768 26.95 -52.947)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1c736b" stopOpacity="0.87843" offset="0"/>
              <stop stopColor="#91c4e0" stopOpacity="0.2902" offset="1"/>
            </linearGradient>
            
            <linearGradient id="linearGradient42" x1="249.55" x2="-10.804" y1="191.01" y2="130.91" gradientTransform="matrix(.67855 0 0 .77385 91.651 -59.049)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#689cc8" stopOpacity="0.99608" offset="0"/>
              <stop stopColor="#bee7b4" stopOpacity="0.64737" offset="1"/>
            </linearGradient>
            
            <linearGradient id="linearGradient43" x1="369.3" x2="524.63" y1="105.68" y2="105.68" gradientTransform="matrix(1.0957 0 0 .99959 -312.97 -13.81)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#5d7f07" offset="0"/>
            </linearGradient>
            
            <linearGradient id="linearGradient56" x1="249.55" x2="-10.804" y1="191.01" y2="130.91" gradientTransform="matrix(.69629 0 0 .4516 67.287 19.245)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#c7e3ec" offset="0"/>
              <stop stopColor="#aed7e8" stopOpacity="0.39568" offset="1"/>
            </linearGradient>
            
            <linearGradient id="linearGradient58" x1="249.55" x2="-10.804" y1="191.01" y2="130.91" gradientTransform="matrix(.20542 -.19234 .15634 .16697 166.39 114.15)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#c7e3ec" offset="0"/>
              <stop stopColor="#aed7e8" stopOpacity="0.39568" offset="1"/>
            </linearGradient>
            
            <linearGradient id="linearGradient55" x1="249.55" x2="-10.804" y1="191.01" y2="130.91" gradientTransform="matrix(.77821 0 0 .62554 31.568 -9.7377)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#92c5df" offset="0"/>
              <stop stopColor="#92c5e1" stopOpacity="0.19784" offset="1"/>
            </linearGradient>
            
            <linearGradient id="linearGradient84" x1="9.0506" x2="-10.804" y1="302.12" y2="130.91" gradientTransform="matrix(.35903 0 0 .35903 172.7 40.296)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#296ca1" offset="0"/>
              <stop stopColor="#92c5e1" stopOpacity="0.19784" offset="1"/>
            </linearGradient>
            
            <linearGradient id="linearGradient70" x1="9.0506" x2="-10.804" y1="302.12" y2="130.91" gradientTransform="matrix(.29765 .049363 -.049363 .29765 153.97 36.716)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#296ca1" offset="0"/>
              <stop stopColor="#92c5e1" stopOpacity="0.19784" offset="1"/>
            </linearGradient>
            
            <linearGradient id="linearGradient72" x1="9.0506" x2="-10.804" y1="302.12" y2="130.91" gradientTransform="matrix(.30172 0 0 .30172 146.1 64.182)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#296ca1" offset="0"/>
              <stop stopColor="#92c5e1" stopOpacity="0.19784" offset="1"/>
            </linearGradient>
            
            <linearGradient id="linearGradient69" x1="9.0506" x2="-10.804" y1="302.12" y2="130.91" gradientTransform="matrix(.30172 0 0 .30172 172.48 50.328)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#296ca1" offset="0"/>
              <stop stopColor="#92c5e1" stopOpacity="0.19784" offset="1"/>
            </linearGradient>
            
            <linearGradient id="linearGradient68" x1="9.0506" x2="-10.804" y1="302.12" y2="130.91" gradientTransform="matrix(.30172 0 0 .30172 186.48 42.939)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#296ca1" offset="0"/>
              <stop stopColor="#92c5e1" stopOpacity="0.19784" offset="1"/>
            </linearGradient>
            
            <linearGradient id="linearGradient66" x1="9.0506" x2="-10.804" y1="302.12" y2="130.91" gradientTransform="matrix(.30172 0 0 .30172 191.12 34.166)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#296ca1" offset="0"/>
              <stop stopColor="#92c5e1" stopOpacity="0.19784" offset="1"/>
            </linearGradient>
            
            <linearGradient id="linearGradient63" x1="249.55" x2="200.14" y1="191.01" y2="224.12" gradientTransform="matrix(.21466 0 0 .21466 206.61 69.526)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#296ca1" offset="0"/>
              <stop stopColor="#92c5e1" stopOpacity="0.19784" offset="1"/>
            </linearGradient>
            
            <linearGradient id="linearGradient64" x1="249.55" x2="-10.804" y1="191.01" y2="130.91" gradientTransform="matrix(.54283 0 0 .54283 120.38 -4.4888)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#689cc8" stopOpacity="0.99608" offset="0"/>
              <stop stopColor="#529d3f" stopOpacity="0.5098" offset="1"/>
            </linearGradient>
            
            <linearGradient id="linearGradient44" x1="249.55" x2="-10.804" y1="191.01" y2="130.91" gradientTransform="matrix(.69668 .22872 -.077913 .27979 48.624 14.073)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#689cc8" stopOpacity="0.99608" offset="0"/>
              <stop stopColor="#529d3f" stopOpacity="0.20863" offset="1"/>
            </linearGradient>
            
            <linearGradient id="linearGradient59" x1="249.55" x2="-10.804" y1="191.01" y2="130.91" gradientTransform="matrix(.54283 0 0 .54283 125.15 6.1748)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#296ca1" offset="0"/>
              <stop stopColor="#92c5e1" stopOpacity="0.19784" offset="1"/>
            </linearGradient>
            
            <linearGradient id="linearGradient71" x1="9.0506" x2="-10.804" y1="302.12" y2="130.91" gradientTransform="matrix(.373 .10477 -.10477 .373 156.97 24.18)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#296ca1" offset="0"/>
              <stop stopColor="#92c5e1" stopOpacity="0.19784" offset="1"/>
            </linearGradient>
            
            <linearGradient id="linearGradient54" x1="249.55" x2="-10.804" y1="191.01" y2="130.91" gradientTransform="matrix(.83442 0 0 .54217 52.967 8.1327)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#689cc8" stopOpacity="0.99608" offset="0"/>
              <stop stopColor="#529d3f" stopOpacity="0.5098" offset="1"/>
            </linearGradient>
            
            <linearGradient id="linearGradient67" x1="9.0506" x2="-10.804" y1="302.12" y2="130.91" gradientTransform="matrix(.48222 .048583 -.048583 .48222 149.06 9.8163)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#296ca1" offset="0"/>
              <stop stopColor="#92c5e1" stopOpacity="0.19784" offset="1"/>
            </linearGradient>
            
            <linearGradient id="linearGradient46" x1="238" x2="-10.804" y1="245.43" y2="130.91" gradientTransform="matrix(.49578 .24146 -.079536 .56359 22.151 -57.351)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#79aacd" stopOpacity="0.69424" offset="0"/>
              <stop stopColor="#52a2e7" stopOpacity="0" offset="1"/>
            </linearGradient>
            
            <linearGradient id="linearGradient51" x1="278.88" x2="392.32" y1="72.998" y2="72.998" gradientTransform="translate(-263.27 -7.5039)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ffffff" stopOpacity="0" offset="0"/>
              <stop stopColor="#ffffff" offset="1"/>
            </linearGradient>
            
            <linearGradient id="linearGradient52" x1="238" x2="-10.804" y1="245.43" y2="130.91" gradientTransform="matrix(.55041 -.033969 .2083 .52969 40.519 23.174)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#79aacd" stopOpacity="0.69424" offset="0"/>
              <stop stopColor="#52a2e7" stopOpacity="0" offset="1"/>
            </linearGradient>
            
            <linearGradient id="linearGradient53" x1="278.88" x2="392.32" y1="72.998" y2="72.998" gradientTransform="rotate(-29.5 301.65 451.77)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ffffff" stopOpacity="0" offset="0"/>
              <stop stopColor="#ffffff" offset="1"/>
            </linearGradient>
            
            <linearGradient id="linearGradient82" x1="9.0506" x2="-10.804" y1="302.12" y2="130.91" gradientTransform="matrix(.89981 .23098 -.3446 .85357 95.177 -88.065)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1dada7" offset="0"/>
              <stop stopColor="#289696" stopOpacity="0.38421" offset="1"/>
            </linearGradient>
            
            <linearGradient id="linearGradient61" x1="249.55" x2="-10.804" y1="191.01" y2="130.91" gradientTransform="translate(11.492 -94.362)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#296ca1" offset="0"/>
              <stop stopColor="#92c5e1" stopOpacity="0.19784" offset="1"/>
            </linearGradient>
            
            <linearGradient id="linearGradient73" x1="9.0506" x2="-10.804" y1="302.12" y2="130.91" gradientTransform="matrix(.12932 .0033934 -.0033934 .12932 225.73 86.221)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#296ca1" stopOpacity="0.72302" offset="0"/>
              <stop stopColor="#92c5e1" stopOpacity="0.19784" offset="1"/>
            </linearGradient>
            
            <linearGradient id="linearGradient75" x1="9.0506" x2="-10.804" y1="302.12" y2="130.91" gradientTransform="matrix(.46351 .051712 -.051712 .46351 162.2 23.794)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#296ca1" offset="0"/>
              <stop stopColor="#92c5e1" stopOpacity="0.19784" offset="1"/>
            </linearGradient>
            
            <linearGradient id="linearGradient76" x1="9.0506" x2="-10.804" y1="302.12" y2="130.91" gradientTransform="matrix(.55528 .28716 -.28716 .55528 90.554 -23.06)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#296ca1" offset="0"/>
              <stop stopColor="#92c5e1" stopOpacity="0.19784" offset="1"/>
            </linearGradient>
            
            <linearGradient id="linearGradient77" x1="9.0506" x2="-10.804" y1="302.12" y2="130.91" gradientTransform="matrix(.37234 .043749 -.043749 .37234 162.35 34.237)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#296ca1" offset="0"/>
              <stop stopColor="#92c5e1" stopOpacity="0.19784" offset="1"/>
            </linearGradient>
            
            <linearGradient id="linearGradient78" x1="156.01" x2="171.9" y1="188.52" y2="188.52" gradientTransform="matrix(1.4102 0 0 .70912 4.0555 -12.972)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#296ca1" offset="0"/>
              <stop stopColor="#92c5e1" stopOpacity="0.19784" offset="1"/>
            </linearGradient>
            
            <linearGradient id="linearGradient79" x1="9.0506" x2="-10.804" y1="302.12" y2="130.91" gradientTransform="matrix(.24202 -.0006341 .0006341 .24202 189.53 84.705)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#296ca1" offset="0"/>
              <stop stopColor="#92c5e1" stopOpacity="0.19784" offset="1"/>
            </linearGradient>
            
            <linearGradient id="linearGradient80" x1="88.07" x2="120.49" y1="191.65" y2="191.65" gradientTransform="matrix(1.6542 0 0 .60454 4.0555 -12.972)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#296ca1" offset="0"/>
              <stop stopColor="#92c5e1" stopOpacity="0.19784" offset="1"/>
            </linearGradient>
          </defs>

          {/* Elementos path animados */}
          {pathElements.map((element) => (
            <motion.path
              key={element.id}
              id={element.id}
              d={element.d}
              fill={element.fill}
              fillOpacity="0.84706"
              opacity="0.7"
              strokeWidth={element.size === 'small' ? "0.2" : element.size === 'medium' ? "0.4" : "0.54265"}
              stroke={element.size === 'small' ? "#ffffff" : undefined}
              variants={createPathVariants(element.speed, element.delay)}
              whileHover="hover"
              style={{
                filter: element.size === 'large' 
                  ? "drop-shadow(0 0 12px rgba(41, 108, 161, 0.4))"
                  : element.size === 'medium'
                  ? "drop-shadow(0 0 8px rgba(41, 108, 161, 0.3))"
                  : "drop-shadow(0 0 4px rgba(41, 108, 161, 0.2))"
              }}
            />
          ))}
        </motion.svg>
      </div>

      {/* Controles de animación (opcional) */}
      <div className="absolute bottom-8 left-8 flex gap-4 z-10">
        <button
          onClick={startAnimation}
          disabled={isAnimating}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold shadow-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isAnimating ? 'Animando...' : 'Reproducir'}
        </button>
        
        <button
          onClick={resetAnimation}
          className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg font-semibold shadow-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200"
        >
          Reiniciar
        </button>
      </div>

      {/* Efecto de partículas de fondo (opcional) */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-300 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default DafelBandBajaAnimation;