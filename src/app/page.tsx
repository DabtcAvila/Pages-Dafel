'use client';

import { useState, useEffect, lazy, Suspense, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bars3Icon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Lazy load heavy components for better LCP  
const DafelSection = lazy(() => import('@/components/DafelSection'));
// Direct import para evitar ChunkLoadError
import ContactModal from '@/components/ContactModal';

// Memoize the main component for better performance
const HomePage = memo(function HomePage() {
  const { locale, messages, changeLocale } = useLanguage();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [navbarVisible, setNavbarVisible] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showText, setShowText] = useState(true);
  const router = useRouter();

  // Carrusel data with updated titles
  const carouselSlides = [
    {
      image: '/slider-images/slide1-ejecutivo-cerrando-negocio.jpg',
      title: '¿Necesitas una consultoría empresarial?\n\n¡Cotiza tu valuación bajo NIF D-3, IFRS-19 y/o USGAAP!'
    },
    {
      image: '/slider-images/slide2-ejecutivo1.jpg',
      title: '¿Tienes pasivos laborales por cubrir?\n\n¡Prima de Antigüedad, Indemnizaciones y Planes de Jubilación!'
    },
    {
      image: '/slider-images/slide3-estadisticas-negocios.jpg',
      title: '¡Optimiza los beneficios de tus empleados!\n\nPrevisión Social, Pensiones y Administración de Riesgos'
    },
    {
      image: '/slider-images/slide1-ejecutivo-cerrando-negocio.jpg',
      title: '¿Planeas el retiro de tus empleados?\n\nTrámites IMSS, Individualización de Planes y Asesoría Fiscal'
    },
    {
      image: '/slider-images/slide2-ejecutivo1.jpg',
      title: '¡Conoce DAFEL Consulting!\n¡Expertos en Actuaría y Beneficios Corporativos!'
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      
      // Altura de la navbar (72px = h-18)
      const navbarHeight = 72;
      
      if (currentScrollY > lastScrollY && currentScrollY > navbarHeight) {
        // Scrolling hacia abajo - ocultar navbar
        setNavbarVisible(false);
      } else if (currentScrollY < lastScrollY && lastScrollY - currentScrollY > 10) {
        // Scrolling hacia arriba con movimiento mínimo - mostrar navbar
        setNavbarVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Auto-advance carousel con gap de texto extendido
  useEffect(() => {
    const interval = setInterval(() => {
      // Ocultar texto 1.0 segundo antes del cambio
      setShowText(false);
      
      setTimeout(() => {
        // Cambiar slide a la mitad del gap (1.0s después)
        setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
        
        setTimeout(() => {
          // Mostrar texto 1.0 segundo después del cambio
          setShowText(true);
        }, 1000);
      }, 1000);
    }, 7000); // Change slide every 7 seconds

    return () => clearInterval(interval);
  }, [carouselSlides.length]);
  
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <>
      
      {/* Traditional Navbar */}
      <motion.nav 
        className="fixed w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/20 shadow-sm"
        initial={{ y: 0 }}
        animate={{ y: navbarVisible ? 0 : -100 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{ top: 0 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18">
            {/* Logo */}
            <div className="flex items-center">
              <img
                src="/dafel-logo-optimized.svg"
                alt="Dafel Technologies"
                className="h-16 w-auto"
              />
            </div>

            {/* Navigation Links */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-8">
                <a href="#servicios" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Servicios
                </a>
                <a href="#boletines" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Boletines
                </a>
                <a href="#nosotros" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Nosotros
                </a>
                <a href="#contacto" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Contacto
                </a>
                <button 
                  onClick={() => router.push('/login')}
                  className="bg-white text-gray-700 px-4 py-2 rounded-md text-sm font-medium border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                >
                  {messages.navbar.login}
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      
      {/* Hero Section - Optimized for LCP with banda baja integration */}
      <section className="relative h-screen w-screen z-0 overflow-hidden" style={{ left: 0, right: 0, margin: 0, padding: 0 }}>
        {/* Carousel Background Images */}
        {carouselSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute w-full h-full transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
            style={{
              top: 0,
              height: '100vh',
              backgroundImage: `url(${slide.image}?v=001)`,
              backgroundSize: 'cover',
              backgroundPosition: index === 0 ? 'center' : 'center top',
              backgroundRepeat: 'no-repeat'
            }}
          />
        ))}
        
        {/* Professional Blue Overlay - Single Layer */}
        <div className="absolute inset-0 bg-blue-500/30 backdrop-blur-[1px]" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-32 sm:pt-40 lg:pt-48 pb-16 sm:pb-24">
          <motion.div
            className="mx-auto max-w-4xl text-center relative z-10"
            initial="initial"
            animate="animate"
            variants={staggerChildren}
          >

            {/* Contenedor de altura fija para el título - evita movimiento */}
            <div className="h-24 sm:h-28 md:h-32 lg:h-36 xl:h-40 flex items-center justify-center mb-20 sm:mb-24">
              <AnimatePresence mode="wait">
                {showText && (
                  <motion.h1
                    className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light leading-tight text-center text-white"
                    style={{ 
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.8), 0 4px 8px rgba(0, 0, 0, 0.6)'
                    }}
                    key={`${currentSlide}-${showText}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                      duration: 1.5,
                      ease: "easeInOut"
                    }}
                  >
                    {carouselSlides[currentSlide].title.split('\n').map((line, index) => {
                      if (line === '') {
                        // Línea vacía - crear espacio extra
                        return <div key={index} className="h-3"></div>;
                      }
                      return (
                        <span key={index}>
                          {line}
                          {index < carouselSlides[currentSlide].title.split('\n').length - 1 && <br />}
                        </span>
                      );
                    })}
                  </motion.h1>
                )}
              </AnimatePresence>
            </div>
            
            {/* Texto descriptivo - AHORA SIN MARGIN TOP */}
            <motion.p
              className="mx-auto max-w-2xl text-base sm:text-lg font-sans leading-relaxed text-white/90 text-center"
              variants={fadeIn}
              style={{ 
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)'
              }}
            >
              Consultoría empresarial especializada en planes de beneficios corporativos, obligaciones laborales y gestión de riesgos, ofreciendo servicios integrales y brindando un respaldo total en su toma de decisiones.
            </motion.p>

            {/* Botón - SEPARACIÓN LIGERAMENTE MAYOR */}
            <motion.div
              className="mt-10 sm:mt-12 flex justify-center"
              variants={fadeIn}
            >
              <button 
                onClick={() => router.push('/login')}
                className="group relative overflow-hidden rounded-lg border border-white/30 bg-white/10 backdrop-blur-md px-8 sm:px-16 lg:px-32 py-3 sm:py-4 text-base sm:text-lg font-medium text-white transition-all duration-300 hover:bg-white/20 hover:border-white/50 hover:shadow-2xl hover:scale-105 shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.20) 100%)',
                  backdropFilter: 'blur(12px) brightness(1.2) saturate(130%)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), 0 8px 32px rgba(0,0,0,0.1), inset 0 0 20px rgba(255,255,255,0.15)'
                }}
              >
                <span className="relative z-10 transition-all duration-300 group-hover:drop-shadow-lg">
                  {messages.navbar.login}
                </span>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
              </button>
            </motion.div>
          </motion.div>

          {/* Banda Baja Animation - Solo en Hero Section */}
          <div 
            className="absolute inset-0 w-full pointer-events-none overflow-hidden"
            style={{ 
              zIndex: 1,
              height: '100vh',
              opacity: Math.max(0, 1 - scrollY / 500), // Se desvanece al hacer scroll
              transition: 'opacity 0.3s ease-out'
            }}
          >
            <iframe
              src="/bandabaja-animated.svg"
              className="border-none absolute scale-120 sm:scale-105"
              style={{ 
                background: 'transparent',
                pointerEvents: 'none',
                width: 'calc(100vw + 17px)',
                height: 'calc(100vh + 17px)',
                border: 'none',
                margin: 0,
                padding: 0,
                left: '-8px',
                top: '-8px'
              }}
              title="Banda Baja Animation"
            />
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
            <motion.div
              className="flex flex-col items-center"
              animate={{
                y: [0, 6, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="flex items-center justify-center mb-1">
                <ChevronDownIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
              </div>
              <span className="text-xs sm:text-sm text-gray-600 font-sans font-medium tracking-wide">
                <span className="hidden sm:inline">Scroll to Explore</span>
                <span className="sm:hidden">Scroll</span>
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Dafel Hero Section - Lazy loaded */}
      <Suspense fallback={<div className="h-96 bg-gray-50 flex items-center justify-center">Loading section...</div>}>
        <DafelSection />
      </Suspense>

      {/* Framework Hero Section */}
      <section className="relative min-h-[500px] sm:min-h-[600px] lg:min-h-screen bg-white">
        <div className="flex flex-col lg:flex-row h-full min-h-[500px] sm:min-h-[600px] lg:min-h-screen">
          {/* Left Column - Content */}
          <div className="w-full lg:w-[40%] bg-white flex items-center justify-center px-4 sm:px-8 py-12 sm:py-16 lg:px-16 lg:py-0">
            <div className="max-w-xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight">
                  <span className="font-light">{messages.framework.titleLine1}</span>
                  <br />
                  <span className="font-semibold">{messages.framework.titleLine2}</span>
                </h2>
                <p className="mt-6 sm:mt-8 text-lg sm:text-xl lg:text-2xl text-gray-600 leading-relaxed">
                  {messages.framework.subtitle}
                </p>
                <button 
                  onClick={() => router.push('/login')}
                  className="mt-8 sm:mt-10 bg-gray-900 text-white px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-lg font-medium text-sm sm:text-base hover:bg-gray-800 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2">
                  {messages.framework.ctaButton}
                  <span className="text-base sm:text-lg">→</span>
                </button>
              </motion.div>
            </div>
          </div>

          {/* Right Column - Visual Architecture */}
          <div className="w-full lg:w-[60%] bg-gradient-to-br from-emerald-50 to-teal-50 p-4 sm:p-6 lg:p-12 flex items-center justify-center">
            <motion.div
              className="w-full max-w-2xl"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Panel Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-600">Dafel Consulting Services</span>
                </div>
                <h3 className="text-2xl lg:text-3xl font-medium text-gray-900 flex items-center gap-2">
                  {messages.framework.panelTitle}
                  <span className="text-2xl">→</span>
                </h3>
              </div>

              {/* Layer System */}
              <div className="space-y-8">
                {/* Layer 1 - Semantic */}
                <motion.div
                  className="bg-white/80 backdrop-blur rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <div className="flex items-start gap-6">
                    <span className="text-gray-300 text-sm font-mono">01</span>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold mb-4">{messages.framework.layers.semantic.title}</h4>
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Isometric Visual */}
                        <div className="relative w-32 h-32">
                          <svg viewBox="0 0 120 120" className="w-full h-full">
                            {/* Nodes */}
                            <circle cx="30" cy="40" r="8" fill="none" stroke="#10b981" strokeWidth="2"/>
                            <circle cx="60" cy="20" r="8" fill="none" stroke="#10b981" strokeWidth="2"/>
                            <circle cx="90" cy="35" r="8" fill="none" stroke="#10b981" strokeWidth="2"/>
                            <circle cx="45" cy="70" r="8" fill="none" stroke="#10b981" strokeWidth="2"/>
                            <circle cx="75" cy="65" r="8" fill="none" stroke="#10b981" strokeWidth="2"/>
                            <circle cx="60" cy="95" r="8" fill="none" stroke="#10b981" strokeWidth="2"/>
                            {/* Connections */}
                            <line x1="30" y1="40" x2="60" y2="20" stroke="#10b981" strokeWidth="1" opacity="0.4"/>
                            <line x1="60" y1="20" x2="90" y2="35" stroke="#10b981" strokeWidth="1" opacity="0.4"/>
                            <line x1="30" y1="40" x2="45" y2="70" stroke="#10b981" strokeWidth="1" opacity="0.4"/>
                            <line x1="45" y1="70" x2="75" y2="65" stroke="#10b981" strokeWidth="1" opacity="0.4"/>
                            <line x1="75" y1="65" x2="90" y2="35" stroke="#10b981" strokeWidth="1" opacity="0.4"/>
                            <line x1="45" y1="70" x2="60" y2="95" stroke="#10b981" strokeWidth="1" opacity="0.4"/>
                            <line x1="75" y1="65" x2="60" y2="95" stroke="#10b981" strokeWidth="1" opacity="0.4"/>
                          </svg>
                        </div>
                        {/* Features */}
                        <ul className="flex-1 space-y-2 text-sm text-gray-600">
                          {messages.framework.layers.semantic.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Layer 2 - Kinetic */}
                <motion.div
                  className="bg-white/80 backdrop-blur rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div className="flex items-start gap-6">
                    <span className="text-gray-300 text-sm font-mono">02</span>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold mb-4">{messages.framework.layers.kinetic.title}</h4>
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Isometric Visual */}
                        <div className="relative w-32 h-32">
                          <svg viewBox="0 0 120 120" className="w-full h-full">
                            {/* Flow paths */}
                            <path d="M 20 30 Q 40 20, 60 30 T 100 30" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 2"/>
                            <path d="M 20 60 Q 40 50, 60 60 T 100 60" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 2"/>
                            <path d="M 20 90 Q 40 80, 60 90 T 100 90" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 2"/>
                            {/* Nodes */}
                            <rect x="15" y="25" width="10" height="10" fill="none" stroke="#3b82f6" strokeWidth="2"/>
                            <rect x="55" y="25" width="10" height="10" fill="none" stroke="#3b82f6" strokeWidth="2"/>
                            <rect x="95" y="25" width="10" height="10" fill="none" stroke="#3b82f6" strokeWidth="2"/>
                            {/* Arrows */}
                            <polygon points="48,30 52,28 52,32" fill="#3b82f6"/>
                            <polygon points="88,30 92,28 92,32" fill="#3b82f6"/>
                            <polygon points="48,60 52,58 52,62" fill="#3b82f6"/>
                            <polygon points="88,60 92,58 92,62" fill="#3b82f6"/>
                          </svg>
                        </div>
                        {/* Features */}
                        <ul className="flex-1 space-y-2 text-sm text-gray-600">
                          {messages.framework.layers.kinetic.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Layer 3 - Dynamic */}
                <motion.div
                  className="bg-white/80 backdrop-blur rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <div className="flex items-start gap-6">
                    <span className="text-gray-300 text-sm font-mono">03</span>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold mb-4">{messages.framework.layers.dynamic.title}</h4>
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Isometric Visual */}
                        <div className="relative w-32 h-32">
                          <svg viewBox="0 0 120 120" className="w-full h-full">
                            {/* Decision tree structure */}
                            <circle cx="60" cy="20" r="6" fill="none" stroke="#8b5cf6" strokeWidth="2"/>
                            <circle cx="35" cy="50" r="6" fill="none" stroke="#8b5cf6" strokeWidth="2"/>
                            <circle cx="85" cy="50" r="6" fill="none" stroke="#8b5cf6" strokeWidth="2"/>
                            <circle cx="20" cy="80" r="6" fill="none" stroke="#8b5cf6" strokeWidth="2"/>
                            <circle cx="50" cy="80" r="6" fill="none" stroke="#8b5cf6" strokeWidth="2"/>
                            <circle cx="70" cy="80" r="6" fill="none" stroke="#8b5cf6" strokeWidth="2"/>
                            <circle cx="100" cy="80" r="6" fill="none" stroke="#8b5cf6" strokeWidth="2"/>
                            {/* Connections */}
                            <line x1="60" y1="26" x2="35" y2="44" stroke="#8b5cf6" strokeWidth="1.5"/>
                            <line x1="60" y1="26" x2="85" y2="44" stroke="#8b5cf6" strokeWidth="1.5"/>
                            <line x1="35" y1="56" x2="20" y2="74" stroke="#8b5cf6" strokeWidth="1.5"/>
                            <line x1="35" y1="56" x2="50" y2="74" stroke="#8b5cf6" strokeWidth="1.5"/>
                            <line x1="85" y1="56" x2="70" y2="74" stroke="#8b5cf6" strokeWidth="1.5"/>
                            <line x1="85" y1="56" x2="100" y2="74" stroke="#8b5cf6" strokeWidth="1.5"/>
                          </svg>
                        </div>
                        {/* Features */}
                        <ul className="flex-1 space-y-2 text-sm text-gray-600">
                          {messages.framework.layers.dynamic.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <span className="w-1 h-1 bg-purple-500 rounded-full"></span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Capabilities Section */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-mono font-light tracking-wider text-gray-900 sm:text-4xl">
              {messages.services.title}
            </h2>
            <p className="mt-4 text-lg font-sans text-gray-600">
              {messages.services.subtitle}
            </p>
          </motion.div>

          <motion.div
            className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-12 sm:mt-20 lg:grid-cols-3"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            <motion.div
              className="relative"
              variants={fadeIn}
            >
              <div className="mb-4 h-px w-12 bg-gray-900" />
              <h3 className="text-lg font-mono font-medium tracking-wider text-gray-900">
                {messages.services.aiDecisions.title}
              </h3>
              <p className="mt-4 text-sm font-sans leading-relaxed text-gray-600">
                {messages.services.aiDecisions.description}
              </p>
              <button className="mt-6 text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors">
                {messages.services.learnMore}
              </button>
            </motion.div>

            <motion.div
              className="relative"
              variants={fadeIn}
            >
              <div className="mb-4 h-px w-12 bg-gray-900" />
              <h3 className="text-lg font-mono font-medium tracking-wider text-gray-900">
                {messages.services.automation.title}
              </h3>
              <p className="mt-4 text-sm font-sans leading-relaxed text-gray-600">
                {messages.services.automation.description}
              </p>
              <button className="mt-6 text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors">
                {messages.services.learnMore}
              </button>
            </motion.div>

            <motion.div
              className="relative"
              variants={fadeIn}
            >
              <div className="mb-4 h-px w-12 bg-gray-900" />
              <h3 className="text-lg font-mono font-medium tracking-wider text-gray-900">
                {messages.services.predictive.title}
              </h3>
              <p className="mt-4 text-sm font-sans leading-relaxed text-gray-600">
                {messages.services.predictive.description}
              </p>
              <button className="mt-6 text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors">
                {messages.services.learnMore}
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>


      {/* Banda Baja Final */}
      <section className="relative h-64 sm:h-80 lg:h-96 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="absolute inset-0 flex items-center justify-center">
          <iframe
            src="/bandabaja-animated.svg"
            className="border-none scale-150 sm:scale-125 lg:scale-110"
            style={{ 
              background: 'transparent',
              pointerEvents: 'none',
              width: '100vw',
              height: '100vh',
              border: 'none',
              opacity: 0.6
            }}
            title="Banda Baja Animation Final"
          />
        </div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-mono font-light text-gray-800 mb-4">
              ¿Listo para transformar tu negocio?
            </h3>
            <button 
              onClick={() => setIsContactModalOpen(true)}
              className="bg-gray-900 text-white px-8 py-3 rounded-lg font-medium text-base hover:bg-gray-800 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
              style={{
                background: 'rgba(17, 24, 39, 0.9)',
                backdropFilter: 'blur(10px)'
              }}
            >
              Contactar Ahora
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex flex-col items-center sm:items-start">
              <span className="text-lg font-sans font-semibold text-gray-900">
                Dafel Consulting Services
              </span>
              <p className="mt-2 text-sm font-sans text-gray-600">
                {messages.footer.rights}
              </p>
            </div>
            <div className="flex space-x-6">
              <button className="text-sm text-gray-600 hover:text-gray-900">
                {messages.footer.privacy}
              </button>
              <button className="text-sm text-gray-600 hover:text-gray-900">
                {messages.footer.terms}
              </button>
              <button className="text-sm text-gray-600 hover:text-gray-900">
                {messages.footer.cookies}
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Contact Modal - Direct import */}
      <ContactModal 
        open={isContactModalOpen} 
        onOpenChange={setIsContactModalOpen} 
      />
    </>
  );
});

export default HomePage;