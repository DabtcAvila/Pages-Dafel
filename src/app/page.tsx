'use client';

import { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bars3Icon, ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SimpleCarouselSlide from '@/components/SimpleCarouselSlide';
import { technologiesConfig } from '@/config/technologies';

// Import critical components directly for faster LCP
import DafelSection from '@/components/DafelSection';
import ContactModal from '@/components/ContactModalOptimized';

// Memoize the main component for better performance
const HomePage = memo(function HomePage() {
  const { locale, messages, changeLocale } = useLanguage();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [navbarVisible, setNavbarVisible] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showText, setShowText] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  // Carrusel data with updated titles
  const carouselSlides = [
    {
      image: '/slider-images/slide1-ejecutivo-cerrando-negocio.jpg',
      title: '¿Necesitas una consultoría empresarial?\n\n¡Cotiza tu valuación bajo NIF D-3, IAS-19 y/o USGAAP!'
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

  // NO preloading - let images load naturally when needed to avoid warnings

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      
      // Cerrar menú móvil cuando se hace scroll
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
      
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
  }, [lastScrollY, isMobileMenuOpen]);

  // Mark as loaded after first frame for LCP optimization
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Auto-advance carousel optimizado para LCP
  useEffect(() => {
    // Don't start carousel immediately to improve LCP
    const startDelay = setTimeout(() => {
      const interval = setInterval(() => {
        // Faster transitions for better performance
        setShowText(false);
        
        setTimeout(() => {
          setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
          
          setTimeout(() => {
            setShowText(true);
          }, 300); // Much faster text appearance
        }, 300); // Faster slide change
      }, 7000);

      return () => clearInterval(interval);
    }, isInitialLoad ? 3000 : 0); // Wait 3 seconds on initial load

    return () => clearTimeout(startDelay);
  }, [carouselSlides.length, isInitialLoad]);
  
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
      <nav 
        className="fixed w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/20 shadow-sm transition-transform duration-300 ease-in-out"
        style={{ 
          top: 0,
          transform: navbarVisible ? 'translateY(0)' : 'translateY(-100%)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18">
            {/* Logo */}
            <div className="flex items-center">
              <img
                src="/dafel-logo-optimized.svg"
                alt="Dafel Technologies"
                className="h-16 w-auto"
                width="107"
                height="64"
              />
            </div>

            {/* Navigation Links */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-8">
                <a href="#servicios" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Servicios
                </a>
                <Link href="/boletines" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Boletines
                </Link>
                <Link href="/nosotros" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Nosotros
                </Link>
                <a href="#contacto" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Contacto
                </a>
                <button 
                  onClick={() => setIsContactModalOpen(true)}
                  className="bg-white text-gray-700 px-4 py-2 rounded-md text-sm font-medium border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                >
                  {messages.navbar.login}
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                aria-expanded="false"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed top-[72px] left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-b border-gray-200/20 shadow-lg transition-all duration-300"
        >
            <div className="px-4 pt-4 pb-6 space-y-3">
              <a 
                href="#servicios" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-3 text-lg font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              >
                Servicios
              </a>
              <Link 
                href="/boletines" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-3 text-lg font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              >
                Boletines
              </Link>
              <Link 
                href="/nosotros" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-3 text-lg font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              >
                Nosotros
              </Link>
              <a 
                href="#contacto" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-3 text-lg font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              >
                Contacto
              </a>
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsContactModalOpen(true);
                }}
                className="w-full mt-4 text-white px-4 py-3 rounded-md text-lg font-medium transition-colors hover:opacity-90"
                style={{backgroundColor: '#9fc8fc'}}
              >
                {messages.navbar.login}
              </button>
            </div>
        </div>
      )}

      
      {/* Hero Section - Optimized for LCP with banda baja integration */}
      <section className="relative h-screen w-screen z-0 overflow-hidden" style={{ left: 0, right: 0, margin: 0, padding: 0 }}>
        {/* Carousel Background Images - Optimized with WebP */}
        {carouselSlides.map((slide, index) => (
          <SimpleCarouselSlide
            key={index}
            image={slide.image}
            isActive={index === currentSlide}
            index={index}
            priority={index === 0} // First image has priority for LCP
          >
            <div />
          </SimpleCarouselSlide>
        ))}
        
        {/* Professional Blue Overlay - Single Layer */}
        <div className="absolute inset-0 bg-blue-500/30 backdrop-blur-[1px]" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-32 sm:pt-40 lg:pt-48 pb-16 sm:pb-24">
          <div className="mx-auto max-w-4xl text-center relative z-10">

            {/* Contenedor de altura fija para el título - evita movimiento */}
            <div className="h-24 sm:h-28 md:h-32 lg:h-36 xl:h-40 flex items-center justify-center mb-20 sm:mb-24">
              {showText && (
                <h1
                  className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light leading-tight text-center text-white transition-opacity duration-300"
                  style={{ 
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.8), 0 4px 8px rgba(0, 0, 0, 0.6)'
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
                </h1>
              )}
            </div>
            
            {/* Texto descriptivo - AHORA SIN MARGIN TOP */}
            <p
              className="mx-auto max-w-2xl text-base sm:text-lg font-sans leading-relaxed text-white/90 text-center"
              style={{ 
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)'
              }}
            >
              <strong>DAFEL</strong> es consultoría actuarial especializada en planes de beneficios corporativos, obligaciones laborales y gestión de riesgos en México. Expertos en <strong>NIF D-3, IAS-19 y US GAAP</strong>.
            </p>

            {/* Botón - SEPARACIÓN LIGERAMENTE MAYOR */}
            <div className="mt-10 sm:mt-12 flex justify-center">
              <button 
                onClick={() => setIsContactModalOpen(true)}
                className="bg-white text-gray-900 px-8 sm:px-16 lg:px-32 py-3 sm:py-4 text-base sm:text-lg font-medium rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 hover:shadow-lg shadow-sm"
              >
                Cotiza Ahora
              </button>
            </div>
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

      {/* Dafel Hero Section - Lazy loaded - Conditional based on config */}
      {technologiesConfig.showDafelSection && (
        <Suspense fallback={<div className="h-96 bg-gray-50 flex items-center justify-center">Loading section...</div>}>
          <DafelSection onContactModalOpen={() => setIsContactModalOpen(true)} />
        </Suspense>
      )}

      {/* Framework Hero Section - Conditional based on config */}
      {technologiesConfig.showFrameworkSection && (
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
                  onClick={() => setIsContactModalOpen(true)}
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
      )}

      {/* Core Capabilities Section */}
      <section id="servicios" className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-sans font-light tracking-wider text-gray-900 sm:text-4xl">
              {messages.services.title}
            </h2>
            <p className="mt-4 text-lg font-sans text-gray-600">
              {messages.services.subtitle}
            </p>
          </motion.div>

          <motion.div
            className="mx-auto mt-16 grid max-w-7xl grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 lg:grid-cols-3"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            {/* 1. Pasivos Laborales */}
            <motion.div
              className="relative"
              variants={fadeIn}
            >
              <div className="mb-4 h-px w-12 bg-gray-900" />
              <h3 className="text-lg font-sans font-medium tracking-wider text-gray-900">
                {messages.services.pasivosLaborales.title}
              </h3>
              <p className="mt-4 text-sm font-sans leading-relaxed text-gray-600">
                {messages.services.pasivosLaborales.description}
              </p>
              <Link href="/pasivos-laborales" className="mt-6 text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors inline-block">
                {messages.services.learnMore}
              </Link>
            </motion.div>

            {/* 2. Normativas Contables */}
            <motion.div
              className="relative"
              variants={fadeIn}
            >
              <div className="mb-4 h-px w-12 bg-gray-900" />
              <h3 className="text-lg font-sans font-medium tracking-wider text-gray-900">
                {messages.services.normativasContables.title}
              </h3>
              <p className="mt-4 text-sm font-sans leading-relaxed text-gray-600">
                {messages.services.normativasContables.description}
              </p>
              <Link href="/normativas-contables" className="mt-6 text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors inline-block">
                {messages.services.learnMore}
              </Link>
            </motion.div>

            {/* 3. Planes de Pensiones */}
            <motion.div
              className="relative"
              variants={fadeIn}
            >
              <div className="mb-4 h-px w-12 bg-gray-900" />
              <h3 className="text-lg font-sans font-medium tracking-wider text-gray-900">
                {messages.services.planesPensiones.title}
              </h3>
              <p className="mt-4 text-sm font-sans leading-relaxed text-gray-600">
                {messages.services.planesPensiones.description}
              </p>
              <Link href="/planes-pensiones" className="mt-6 text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors inline-block">
                {messages.services.learnMore}
              </Link>
            </motion.div>

            {/* 4. NIF D-3 */}
            <motion.div
              className="relative"
              variants={fadeIn}
            >
              <div className="mb-4 h-px w-12 bg-gray-900" />
              <h3 className="text-lg font-sans font-medium tracking-wider text-gray-900">
                {messages.services.nifD3.title}
              </h3>
              <p className="mt-4 text-sm font-sans leading-relaxed text-gray-600">
                {messages.services.nifD3.description}
              </p>
              <Link href="/nif-d3" className="mt-6 text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors inline-block">
                {messages.services.learnMore}
              </Link>
            </motion.div>

            {/* 5. IAS-19 */}
            <motion.div
              className="relative"
              variants={fadeIn}
            >
              <div className="mb-4 h-px w-12 bg-gray-900" />
              <h3 className="text-lg font-sans font-medium tracking-wider text-gray-900">
                {messages.services.ifrs19.title}
              </h3>
              <p className="mt-4 text-sm font-sans leading-relaxed text-gray-600">
                {messages.services.ifrs19.description}
              </p>
              <Link href="/ias-19" className="mt-6 text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors inline-block">
                {messages.services.learnMore}
              </Link>
            </motion.div>

            {/* 6. US GAAP */}
            <motion.div
              className="relative"
              variants={fadeIn}
            >
              <div className="mb-4 h-px w-12 bg-gray-900" />
              <h3 className="text-lg font-sans font-medium tracking-wider text-gray-900">
                {messages.services.usGaap.title}
              </h3>
              <p className="mt-4 text-sm font-sans leading-relaxed text-gray-600">
                {messages.services.usGaap.description}
              </p>
              <Link href="/us-gaap" className="mt-6 text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors inline-block">
                {messages.services.learnMore}
              </Link>
            </motion.div>

            {/* 7. Prima de Antigüedad */}
            <motion.div
              className="relative"
              variants={fadeIn}
            >
              <div className="mb-4 h-px w-12 bg-gray-900" />
              <h3 className="text-lg font-sans font-medium tracking-wider text-gray-900">
                {messages.services.primaAntiguedad.title}
              </h3>
              <p className="mt-4 text-sm font-sans leading-relaxed text-gray-600">
                {messages.services.primaAntiguedad.description}
              </p>
              <Link href="/prima-antiguedad" className="mt-6 text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors inline-block">
                {messages.services.learnMore}
              </Link>
            </motion.div>

            {/* 8. Indemnizaciones */}
            <motion.div
              className="relative"
              variants={fadeIn}
            >
              <div className="mb-4 h-px w-12 bg-gray-900" />
              <h3 className="text-lg font-sans font-medium tracking-wider text-gray-900">
                {messages.services.indemnizaciones.title}
              </h3>
              <p className="mt-4 text-sm font-sans leading-relaxed text-gray-600">
                {messages.services.indemnizaciones.description}
              </p>
              <Link href="/indemnizaciones" className="mt-6 text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors inline-block">
                {messages.services.learnMore}
              </Link>
            </motion.div>

            {/* 9. Gastos médicos al retiro */}
            <motion.div
              className="relative"
              variants={fadeIn}
            >
              <div className="mb-4 h-px w-12 bg-gray-900" />
              <h3 className="text-lg font-sans font-medium tracking-wider text-gray-900">
                {messages.services.gastosMedicosRetiro.title}
              </h3>
              <p className="mt-4 text-sm font-sans leading-relaxed text-gray-600">
                {messages.services.gastosMedicosRetiro.description}
              </p>
              <Link href="/gastos-medicos-retiro" className="mt-6 text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors inline-block">
                {messages.services.learnMore}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>


      {/* Banda Baja Final */}
      <section id="contacto" className="relative min-h-[500px] sm:h-80 lg:h-96 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
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
        <div className="relative z-10 flex items-center justify-center min-h-full py-8 sm:py-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-gray-800 text-center lg:text-left"
              >
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light mb-4 sm:mb-6">
                  ¿Listo para <span className="font-semibold">trabajar juntos</span>?
                </h2>
                <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8">
                  Contáctanos y descubre cómo podemos ayudar a tu empresa a alcanzar sus objetivos.
                </p>
                <button
                  onClick={() => setIsContactModalOpen(true)}
                  className="bg-white text-gray-900 px-6 sm:px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-all duration-200 hover:shadow-lg w-full sm:w-auto"
                >
                  Contactar Especialista
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl p-6 sm:p-8 mt-6 lg:mt-0"
              >
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Información de Contacto</h3>
                
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-start gap-3 text-gray-600">
                    <svg className="h-5 w-5 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm sm:text-base font-medium text-gray-700 mb-1">Teléfonos</p>
                      <p className="text-sm sm:text-base">+52 (55) 4444-5684</p>
                      <p className="text-sm sm:text-base">+52 (55) 4623-0055</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 text-gray-600">
                    <svg className="h-5 w-5 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 0115 0z" />
                    </svg>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm sm:text-base font-medium text-gray-700 mb-1">Dirección</p>
                      <p className="text-sm sm:text-base">Savona No.72</p>
                      <p className="text-sm sm:text-base">Col. Residencial Acoxpa</p>
                      <p className="text-sm sm:text-base">Alcaldía Tlalpan</p>
                      <p className="text-sm sm:text-base">Ciudad de México C.P. 14300</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex flex-col items-center sm:items-start">
              <span className="text-lg font-sans font-semibold text-gray-900">
                DAFEL - Consultoría Actuarial
              </span>
              <p className="mt-1 text-sm font-sans text-gray-700">
                Especialistas en NIF D-3, IAS-19 y US GAAP
              </p>
              <p className="mt-2 text-sm font-sans text-gray-600">
                {messages.footer.rights}
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="/privacidad" className="text-sm text-gray-600 hover:text-gray-900">
                {messages.footer.privacy}
              </a>
              <a href="/terminos" className="text-sm text-gray-600 hover:text-gray-900">
                {messages.footer.terms}
              </a>
              <a href="/cookies" className="text-sm text-gray-600 hover:text-gray-900">
                {messages.footer.cookies}
              </a>
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