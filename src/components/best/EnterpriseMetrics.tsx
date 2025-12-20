'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

export default function EnterpriseMetrics() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { threshold: 0.3 });
  const [counts, setCounts] = useState({ clients: 0, projects: 0, satisfaction: 0, revenue: 0 });

  const metrics = [
    { 
      key: 'clients', 
      target: 150, 
      suffix: '+', 
      label: 'Enterprise Clients',
      icon: '🏢',
      description: 'Fortune 500 companies trust us'
    },
    { 
      key: 'projects', 
      target: 500, 
      suffix: '+', 
      label: 'AI Projects Delivered',
      icon: '🚀',
      description: 'Successful implementations'
    },
    { 
      key: 'satisfaction', 
      target: 99, 
      suffix: '%', 
      label: 'Client Satisfaction',
      icon: '⭐',
      description: 'Consistent excellence rating'
    },
    { 
      key: 'revenue', 
      target: 250, 
      suffix: 'M+', 
      label: 'Revenue Generated',
      icon: '💰',
      description: 'For our clients annually'
    }
  ];

  useEffect(() => {
    if (!isInView) return;

    const animateCounters = () => {
      metrics.forEach((metric) => {
        let current = 0;
        const increment = metric.target / 60; // 60 frames for smooth animation
        
        const timer = setInterval(() => {
          current += increment;
          if (current >= metric.target) {
            current = metric.target;
            clearInterval(timer);
          }
          
          setCounts(prev => ({
            ...prev,
            [metric.key]: Math.floor(current)
          }));
        }, 33); // ~30fps for smooth counting
      });
    };

    const delay = setTimeout(animateCounters, 500);
    
    return () => {
      clearTimeout(delay);
    };
  }, [isInView]);

  return (
    <section ref={ref} className="py-20 px-8 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Premium background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-200 to-transparent"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1.5, delay: 0.7 }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={isInView ? { clipPath: "inset(0 0% 0 0)" } : { clipPath: "inset(0 100% 0 0)" }}
            transition={{ duration: 1.2, delay: 0.3 }}
          >
            Resultados que Hablan por Sí Solos
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Más de una década transformando empresas con soluciones de IA de clase mundial
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.key}
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.8 }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.15,
                type: "spring",
                stiffness: 100
              }}
              className="text-center group cursor-pointer"
              whileHover={{ y: -10, scale: 1.05 }}
            >
              <motion.div
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group-hover:border-blue-200 relative overflow-hidden"
                whileHover={{ 
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
                }}
              >
                {/* Hover effect overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={false}
                />
                
                <div className="relative z-10">
                  <motion.div 
                    className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300"
                    animate={isInView ? { 
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.1, 1]
                    } : {}}
                    transition={{ 
                      duration: 2, 
                      delay: index * 0.2 + 1,
                      repeat: Infinity,
                      repeatDelay: 5
                    }}
                  >
                    {metric.icon}
                  </motion.div>
                  
                  <motion.div 
                    className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300"
                    style={{ fontVariantNumeric: 'tabular-nums' }}
                  >
                    {counts[metric.key as keyof typeof counts]}{metric.suffix}
                  </motion.div>
                  
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors duration-300">
                    {metric.label}
                  </h3>
                  
                  <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                    {metric.description}
                  </p>
                </div>

                {/* Premium border animation */}
                <motion.div
                  className="absolute inset-0 rounded-2xl border-2 border-blue-400 opacity-0 group-hover:opacity-100"
                  initial={false}
                  animate={isInView ? {
                    borderColor: ["rgba(59, 130, 246, 0)", "rgba(59, 130, 246, 0.3)", "rgba(59, 130, 246, 0)"]
                  } : {}}
                  transition={{ 
                    duration: 2, 
                    delay: index * 0.3 + 2,
                    repeat: Infinity,
                    repeatDelay: 4
                  }}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-gray-500 mb-6">Trusted by industry leaders worldwide</p>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            {['ISO 27001', 'SOC 2', 'GDPR', 'AWS Partner', 'Microsoft Gold'].map((cert, index) => (
              <motion.div
                key={cert}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                className="px-4 py-2 bg-gray-100 rounded-full text-xs font-medium text-gray-700 hover:bg-gray-200 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
              >
                {cert}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}