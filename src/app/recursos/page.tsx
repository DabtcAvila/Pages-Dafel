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
      <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18">
            <div className="flex items-center">
              <Link href="/">
                <img
                  src="/dafel-logo-optimized.svg"
                  alt="Dafel Technologies"
                  className="h-16 w-auto"
                />
              </Link>
            </div>

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

      <main className="min-h-screen bg-gray-50 pt-24">
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

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <h2 className="text-2xl font-light text-gray-900">
                <span className="font-semibold" style={{color: '#004B87'}}>Cursos</span> Profesionales
              </h2>
            </div>

            <div className="grid gap-8">
              <Link href="/recursos/ias-19-employee-benefits" className="group">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-blue-200">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-48 bg-gradient-to-br from-[#004B87] to-[#0066CC] flex items-center justify-center p-8 md:p-0">
                      <div className="text-center text-white">
                        <span className="text-4xl font-bold block">IAS</span>
                        <span className="text-5xl font-black block leading-none">19</span>
                      </div>
                    </div>
                    <div className="flex-1 p-6 md:p-8">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-xs font-semibold uppercase tracking-wider" style={{color: '#004B87'}}>IAS Standards</span>
                            <span className="px-2 py-0.5 bg-green-50 text-green-700 text-xs font-medium rounded-full">Actualizado Feb 2026</span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#004B87] transition-colors mt-2">
                            IAS 19 — Employee Benefits
                          </h3>
                          <p className="text-gray-600 mt-3 leading-relaxed">
                            Curso completo sobre la norma internacional de beneficios a empleados. 
                            Cubre beneficios a corto plazo, post-empleo, largo plazo y por terminaci&oacute;n, 
                            con enfoque pr&aacute;ctico al contexto mexicano (NIF D-3).
                          </p>
                          <div className="flex flex-wrap gap-2 mt-4">
                            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">Short-term Benefits</span>
                            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">Post-employment</span>
                            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">Defined Benefit Plans</span>
                            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">Termination Benefits</span>
                          </div>
                          <div className="flex items-center mt-6 font-semibold text-sm group-hover:translate-x-1 transition-transform" style={{color: '#004B87'}}>
                            <span>Acceder al curso</span>
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
