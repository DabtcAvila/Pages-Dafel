'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui';
import { initRainbowEffects, initScrollAnimations, optimizeAnimations } from '@/lib/rainbowEffect';

export default function HeroSection() {
  useEffect(() => {
    // Initialize Windsurf-style animations
    const cleanupRainbow = initRainbowEffects();
    const scrollObserver = initScrollAnimations();
    optimizeAnimations();

    return () => {
      cleanupRainbow();
      scrollObserver.disconnect();
    };
  }, []);
  return (
    <section className="relative min-h-screen rainbow-background test-rainbow-visible overflow-hidden">
      {/* Windsurf-style rainbow animated background */}
      <div className="absolute inset-0 rainbow-gradient animate-gradient-shift opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/40 to-white/60" />
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 lg:px-8 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[80vh]">
          
          {/* Left column - Content - SSR SAFE VERSION */}
          <motion.div 
            initial={false}  // SSR FIX: Disable initial animation for SSR
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={false}  // SSR FIX: Disable initial animation for SSR
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium mb-8"
            >
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse" />
              Consultoría Actuarial Certificada
            </motion.div>

            {/* Main headline - Windsurf style */}
            <motion.h1 
              initial={false}  // SSR FIX: Disable initial animation for SSR
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="windsurf-heading text-5xl lg:text-7xl text-black leading-[1.1] mb-6 animate-on-scroll"
            >
              Where actuaries are doing their{' '}
              <span className="bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent animate-pulse">
                best work
              </span>
            </motion.h1>

            {/* Description - Windsurf style */}
            <motion.p 
              initial={false}  // SSR FIX: Disable initial animation for SSR
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-slate-700 leading-relaxed mb-8 max-w-2xl lg:max-w-none animate-on-scroll"
            >
              DAFEL es la experiencia de consultoría actuarial más intuitiva.
              <br />
              Transformamos 15 años de reportes históricos en ventaja estratégica.
            </motion.p>

            {/* CTA Buttons - Windsurf style */}
            <motion.div 
              initial={false}  // SSR FIX: Disable initial animation for SSR
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 mb-12 justify-center lg:justify-start animate-on-scroll"
            >
              <button className="windsurf-button group px-8 py-4 text-lg">
                Analizar Mi Histórico Gratuito
                <ArrowRightIcon className="w-5 h-5 ml-2 inline group-hover:translate-x-1 transition-transform" />
              </button>
              
              <Button 
                variant="outline"
                size="lg" 
                className="px-8 py-4 rounded-xl font-semibold border-2 border-black/20 text-black hover:border-black/40 transition-all duration-200 hover:bg-black/5"
              >
                Ver Demo Interactivo
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div 
              initial={false}  // SSR FIX: Disable initial animation for SSR
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap gap-6 justify-center lg:justify-start text-sm text-slate-500"
            >
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-green-500 rounded-full" />
                <span>89% precisión en proyecciones</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-green-500 rounded-full" />
                <span>Análisis en 48 horas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-green-500 rounded-full" />
                <span>$50M+ identificados</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right column - Visual - SSR SAFE */}
          <motion.div
            initial={false}  // SSR FIX: Disable initial animation for SSR
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative"
          >
            <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-slate-100">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                  <div className="w-3 h-3 bg-green-400 rounded-full" />
                </div>
                <div className="text-sm text-slate-500 font-medium">Análisis Histórico Dafel</div>
              </div>

              {/* Mock dashboard content */}
              <div className="space-y-6">
                <div>
                  <div className="text-sm font-semibold text-slate-700 mb-3">Tendencias Identificadas</div>
                  <div className="space-y-3">
                    {[
                      { label: "Oportunidades fiscales", value: "18.3%", trend: "up" },
                      { label: "Precisión proyectiva", value: "89.1%", trend: "up" },
                      { label: "Ahorro operativo", value: "$2.4M", trend: "up" }
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={false}  // SSR FIX: Disable initial animation for SSR
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + i * 0.1 }}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                      >
                        <span className="text-sm text-slate-600">{item.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900">{item.value}</span>
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="h-32 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-700 mb-1">15 años</div>
                    <div className="text-sm text-slate-500">de data procesada</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
              className="absolute -top-4 -right-4 w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center shadow-xl"
            >
              <div className="text-white font-bold text-xl">AI</div>
            </motion.div>

            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 8, ease: "easeInOut", repeat: Infinity }}
              className="absolute -bottom-6 -left-6 w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg"
            >
              <div className="text-white font-bold">📊</div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}