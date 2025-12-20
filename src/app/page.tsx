'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bars3Icon, ChevronDownIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

export default function HomePage() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [navbarVisible, setNavbarVisible] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showText, setShowText] = useState(true);

  // Carrusel data
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
      
      const navbarHeight = 72;
      
      if (currentScrollY > lastScrollY && currentScrollY > navbarHeight) {
        setNavbarVisible(false);
      } else if (currentScrollY < lastScrollY && lastScrollY - currentScrollY > 10) {
        setNavbarVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setShowText(false);
      
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
        
        setTimeout(() => {
          setShowText(true);
        }, 1000);
      }, 1000);
    }, 7000);

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
      {/* Navigation */}
      <motion.nav 
        className="fixed w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/20 shadow-sm"
        initial={{ y: 0 }}
        animate={{ y: navbarVisible ? 0 : -100 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{ top: 0 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18">
            <div className="flex items-center">
              <Image
                src="/dafel-logo-optimized.svg"
                alt="Dafel Technologies"
                width={200}
                height={64}
                className="h-16 w-auto"
                priority
              />
            </div>

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
                  onClick={() => setIsContactModalOpen(true)}
                  className="bg-white text-gray-700 px-4 py-2 rounded-md text-sm font-medium border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                >
                  Iniciar Sesión
                </button>
              </div>
            </div>

            <div className="md:hidden">
              <button className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                <Bars3Icon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative h-screen w-screen z-0 overflow-hidden" style={{ left: 0, right: 0, margin: 0, padding: 0 }}>
        {carouselSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute w-full h-full transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
            style={{
              top: 0,
              height: '100vh',
              backgroundImage: `url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: index === 0 ? 'center' : 'center top',
              backgroundRepeat: 'no-repeat'
            }}
          />
        ))}
        
        <div className="absolute inset-0 bg-blue-500/30 backdrop-blur-[1px]" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-32 sm:pt-40 lg:pt-48 pb-16 sm:pb-24">
          <motion.div
            className="mx-auto max-w-4xl text-center relative z-10"
            initial="initial"
            animate="animate"
            variants={staggerChildren}
          >
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
            
            <motion.p
              className="mx-auto max-w-2xl text-base sm:text-lg font-sans leading-relaxed text-white/90 text-center"
              variants={fadeIn}
              style={{ 
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)'
              }}
            >
              Consultoría empresarial especializada en planes de beneficios corporativos, obligaciones laborales y gestión de riesgos, ofreciendo servicios integrales y brindando un respaldo total en su toma de decisiones.
            </motion.p>

            <motion.div
              className="mt-10 sm:mt-12 flex justify-center"
              variants={fadeIn}
            >
              <button 
                onClick={() => setIsContactModalOpen(true)}
                className="group relative overflow-hidden rounded-lg border border-white/30 bg-white/10 backdrop-blur-md px-8 sm:px-16 lg:px-32 py-3 sm:py-4 text-base sm:text-lg font-medium text-white transition-all duration-300 hover:bg-white/20 hover:border-white/50 hover:shadow-2xl hover:scale-105 shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.20) 100%)',
                  backdropFilter: 'blur(12px) brightness(1.2) saturate(130%)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), 0 8px 32px rgba(0,0,0,0.1), inset 0 0 20px rgba(255,255,255,0.15)'
                }}
              >
                <span className="relative z-10 transition-all duration-300 group-hover:drop-shadow-lg">
                  Iniciar Sesión
                </span>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
              </button>
            </motion.div>
          </motion.div>

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

      {/* Services Section */}
      <section id="servicios" className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-mono font-light tracking-wider text-gray-900 sm:text-4xl">
              Nuestros Servicios
            </h2>
            <p className="mt-4 text-lg font-sans text-gray-600">
              Soluciones integrales para su empresa
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
                Consultoría Actuarial
              </h3>
              <p className="mt-4 text-sm font-sans leading-relaxed text-gray-600">
                Valuaciones bajo NIF D-3, IFRS-19 y USGAAP para obligaciones laborales y planes de beneficios.
              </p>
            </motion.div>

            <motion.div
              className="relative"
              variants={fadeIn}
            >
              <div className="mb-4 h-px w-12 bg-gray-900" />
              <h3 className="text-lg font-mono font-medium tracking-wider text-gray-900">
                Beneficios Corporativos
              </h3>
              <p className="mt-4 text-sm font-sans leading-relaxed text-gray-600">
                Gestión integral de planes de jubilación, previsión social y administración de riesgos.
              </p>
            </motion.div>

            <motion.div
              className="relative"
              variants={fadeIn}
            >
              <div className="mb-4 h-px w-12 bg-gray-900" />
              <h3 className="text-lg font-mono font-medium tracking-wider text-gray-900">
                Asesoría Fiscal
              </h3>
              <p className="mt-4 text-sm font-sans leading-relaxed text-gray-600">
                Trámites IMSS, individualización de planes y asesoría especializada en beneficios corporativos.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="relative h-64 sm:h-80 lg:h-96 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
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
                © 2025 Todos los derechos reservados
              </p>
            </div>
            <div className="flex space-x-6">
              <button className="text-sm text-gray-600 hover:text-gray-900">
                Privacidad
              </button>
              <button className="text-sm text-gray-600 hover:text-gray-900">
                Términos
              </button>
              <button className="text-sm text-gray-600 hover:text-gray-900">
                Cookies
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Contact Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsContactModalOpen(false)}></div>
            <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">Contacto</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Para más información sobre nuestros servicios, contáctanos.
                  </p>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                  onClick={() => setIsContactModalOpen(false)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}