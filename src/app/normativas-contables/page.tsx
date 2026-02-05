'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRightIcon, CheckCircleIcon, DocumentTextIcon, GlobeAltIcon, ScaleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import ContactModal from '@/components/ContactModalOptimized';

export default function NormativasContablesPage() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [navbarVisible, setNavbarVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesMenuOpen, setIsServicesMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      
      // Cerrar menús cuando se hace scroll
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
      if (isServicesMenuOpen) {
        setIsServicesMenuOpen(false);
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
  }, [lastScrollY, isMobileMenuOpen, isServicesMenuOpen]);

  const normativas = [
    {
      name: "NIF D-3",
      fullName: "Norma de Información Financiera D-3",
      region: "México",
      href: "/nif-d3",
      description: "Normativa mexicana que establece los criterios contables para el reconocimiento, valuación, presentación y revelación de los beneficios a los empleados.",
      keyPoints: [
        "Aplicable a todas las entidades económicas en México",
        "Reconocimiento de pasivos por beneficios al término de la relación laboral",
        "Valuación actuarial de obligaciones por prima de antigüedad",
        "Revelaciones específicas en estados financieros",
        "Métodos de cálculo para beneficios post-empleo"
      ],
      scope: [
        "Prima de antigüedad",
        "Indemnizaciones por despido",
        "Planes de jubilación",
        "Beneficios por terminación",
        "PTU diferida"
      ],
      implementation: "La NIF D-3 requiere que las entidades reconozcan un pasivo cuando un empleado ha prestado servicios a cambio de beneficios futuros. Debe aplicarse el método de valuación actuarial utilizando hipótesis demográficas y financieras apropiadas."
    },
    {
      name: "IAS-19",
      fullName: "International Financial Reporting Standard 19",
      region: "Internacional",
      href: "/ias-19",
      description: "Estándar internacional que prescribe la contabilización e información a revelar respecto de los beneficios a los empleados.",
      keyPoints: [
        "Estándar global adoptado por más de 140 países",
        "Beneficios de corto y largo plazo claramente definidos",
        "Método de crédito unitario proyectado obligatorio",
        "Reconocimiento inmediato de ganancias/pérdidas actuariales",
        "Revelaciones exhaustivas requeridas"
      ],
      scope: [
        "Beneficios post-empleo (pensiones)",
        "Beneficios a largo plazo",
        "Beneficios por terminación",
        "Compensaciones basadas en acciones",
        "Beneficios médicos post-empleo"
      ],
      implementation: "IFRS 19 exige el uso del método de crédito unitario proyectado para medir la obligación y el costo de los beneficios definidos. Las ganancias y pérdidas actuariales se reconocen en otro resultado integral."
    },
    {
      name: "US GAAP",
      fullName: "Generally Accepted Accounting Principles",
      region: "Estados Unidos", 
      href: "/us-gaap",
      description: "Principios contables estadounidenses que regulan el reconocimiento y medición de beneficios a empleados bajo ASC 715.",
      keyPoints: [
        "Aplicable a empresas públicas y privadas en EE.UU.",
        "ASC 715 cubre planes de beneficios post-empleo",
        "Método de corredor para reconocimiento de ganancias/pérdidas",
        "Amortización sistemática de costos de servicios pasados",
        "Revelaciones detalladas en notas a estados financieros"
      ],
      scope: [
        "Planes de pensiones de beneficio definido",
        "Planes de contribución definida", 
        "Beneficios médicos post-jubilación",
        "Compensación diferida",
        "Beneficios por incapacidad"
      ],
      implementation: "US GAAP permite el método de corredor para el reconocimiento de ganancias y pérdidas actuariales, diferenciándose de IFRS. Requiere la medición anual de obligaciones y activos del plan."
    }
  ];

  const comparisionTable = [
    {
      aspect: "Ámbito de Aplicación",
      nif: "Entidades mexicanas",
      ifrs: "Entidades internacionales", 
      usgaap: "Entidades estadounidenses"
    },
    {
      aspect: "Método de Valuación",
      nif: "Crédito unitario proyectado",
      ifrs: "Crédito unitario proyectado",
      usgaap: "Crédito unitario proyectado"
    },
    {
      aspect: "Ganancias/Pérdidas Actuariales",
      nif: "Reconocimiento inmediato en OCI con reciclaje",
      ifrs: "Reconocimiento inmediato en OCI sin reciclaje",
      usgaap: "Método corredor opcional"
    },
    {
      aspect: "Tasa de Descuento", 
      nif: "Bonos gubernamentales AAA",
      ifrs: "Bonos corporativos alta calidad",
      usgaap: "Bonos corporativos alta calidad"
    },
    {
      aspect: "Frecuencia de Valuación",
      nif: "Anual mínimo",
      ifrs: "Anual mínimo", 
      usgaap: "Anual mínimo"
    }
  ];

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
              <Link href="/">
                <img
                  src="/dafel-logo-optimized.svg"
                  alt="Dafel Technologies"
                  className="h-16 w-auto"
                />
              </Link>
            </div>

            {/* Desktop Services Menu Button */}
            <div className="hidden md:block">
              <button
                onClick={() => setIsServicesMenuOpen(!isServicesMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                aria-expanded="false"
                aria-label="Toggle services menu"
              >
                {isServicesMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
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
      </motion.nav>

      {/* Desktop Services Menu */}
      <AnimatePresence>
        {isServicesMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-[72px] left-0 right-0 z-40 hidden md:block bg-white/95 backdrop-blur-md border-b border-gray-200/20 shadow-lg"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="py-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link 
                    href="/pasivos-laborales" 
                    onClick={() => setIsServicesMenuOpen(false)}
                    className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    Pasivos Laborales
                  </Link>
                  <Link 
                    href="/normativas-contables" 
                    onClick={() => setIsServicesMenuOpen(false)}
                    className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    Normativas Contables
                  </Link>
                  <Link 
                    href="/planes-pensiones" 
                    onClick={() => setIsServicesMenuOpen(false)}
                    className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    Planes de Pensiones
                  </Link>
                  <Link 
                    href="/nif-d3" 
                    onClick={() => setIsServicesMenuOpen(false)}
                    className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    NIF D-3
                  </Link>
                  <Link 
                    href="/ias-19" 
                    onClick={() => setIsServicesMenuOpen(false)}
                    className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    IAS-19
                  </Link>
                  <Link 
                    href="/us-gaap" 
                    onClick={() => setIsServicesMenuOpen(false)}
                    className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    US GAAP
                  </Link>
                  <Link 
                    href="/prima-antiguedad" 
                    onClick={() => setIsServicesMenuOpen(false)}
                    className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    Prima de Antigüedad
                  </Link>
                  <Link 
                    href="/indemnizaciones" 
                    onClick={() => setIsServicesMenuOpen(false)}
                    className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    Indemnizaciones
                  </Link>
                  <Link 
                    href="/gastos-medicos-retiro" 
                    onClick={() => setIsServicesMenuOpen(false)}
                    className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    Gastos Médicos al Retiro
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
              <Link 
                href="/#contacto" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-3 text-lg font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              >
                Contacto
              </Link>
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsContactModalOpen(true);
                }}
                className="w-full mt-4 text-white px-4 py-3 rounded-md text-lg font-medium transition-colors hover:opacity-90"
                style={{backgroundColor: '#9fc8fc'}}
              >
                Consultoría
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* ¿Qué son las Normativas Contables? */}
      <section className="bg-white py-16 sm:py-24 pt-24 sm:pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-6">
                ¿Qué son las <span className="font-semibold">Normativas Contables</span>?
              </h2>
              
              <div className="prose prose-lg text-gray-600 space-y-4">
                <p>
                  Las normativas contables para beneficios a empleados son <strong>marcos regulatorios</strong> que 
                  establecen los criterios para reconocer, medir, presentar y revelar las obligaciones derivadas 
                  de la relación laboral.
                </p>
                
                <p>
                  Estas normativas aseguran <strong>transparencia, comparabilidad y consistencia</strong> en el 
                  tratamiento contable de pasivos laborales, proporcionando información 
                  confiable sobre las obligaciones futuras de la empresa.
                </p>

                <p>
                  El cumplimiento de estas normativas es <strong>obligatorio</strong> para el reporte 
                  financiero, facilita la toma de decisiones estratégicas, la gestión 
                  de riesgos empresariales, y reduce el riesgo de omisiones en auditorías o revisiones fiscales.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Objetivos Principales</h3>
                <div className="space-y-4">
                  {[
                    "Estandarizar el reconocimiento contable",
                    "Facilitar la comparabilidad entre entidades", 
                    "Proporcionar información transparente a inversores",
                    "Reducir riesgos de interpretación normativa"
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircleIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Principales Normativas */}
      <section className="bg-gray-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-4">
              Principales <span className="font-semibold">Normativas</span>
            </h2>
            <p className="max-w-3xl mx-auto text-lg text-gray-600">
              Análisis detallado de los tres marcos normativos más importantes para la valuación 
              y reconocimiento contable de beneficios a empleados.
            </p>
          </motion.div>

          <div className="space-y-8">
            {normativas.map((normativa, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link href={normativa.href}>
                  <div 
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
                    onMouseEnter={(e) => {
                      const nameElement = e.currentTarget.querySelector('h3');
                      const lineElement = e.currentTarget.querySelector('.hover-line');
                      const ctaElement = e.currentTarget.querySelector('.cta-text');
                      if (nameElement) nameElement.style.color = '#9fc8fc';
                      if (lineElement) lineElement.style.backgroundColor = '#9fc8fc';
                      if (ctaElement) ctaElement.style.color = '#9fc8fc';
                    }}
                    onMouseLeave={(e) => {
                      const nameElement = e.currentTarget.querySelector('h3');
                      const lineElement = e.currentTarget.querySelector('.hover-line');
                      const ctaElement = e.currentTarget.querySelector('.cta-text');
                      if (nameElement) nameElement.style.color = '';
                      if (lineElement) lineElement.style.backgroundColor = '';
                      if (ctaElement) ctaElement.style.color = '';
                    }}
                  >
                    <div className="p-6 lg:p-8">
                      <div className="mb-4 h-px w-12 bg-gray-900 transition-colors duration-300 hover-line" />
                      <div className="flex flex-wrap items-center gap-4 mb-4">
                        <h3 className="text-2xl font-semibold text-gray-900 transition-colors duration-300">{normativa.name}</h3>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                          {normativa.region}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-4">{normativa.fullName}</p>
                      <p className="text-gray-600 mb-6">{normativa.description}</p>
                      
                      <div className="grid md:grid-cols-3 gap-6">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <CheckCircleIcon className="h-5 w-5 text-green-600" />
                            Características Clave
                          </h4>
                          <ul className="space-y-2">
                            {normativa.keyPoints.map((point, pointIndex) => (
                              <li key={pointIndex} className="text-sm text-gray-600 flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                                {point}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                            Alcance de Aplicación
                          </h4>
                          <ul className="space-y-2">
                            {normativa.scope.map((item, itemIndex) => (
                              <li key={itemIndex} className="text-sm text-gray-600 flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <ScaleIcon className="h-5 w-5 text-purple-600" />
                            Implementación
                          </h4>
                          <p className="text-sm text-gray-600 leading-relaxed mb-4">
                            {normativa.implementation}
                          </p>
                        </div>
                      </div>
                      
                      {/* Call to Action */}
                      <div className="mt-6 pt-4 border-t border-gray-100">
                        <span className="text-sm font-medium text-gray-600 transition-colors duration-300 cta-text flex items-center gap-1">
                          Conocer más
                          <ChevronRightIcon className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabla Comparativa */}
      <section className="bg-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-4">
              <span className="font-semibold">Comparativo</span> Normativo
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
              Principales diferencias y similitudes entre los marcos normativos más utilizados.
            </p>
          </motion.div>

          <motion.div
            className="bg-gray-50 rounded-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Aspecto</th>
                    <th className="px-6 py-4 text-center font-semibold">NIF D-3</th>
                    <th className="px-6 py-4 text-center font-semibold">IAS-19</th>
                    <th className="px-6 py-4 text-center font-semibold">US GAAP</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisionTable.map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 font-medium text-gray-900">{row.aspect}</td>
                      <td className="px-6 py-4 text-center text-gray-600">{row.nif}</td>
                      <td className="px-6 py-4 text-center text-gray-600">{row.ifrs}</td>
                      <td className="px-6 py-4 text-center text-gray-600">{row.usgaap}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action con Banda Baja */}
      <section className="relative min-h-[400px] sm:h-80 lg:h-96 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
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
            title="Banda Baja Animation"
          />
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-full py-8 sm:py-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-800 mb-4 sm:mb-6">
                ¿Necesitas <span className="font-semibold">Asesoría Normativa</span>?
              </h2>
              <p className="max-w-2xl mx-auto text-lg text-gray-700 mb-8">
                Nuestros expertos te ayudan a determinar qué normativa aplicar y cómo implementarla 
                correctamente según tu estructura corporativa.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setIsContactModalOpen(true)}
                  className="bg-white text-gray-900 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-all duration-200 hover:shadow-lg"
                >
                  Consulta Especializada
                </button>
                <button
                  onClick={() => setIsContactModalOpen(true)}
                  className="bg-white bg-opacity-90 text-gray-900 border border-gray-300 px-8 py-3 rounded-lg font-medium hover:bg-opacity-100 hover:border-gray-400 transition-all duration-200"
                >
                  Solicitar Asesoría
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Modal */}
      <ContactModal 
        open={isContactModalOpen} 
        onOpenChange={setIsContactModalOpen} 
      />
    </>
  );
}