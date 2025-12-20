/**
 * ENHANCED DAFEL SECTION WITH WINDSURF ENGINE
 * Integration example showing how to upgrade existing components with WindsurfEngine
 * Maintains existing functionality while adding dynamic rainbow animations
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import Lottie from 'lottie-react';
import { useRouter } from 'next/navigation';
import {
  RainbowBackground,
  RainbowText,
  InteractiveElement,
  ScrollAnimated,
  RainbowBorder,
  ParallaxScroll,
  useRainbowColors
} from '@/components/WindsurfAnimations';
import { useWindsurfEngineContext } from '@/components/WindsurfProvider';

interface DafelSectionWindsurfProps {
  className?: string;
  enableWindsurf?: boolean;
  colorScheme?: 'rainbow' | 'sunset' | 'ocean' | 'corporate';
}

export default function DafelSectionWindsurf({ 
  className = '',
  enableWindsurf = true,
  colorScheme = 'rainbow'
}: DafelSectionWindsurfProps) {
  const { messages } = useLanguage();
  const router = useRouter();
  const { isReady, isEnabled } = useWindsurfEngineContext();
  const { updateColors } = useRainbowColors();
  
  const [selectedLayer, setSelectedLayer] = useState<number | null>(null);
  const [lottieData, setLottieData] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();

  // Apply color scheme when component mounts
  useEffect(() => {
    if (!enableWindsurf || !isReady) return;

    const colorSchemes = {
      rainbow: [
        { hue: 0, saturation: 96, lightness: 55 },
        { hue: 25, saturation: 100, lightness: 50 },
        { hue: 60, saturation: 100, lightness: 50 },
        { hue: 130, saturation: 100, lightness: 40 },
        { hue: 180, saturation: 100, lightness: 40 },
        { hue: 230, saturation: 100, lightness: 45 },
        { hue: 260, saturation: 100, lightness: 55 },
        { hue: 300, saturation: 100, lightness: 50 }
      ],
      sunset: [
        { hue: 15, saturation: 100, lightness: 55 },
        { hue: 30, saturation: 100, lightness: 50 },
        { hue: 45, saturation: 100, lightness: 50 },
        { hue: 15, saturation: 80, lightness: 40 }
      ],
      ocean: [
        { hue: 200, saturation: 100, lightness: 40 },
        { hue: 210, saturation: 95, lightness: 45 },
        { hue: 220, saturation: 90, lightness: 50 },
        { hue: 190, saturation: 85, lightness: 45 }
      ],
      corporate: [
        { hue: 220, saturation: 60, lightness: 30 },
        { hue: 200, saturation: 70, lightness: 35 },
        { hue: 240, saturation: 50, lightness: 40 },
        { hue: 210, saturation: 65, lightness: 32 }
      ]
    };

    updateColors(colorSchemes[colorScheme]);
  }, [colorScheme, enableWindsurf, isReady, updateColors]);

  useEffect(() => {
    fetch('/dafel-lottie.json')
      .then(response => response.json())
      .then(data => setLottieData(data))
      .catch(error => console.log('Lottie file not found:', error));
  }, []);

  const handleLayerClick = (layerNumber: number) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setSelectedLayer(layerNumber);

    timerRef.current = setTimeout(() => {
      setSelectedLayer(null);
    }, 12000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const layers = [
    {
      id: 1,
      title: messages.dafel.tabs.dataPlatform.title,
      content: messages.dafel.tabs.dataPlatform.content,
      image: "https://cdn.prod.website-files.com/68471fce29939e5703efec7f/68670c81fa191298451da48f_Tapa1.png",
      alt: "Data Platform",
      translateY: 0,
      zIndex: 1
    },
    {
      id: 2,
      title: messages.dafel.tabs.aiPlatform.title,
      content: messages.dafel.tabs.aiPlatform.content,
      image: "https://cdn.prod.website-files.com/68471fce29939e5703efec7f/68670c81e75b1845dbbd60ac_Tapa2.png",
      alt: "AI Platform",
      translateY: -40,
      zIndex: 2
    },
    {
      id: 3,
      title: messages.dafel.tabs.aiApplications.title,
      content: messages.dafel.tabs.aiApplications.content,
      image: "https://cdn.prod.website-files.com/68471fce29939e5703efec7f/68670c81149f2caecbc44ebe_Tapa3.png",
      alt: "AI Applications",
      translateY: -80,
      zIndex: 3
    },
  ];

  const layerVariants = {
    hidden: { 
      opacity: 0,
      y: -100,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15,
        duration: 0.6
      }
    },
    exit: {
      opacity: 0,
      y: -50,
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const lottieVariants = {
    hidden: { 
      opacity: 0,
      y: -100,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15,
        duration: 1
      }
    },
    exit: {
      opacity: 0,
      y: 50,
      scale: 0.9,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  // Decide whether to use Windsurf enhancements
  const useWindsurf = enableWindsurf && isReady && isEnabled;

  // Wrapper component that conditionally uses Windsurf features
  const SectionWrapper = ({ children }: { children: React.ReactNode }) => {
    if (useWindsurf) {
      return (
        <RainbowBackground
          intensity="low"
          speed="slow"
          direction="diagonal"
          className="relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm" />
          <div className="relative z-10">{children}</div>
        </RainbowBackground>
      );
    }
    return (
      <div style={{ background: '#ffffff' }}>
        {children}
      </div>
    );
  };

  const TitleWrapper = ({ children }: { children: React.ReactNode }) => {
    if (useWindsurf) {
      return (
        <RainbowText as="h2" gradient={colorScheme} className="text-5xl font-light text-gray-900 mb-4">
          {children}
        </RainbowText>
      );
    }
    return (
      <h2 className="text-5xl font-light text-gray-900 mb-4">
        {children}
      </h2>
    );
  };

  const ButtonWrapper = ({ children, ...props }: any) => {
    if (useWindsurf) {
      return (
        <InteractiveElement
          {...props}
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg transition-all"
        >
          {children}
        </InteractiveElement>
      );
    }
    return (
      <motion.button 
        {...props}
        className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg transition-all"
        whileHover={{ 
          scale: 1.02, 
          backgroundColor: '#1f2937',
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.button>
    );
  };

  const LayerWrapper = ({ children, layer, index }: any) => {
    if (useWindsurf) {
      return (
        <RainbowBorder 
          className={`
            border-l-2 transition-all cursor-pointer relative overflow-hidden
            ${selectedLayer === layer.id 
              ? 'border-gray-900 bg-gray-50/80 backdrop-blur-sm' 
              : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50/50'
            }
          `}
        >
          {children}
        </RainbowBorder>
      );
    }
    return (
      <motion.div
        className={`
          border-l-2 transition-all cursor-pointer relative overflow-hidden
          ${selectedLayer === layer.id 
            ? 'border-gray-900 bg-gray-50' 
            : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50/50'
          }
        `}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 * index, duration: 0.5 }}
        style={{
          marginBottom: index < layers.length - 1 ? '1rem' : 0,
          transform: selectedLayer === layer.id ? 'translateX(2px)' : 'translateX(0)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: selectedLayer === layer.id 
            ? 'inset 0 1px 3px rgba(0,0,0,0.05)' 
            : 'none'
        }}
      >
        {children}
      </motion.div>
    );
  };

  return (
    <section 
      className={`dafel-section-windsurf ${className}`}
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem'
      }}
    >
      <SectionWrapper>
        <div className="dafel-container" style={{
          maxWidth: '1200px',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4rem',
          alignItems: 'center'
        }}>
          
          <div className="dafel-left">
            {useWindsurf ? (
              <ScrollAnimated animationType="fadeIn" delay={0.2}>
                <div className="mb-12">
                  <TitleWrapper>
                    {messages.dafel.title}
                  </TitleWrapper>
                  <ParallaxScroll speed={0.1} direction="up">
                    <p className="text-xl text-gray-600 mb-8">
                      {messages.dafel.subtitle}
                    </p>
                  </ParallaxScroll>
                  <ButtonWrapper onClick={() => router.push('/login')}>
                    {messages.dafel.bookDemo}
                    <svg 
                      className="w-4 h-4" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </ButtonWrapper>
                </div>
              </ScrollAnimated>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="mb-12"
              >
                <TitleWrapper>
                  {messages.dafel.title}
                </TitleWrapper>
                <p className="text-xl text-gray-600 mb-8">
                  {messages.dafel.subtitle}
                </p>
                <ButtonWrapper onClick={() => router.push('/login')}>
                  {messages.dafel.bookDemo}
                  <svg 
                    className="w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </ButtonWrapper>
              </motion.div>
            )}

            <div className="space-y-0">
              {layers.map((layer, index) => (
                <LayerWrapper key={layer.id} layer={layer} index={index}>
                  {selectedLayer === layer.id && useWindsurf && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-gray-50/80 to-transparent backdrop-blur-sm"
                      initial={{ x: '-100%' }}
                      animate={{ x: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      style={{ zIndex: -1 }}
                    />
                  )}
                  
                  {!useWindsurf && selectedLayer === layer.id && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-gray-50 to-transparent"
                      initial={{ x: '-100%' }}
                      animate={{ x: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      style={{ zIndex: -1 }}
                    />
                  )}
                  
                  <motion.button
                    onClick={() => handleLayerClick(layer.id)}
                    className="w-full text-left p-6 relative z-10"
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <motion.h3 
                        className={`text-sm font-semibold tracking-wider transition-colors duration-300 ${
                          selectedLayer === layer.id ? 'text-gray-900' : 'text-gray-500'
                        }`}
                        animate={{ 
                          letterSpacing: selectedLayer === layer.id ? '0.05em' : '0.025em' 
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {useWindsurf ? (
                          <RainbowText gradient={colorScheme} disabled={selectedLayer !== layer.id}>
                            {layer.title}
                          </RainbowText>
                        ) : (
                          layer.title
                        )}
                      </motion.h3>
                      
                      <motion.div
                        animate={{ 
                          rotate: selectedLayer === layer.id ? 90 : 0,
                          opacity: selectedLayer === layer.id ? 0 : 1
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </motion.div>
                    </div>
                  </motion.button>
                  
                  <AnimatePresence>
                    {selectedLayer === layer.id && (
                      <motion.div
                        key={`content-${layer.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ 
                          duration: 0.35,
                          ease: "easeInOut",
                          opacity: { duration: 0.25 }
                        }}
                        className="overflow-hidden px-6 pb-6"
                      >
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {layer.content}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </LayerWrapper>
              ))}
            </div>
          </div>

          <div className="dafel-right relative" style={{ 
            height: '500px',
            perspective: '1200px',
            transformStyle: 'preserve-3d'
          }}>
            {useWindsurf ? (
              <ParallaxScroll speed={0.2} direction="up">
                <div className="layers-container relative w-full h-full flex items-center justify-center">
                  
                  <AnimatePresence mode="sync">
                    {layers.map((layer, index) => {
                      const shouldShow = selectedLayer === null || layer.id <= (selectedLayer || 4);
                      
                      if (!shouldShow) return null;
                      
                      return (
                        <ScrollAnimated
                          key={layer.id}
                          animationType="scaleIn"
                          delay={index * 0.15}
                          className="absolute"
                          style={{
                            zIndex: layer.zIndex,
                            transform: `translate3d(${index * 30}px, ${layer.translateY}px, ${index * 20}px)`,
                            willChange: 'transform, opacity'
                          }}
                        >
                          <InteractiveElement
                            onHover={setIsHovered}
                            className="relative"
                          >
                            <motion.img
                              src={layer.image}
                              alt={layer.alt}
                              className="w-full h-auto max-w-sm"
                              style={{
                                filter: selectedLayer === layer.id 
                                  ? 'drop-shadow(0 30px 60px rgba(0,0,0,0.25))' 
                                  : 'drop-shadow(0 20px 40px rgba(0,0,0,0.15))',
                                transition: 'filter 0.4s ease'
                              }}
                              animate={selectedLayer === layer.id ? {
                                scale: [1, 1.02, 1],
                              } : {}}
                              transition={selectedLayer === layer.id ? {
                                duration: 2,
                                repeat: Infinity,
                                repeatType: "reverse",
                                ease: "easeInOut"
                              } : { duration: 0.3 }}
                            />
                            
                            {/* Rainbow glow effect when hovered and Windsurf is enabled */}
                            {isHovered && (
                              <div className="absolute inset-0 windsurf-rainbow opacity-20 blur-xl -z-10" />
                            )}
                          </InteractiveElement>
                        </ScrollAnimated>
                      );
                    })}
                    
                    {/* Enhanced Lottie Animation with Windsurf */}
                    <AnimatePresence>
                      {lottieData && selectedLayer === null && (
                        <ScrollAnimated
                          animationType="rotateIn"
                          delay={0.6}
                          className="absolute"
                          style={{
                            zIndex: 4,
                            transform: 'translate3d(90px, -120px, 60px)',
                            willChange: 'transform, opacity',
                            backfaceVisibility: 'hidden'
                          }}
                        >
                          <InteractiveElement className="w-full max-w-xs">
                            <motion.div
                              animate={{
                                rotateY: [0, 5, 0, -5, 0],
                                rotateX: [0, 2, 0, -2, 0],
                                scale: [1, 1.02, 1, 0.98, 1]
                              }}
                              transition={{
                                duration: 8,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            >
                              <Lottie
                                animationData={lottieData}
                                loop={true}
                                autoplay={true}
                                className="w-full h-auto"
                              />
                              
                              {/* Rainbow border effect */}
                              <div className="absolute inset-0 windsurf-rainbow-border opacity-30 -z-10 rounded-lg" />
                            </motion.div>
                          </InteractiveElement>
                        </ScrollAnimated>
                      )}
                    </AnimatePresence>
                  </AnimatePresence>
                </div>
              </ParallaxScroll>
            ) : (
              // Original implementation without Windsurf
              <div className="layers-container relative w-full h-full flex items-center justify-center">
                
                <AnimatePresence mode="sync">
                  {layers.map((layer, index) => {
                    const shouldShow = selectedLayer === null || layer.id <= (selectedLayer || 4);
                    
                    if (!shouldShow) return null;
                    
                    return (
                      <motion.div
                        key={layer.id}
                        className="absolute"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={layerVariants}
                        custom={index}
                        style={{
                          zIndex: layer.zIndex,
                          transform: `translate3d(${index * 30}px, ${layer.translateY}px, ${index * 20}px)`,
                          willChange: 'transform, opacity'
                        }}
                        transition={{ delay: index * 0.15 }}
                      >
                        <motion.img
                          src={layer.image}
                          alt={layer.alt}
                          className="w-full h-auto max-w-sm"
                          style={{
                            filter: selectedLayer === layer.id 
                              ? 'drop-shadow(0 30px 60px rgba(0,0,0,0.25))' 
                              : 'drop-shadow(0 20px 40px rgba(0,0,0,0.15))',
                            transition: 'filter 0.4s ease'
                          }}
                          animate={selectedLayer === layer.id ? {
                            scale: [1, 1.02, 1],
                          } : {}}
                          transition={selectedLayer === layer.id ? {
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "reverse",
                            ease: "easeInOut"
                          } : { duration: 0.3 }}
                          whileHover={{ 
                            scale: 1.02,
                            filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.2))'
                          }}
                        />
                      </motion.div>
                    );
                  })}
                  
                  {/* Layer 4 - Lottie Animation */}
                  <AnimatePresence>
                    {lottieData && selectedLayer === null && (
                      <motion.div
                        className="absolute"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={lottieVariants}
                        style={{
                          zIndex: 4,
                          transform: 'translate3d(90px, -120px, 60px)',
                          willChange: 'transform, opacity',
                          backfaceVisibility: 'hidden'
                        }}
                      >
                        <motion.div
                          className="w-full max-w-xs"
                          animate={{
                            rotateY: [0, 5, 0, -5, 0],
                            rotateX: [0, 2, 0, -2, 0],
                            scale: [1, 1.02, 1, 0.98, 1]
                          }}
                          transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <Lottie
                            animationData={lottieData}
                            loop={true}
                            autoplay={true}
                            className="w-full h-auto"
                          />
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </SectionWrapper>

      <style jsx>{`
        .dafel-section-windsurf {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        @media (min-width: 768px) and (max-width: 1024px) {
          .dafel-container {
            gap: 3rem !important;
            padding: 0 2rem;
          }
          
          .dafel-left h2 {
            font-size: 2.5rem;
          }
          
          .dafel-left p {
            font-size: 1.125rem;
          }
        }
        
        @media (max-width: 767px) {
          .dafel-container {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
            padding: 0 1rem;
          }
          
          .dafel-right {
            order: -1;
            height: 350px !important;
            margin-bottom: 2rem;
          }
          
          .dafel-left h2 {
            font-size: 2rem;
            margin-bottom: 1rem;
          }
          
          .dafel-left p {
            font-size: 1rem;
            margin-bottom: 1.5rem;
          }
          
          .dafel-left button {
            padding: 0.75rem 1.5rem;
            font-size: 0.875rem;
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </section>
  );
}