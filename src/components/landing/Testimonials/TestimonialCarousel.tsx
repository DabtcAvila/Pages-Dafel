'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { Container, Card, Button } from '@/components/ui';
import { scrollFadeIn, staggerContainer, staggerItem } from '@/lib/animations';
import { testimonials } from '@/data/testimonials';

export default function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      if (newDirection === 1) {
        return prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1;
      } else {
        return prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1;
      }
    });
  };

  const currentTestimonial = testimonials[currentIndex];

  const resultIcons: Record<string, any> = {
    'Oportunidades identificadas': CurrencyDollarIcon,
    'Optimización de beneficios': ChartBarIcon,
    'Anticipación estratégica': ClockIcon,
    'Precisión de proyecciones': ChartBarIcon,
    'Reducción de varianza': ChartBarIcon,
    'Ahorro en auditorías': CurrencyDollarIcon,
    'Empresas consolidadas': BuildingOfficeIcon,
    'Eficiencia operativa': ChartBarIcon,
    'Ahorro administrativo': CurrencyDollarIcon,
    'Integración API': ChartBarIcon,
    'Tiempo de generación reportes': ClockIcon,
    'Disponibilidad datos': ClockIcon,
    'Reducción rotación': ChartBarIcon,
    'Empleados analizados': BuildingOfficeIcon,
    'Regiones optimizadas': BuildingOfficeIcon,
    'Precisión en licitaciones': ChartBarIcon,
    'Proyectos analizados': BuildingOfficeIcon,
    'Ventaja competitiva': ChartBarIcon,
  };

  return (
    <section className="section-padding bg-white" id="testimonials">
      <Container maxWidth="xl">
        {/* Section Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <motion.div
            variants={staggerItem}
            className="inline-flex items-center px-4 py-2 rounded-full bg-dafel-orange-50 text-dafel-orange-600 text-sm font-medium mb-6"
          >
            <StarIconSolid className="w-4 h-4 mr-2" />
            Casos de éxito reales
          </motion.div>

          <motion.h2
            variants={staggerItem}
            className="heading-section text-balance mb-6"
          >
            Empresas que{' '}
            <span className="text-dafel-orange-500">Transformaron</span>{' '}
            su Histórico en Ventaja
          </motion.h2>

          <motion.p
            variants={staggerItem}
            className="text-lead text-balance max-w-3xl mx-auto"
          >
            Descubre cómo empresas como la tuya convirtieron años de reportes archivados 
            en <strong className="text-dafel-blue-600">millones de pesos en oportunidades identificadas</strong> 
            y ventajas estratégicas medibles.
          </motion.p>
        </motion.div>

        {/* Main Testimonial Carousel */}
        <motion.div
          {...scrollFadeIn}
          className="mb-16"
        >
          <div className="relative bg-gradient-to-br from-dafel-blue-900 to-dafel-slate-900 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            
            <div className="relative p-8 lg:p-12">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Testimonial Content */}
                <div className="text-white">
                  <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                      key={currentIndex}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 }
                      }}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={1}
                      onDragEnd={(e, { offset, velocity }) => {
                        const swipe = swipePower(offset.x, velocity.x);

                        if (swipe < -swipeConfidenceThreshold) {
                          paginate(1);
                        } else if (swipe > swipeConfidenceThreshold) {
                          paginate(-1);
                        }
                      }}
                      className="cursor-grab active:cursor-grabbing"
                    >
                      {/* Quote Icon */}
                      <ChatBubbleLeftRightIcon className="w-12 h-12 text-dafel-blue-400 mb-6" />
                      
                      {/* Main Quote */}
                      <blockquote className="text-xl lg:text-2xl font-medium mb-8 italic leading-relaxed">
                        "{currentTestimonial.content}"
                      </blockquote>
                      
                      {/* Author Info */}
                      <div className="flex items-start gap-4 mb-6">
                        <div className="w-16 h-16 bg-dafel-blue-200 rounded-full flex items-center justify-center">
                          <BuildingOfficeIcon className="w-8 h-8 text-dafel-blue-700" />
                        </div>
                        <div>
                          <cite className="text-lg font-bold not-italic">
                            {currentTestimonial.name}
                          </cite>
                          <div className="text-dafel-blue-300 mb-1">
                            {currentTestimonial.position}
                          </div>
                          <div className="text-dafel-blue-200 text-sm">
                            {currentTestimonial.company} • {currentTestimonial.industry}
                          </div>
                        </div>
                      </div>
                      
                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-4">
                        {[...Array(currentTestimonial.rating)].map((_, i) => (
                          <StarIconSolid key={i} className="w-5 h-5 text-yellow-400" />
                        ))}
                        <span className="text-dafel-blue-300 text-sm ml-2">
                          Proyecto: {currentTestimonial.projectType}
                        </span>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Results Panel */}
                <div>
                  <Card className="bg-white/95 backdrop-blur-sm p-8">
                    <h4 className="text-xl font-bold text-dafel-slate-900 mb-6 text-center">
                      Resultados Medibles
                    </h4>
                    
                    <div className="space-y-4">
                      {currentTestimonial.results?.map((result, index) => {
                        const IconComponent = resultIcons[result.metric] || ChartBarIcon;
                        
                        return (
                          <motion.div
                            key={`${currentIndex}-${index}`}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex items-center gap-4 p-4 rounded-xl bg-sand-50 hover:bg-dafel-blue-50 transition-colors"
                          >
                            <div className="w-12 h-12 bg-dafel-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                              <IconComponent className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="text-2xl font-bold text-dafel-blue-600">
                                {result.value}
                              </div>
                              <div className="text-sm font-semibold text-dafel-slate-900">
                                {result.metric}
                              </div>
                              <div className="text-xs text-dafel-slate-600">
                                {result.description}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </Card>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-center mt-8 gap-4">
                <button
                  onClick={() => paginate(-1)}
                  className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                  aria-label="Testimonio anterior"
                >
                  <ChevronLeftIcon className="w-6 h-6 text-white" />
                </button>

                {/* Dots Indicator */}
                <div className="flex gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setDirection(index > currentIndex ? 1 : -1);
                        setCurrentIndex(index);
                      }}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentIndex 
                          ? 'bg-white' 
                          : 'bg-white/40 hover:bg-white/60'
                      }`}
                      aria-label={`Ir a testimonio ${index + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => paginate(1)}
                  className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                  aria-label="Siguiente testimonio"
                >
                  <ChevronRightIcon className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Summary */}
        <motion.div
          {...scrollFadeIn}
          className="mb-16"
        >
          <div className="bg-gradient-to-r from-dafel-orange-500 to-dafel-blue-500 rounded-2xl p-8 text-white">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">
                Impacto Acumulado de Nuestros Clientes
              </h3>
              <p className="text-white/90">
                Resultados reales de empresas que confiaron en nuestro análisis histórico
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">$50M+</div>
                <div className="text-sm opacity-90">Valor Total Identificado</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">500+</div>
                <div className="text-sm opacity-90">Empresas Transformadas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">89%</div>
                <div className="text-sm opacity-90">Precisión Promedio</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">15</div>
                <div className="text-sm opacity-90">Años de Experiencia</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          {...scrollFadeIn}
          className="text-center"
        >
          <h3 className="text-2xl font-bold text-dafel-slate-900 mb-4">
            ¿Listo para ser nuestro próximo caso de éxito?
          </h3>
          <p className="text-dafel-slate-600 mb-8 max-w-2xl mx-auto">
            Únete a las empresas que ya transformaron su histórico actuarial 
            en ventaja competitiva medible. Tu análisis gratuito te espera.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="xl" className="group">
              Solicitar Mi Análisis Gratuito
              <CurrencyDollarIcon className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
            </Button>
            <Button size="xl" variant="outline">
              Descargar Casos Completos
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}