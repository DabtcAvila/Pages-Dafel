'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

export default function RecursosPage() {
  const [isNavButtonsVisible, setIsNavButtonsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/">
                <img
                  src="/dafel-logo-optimized.svg"
                  alt="Dafel Technologies"
                  className="h-16 w-auto"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-8">
                <Link href="/boletines" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Inicio
                </Link>
                <Link href="/noticias" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Noticias
                </Link>
                <Link href="/publicaciones" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Publicaciones
                </Link>
                <Link href="/legal" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Legal
                </Link>
                <span 
                  className="px-3 py-2 rounded-md text-sm font-medium transition-colors relative cursor-default"
                  style={{
                    color: '#004B87',
                    backgroundColor: '#f0f7fe',
                    fontWeight: '600'
                  }}
                >
                  Recursos
                  <span className="absolute bottom-0 left-0 right-0 h-0.5" style={{backgroundColor: '#004B87'}}></span>
                </span>

                {/* More Menu Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsNavButtonsVisible(!isNavButtonsVisible)}
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
                    aria-expanded={isNavButtonsVisible}
                    aria-label="More options"
                  >
                    <motion.div
                      animate={{ rotate: isNavButtonsVisible ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <Bars3Icon className="h-6 w-6" />
                    </motion.div>
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isNavButtonsVisible && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                      >
                        <Link
                          href="/#servicios"
                          onClick={() => setIsNavButtonsVisible(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                        >
                          Servicios
                        </Link>
                        <Link
                          href="/nosotros"
                          onClick={() => setIsNavButtonsVisible(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                        >
                          Nosotros
                        </Link>
                        <Link
                          href="/#contacto"
                          onClick={() => setIsNavButtonsVisible(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                        >
                          Contacto
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                aria-expanded={isMobileMenuOpen}
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
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-[72px] left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-b border-gray-200/20 shadow-lg"
          >
            <div className="px-4 pt-4 pb-6 space-y-3">
              <Link 
                href="/#servicios" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-3 text-lg font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              >
                Servicios
              </Link>
              <Link 
                href="/nosotros" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-3 text-lg font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              >
                Nosotros
              </Link>
              <Link 
                href="/#contacto" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-3 text-lg font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              >
                Contacto
              </Link>
              <Link 
                href="/recursos" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-3 text-lg font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              >
                Recursos
              </Link>
              <Link 
                href="/#contacto"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full mt-4 text-white px-4 py-3 rounded-md text-lg font-medium transition-colors hover:opacity-90 block text-center"
                style={{backgroundColor: '#004B87'}}
              >
                Consultoría
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="min-h-screen bg-gray-50 pt-24">
        {/* Hero Section */}
        <section className="bg-white py-12 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl font-light text-gray-900">
              Centro de <span className="font-semibold" style={{color: '#004B87'}}>Recursos</span>
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Material educativo y herramientas profesionales
            </p>
          </div>
        </section>

        {/* Formación Profesional Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-2xl font-light text-gray-900">
                <span className="font-semibold" style={{color: '#004B87'}}>Formación</span> Profesional
              </h2>
            </div>
            
            {/* Curso IAS 19 */}
            <div className="grid gap-6">
              <Link href="/recursos/curso-ias19" className="group">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 hover:shadow-lg transition-all duration-300 hover:border-blue-300">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">
                          IAS
                        </div>
                        <div className="ml-4">
                          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            Curso IAS 19 - Beneficios a Empleados
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Normas Internacionales & NIF D-3
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-4">
                        Domina la contabilización de beneficios a empleados con casos prácticos del contexto mexicano. 
                        Incluye aguinaldo, PTU, prima de antigüedad, planes de pensiones y más.
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                          5 Módulos
                        </span>
                        <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                          Certificado Dafel
                        </span>
                        <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">
                          Casos Prácticos
                        </span>
                        <span className="px-3 py-1 bg-orange-50 text-orange-700 text-xs font-medium rounded-full">
                          4 horas
                        </span>
                      </div>
                      
                      <div className="flex items-center font-medium" style={{color: '#004B87'}}>
                        <span>Comenzar Curso</span>
                        <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                    
                    <div className="ml-6 flex-shrink-0">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center">
                        <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
              
              {/* Placeholder para futuros cursos */}
              <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-8">
                <div className="text-center">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <p className="text-gray-600 font-medium">Más cursos próximamente</p>
                  <p className="text-gray-500 text-sm mt-1">Estamos preparando contenido adicional sobre NIF D-3, US GAAP y más</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}