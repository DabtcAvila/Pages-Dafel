'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRightIcon, CheckCircleIcon, ClockIcon, CurrencyDollarIcon, ScaleIcon, DocumentTextIcon, UserGroupIcon, CalculatorIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import ContactModal from '@/components/ContactModalOptimized';

export default function PrimaAntiguedadPage() {
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

  const caracteristicasPrima = [
    {
      icon: ScaleIcon,
      titulo: "Marco Legal",
      descripcion: "Derecho establecido en la Ley Federal del Trabajo de México, con características específicas definidas por la normatividad laboral.",
      puntos: [
        "Artículos 162 y 486 de la LFT",
        "12 días de salario por año trabajado",
        "Aplicable después de 15 años de servicio",
        "Derecho irrenunciable del trabajador"
      ]
    },
    {
      icon: CalculatorIcon,
      titulo: "Cálculo Actuarial",
      descripcion: "Metodología técnica para determinar el valor presente de las obligaciones futuras por prima de antigüedad.",
      puntos: [
        "Método de crédito unitario proyectado",
        "Consideración de probabilidades de permanencia (muerte, invalidez, rotación, jubilación, despido)",
        "Proyección de salarios futuros",
        "Descuento a valor presente"
      ]
    },
    {
      icon: UserGroupIcon,
      titulo: "Población Objetivo",
      descripcion: "Trabajadores que cumplan con los requisitos de elegibilidad establecidos en la legislación laboral.",
      puntos: [
        "Trabajadores con contrato indefinido"
      ]
    },
    {
      icon: CurrencyDollarIcon,
      titulo: "Impacto Financiero",
      descripcion: "Reconocimiento contable y fiscal de las obligaciones por prima de antigüedad en los estados financieros.",
      puntos: [
        "Pasivo en balance general",
        "Costo anual de servicios con cargo a resultados",
        "Deducibilidad fiscal condicionada",
        "Revelaciones en notas explicativas"
      ]
    }
  ];

  const procesoValuacion = [
    {
      etapa: "Análisis Demográfico",
      descripcion: "Recopilación y análisis de información de trabajadores para la valuación",
      actividades: [
        "Censo de empleados por edad y antigüedad",
        "Incremento salarial",
        "Análisis de rotación histórica",
        "Consistencias de información respecto a años anteriores"
      ],
      duracion: "2-3 días"
    },
    {
      etapa: "Definición de Hipótesis",
      descripcion: "Establecimiento de supuestos actuariales basados en la experiencia de la empresa y el mercado",
      actividades: [
        "Tasas de rotación por edad y antigüedad",
        "Incrementos salariales esperados (carrera salarial y salario mínimo)",
        "Tasa de descuento apropiada",
        "Probabilidades de sobrevivencia y permanencia"
      ],
      duracion: "2-3 días"
    },
    {
      etapa: "Cálculo Actuarial",
      descripcion: "Aplicación de metodología técnica para determinar obligaciones y costos anuales",
      actividades: [
        "Proyección de carreras salariales considerando el tope existente",
        "Cálculo de beneficios futuros",
        "Descuento a valor presente",
        "Determinación de costo de servicios"
      ],
      duracion: "1-3 días"
    },
    {
      etapa: "Reporte y Seguimiento",
      descripcion: "Elaboración de informes técnicos y establecimiento de procesos de seguimiento",
      actividades: [
        "Informe actuarial detallado",
        "Plan de actualizaciones futuras",
        "Capacitación al equipo interno"
      ],
      duracion: "1-2 días"
    }
  ];

  const factoresClaved = [
    {
      factor: "Antigüedad de la Plantilla",
      impacto: "Alto",
      descripcion: "Mayor antigüedad promedio incrementa significativamente las obligaciones",
      consideraciones: [
        "Distribución por rangos de antigüedad",
        "Proyección de jubilaciones próximas", 
        "Impacto de reestructuras organizacionales",
        "Planes de retiro anticipado"
      ]
    },
    {
      factor: "Rotación de Personal",
      impacto: "Alto",
      descripcion: "Tasas de rotación históricas afectan la probabilidad de alcanzar 15 años",
      consideraciones: [
        "Análisis por grupos demográficos",
        "Diferenciación por nivel jerárquico",
        "Estacionalidad en rotación",
        "Impacto de beneficios adicionales"
      ]
    },
    {
      factor: "Crecimiento Salarial",
      impacto: "Medio-Alto",
      descripcion: "Política salarial de la empresa determina el monto futuro del beneficio",
      consideraciones: [
        "Política de aumentos anuales",
        "Promociones y cambios de puesto",
        "Inflación y ajustes del mercado",
        "Topes salariales para la prima"
      ]
    },
    {
      factor: "Tasa de Descuento",
      impacto: "Alto",
      descripcion: "Tasa utilizada para descontar obligaciones futuras a valor presente",
      consideraciones: [
        "Bonos gubernamentales de largo plazo",
        "Curva de rendimientos apropiada",
        "Duración promedio de obligaciones",
        "Consistencia con otras valuaciones"
      ]
    }
  ];

  const estrategiasGestion = [
    {
      categoria: "Gestión de Costos",
      estrategias: [
        "Política de topes salariales para cálculo",
        "Programas de retiro voluntario",
        "Revisión de elegibilidad por categorías",
        "Fondeo anticipado de obligaciones"
      ]
    },
    {
      categoria: "Optimización Fiscal",
      estrategias: [
        "Constitución de reservas deducibles",
        "Timing de pagos para optimización fiscal",
        "Estructura de fondos de pensiones",
        "Aprovechamiento de beneficios fiscales"
      ]
    },
    {
      categoria: "Gestión Actuarial",
      estrategias: [
        "Valuaciones más frecuentes para mayor precisión",
        "Análisis de sensibilidad periódico",
        "Monitoreo de cambios demográficos",
        "Actualización de hipótesis técnicas"
      ]
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


      {/* ¿Qué es la Prima de Antigüedad? */}
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
                ¿Qué es la <span className="font-semibold">Prima de Antigüedad</span>?
              </h2>
              
              <div className="prose prose-lg text-gray-600 space-y-4">
                <p>
                  La <strong>Prima de Antigüedad</strong> es una prestación laboral establecida en la 
                  Ley Federal del Trabajo de México, consistente en el pago de <strong>12 días de salario 
                  por cada año de servicio</strong> al terminar la relación laboral por las causas de 
                  fallecimiento, invalidez o despido sin requisitos de antigüedad mínima. Para salidas 
                  por separación voluntaria, se paga cuando el trabajador tiene al menos 15 años de servicios.
                </p>
                
                <p>
                  Esta obligación requiere <strong>valuación actuarial</strong> para determinar el pasivo 
                  que debe reconocerse contablemente, considerando factores como rotación de personal, 
                  crecimiento salarial y probabilidades demográficas específicas de cada empresa.
                </p>

                <p>
                  El cálculo actuarial de la prima de antigüedad es fundamental para el <strong>cumplimiento 
                  contable</strong> bajo NIF D-3, IAS-19 o US GAAP, y representa uno de los pasivos 
                  laborales más significativos, ya que es aplicable a toda empresa con trabajadores en México.
                </p>
                
                <p className="text-sm italic text-gray-500">
                  *Sueldo topado a 2 salarios mínimos vigentes.
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
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Características Legales</h3>
                <div className="space-y-4">
                  {[
                    "12 días de salario por año trabajado",
                    "Mínimo 15 años de antigüedad en caso de separación voluntaria", 
                    "Derecho irrenunciable del trabajador",
                    "Obligación patronal establecida en LFT"
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

      {/* Características Principales */}
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
              Aspectos <span className="font-semibold">Técnicos</span>
            </h2>
            <p className="max-w-3xl mx-auto text-lg text-gray-600">
              Elementos técnicos y legales que definen la valuación actuarial 
              de la prima de antigüedad en México.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {caracteristicasPrima.map((caracteristica, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-6 lg:p-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex items-start gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <caracteristica.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{caracteristica.titulo}</h3>
                    <p className="text-gray-600 mb-4">{caracteristica.descripcion}</p>
                    <ul className="space-y-2">
                      {caracteristica.puntos.map((punto, puntoIndex) => (
                        <li key={puntoIndex} className="text-sm text-gray-600 flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                          {punto}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Proceso de Valuación */}
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
              Proceso de <span className="font-semibold">Valuación</span>
            </h2>
            <p className="max-w-3xl mx-auto text-lg text-gray-600">
              Metodología estructurada para realizar la valuación actuarial 
              de prima de antigüedad según estándares técnicos.
            </p>
          </motion.div>

          <div className="space-y-8">
            {procesoValuacion.map((proceso, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 rounded-xl p-6 lg:p-8"
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex items-start gap-4">
                  <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">{proceso.etapa}</h3>
                      <span className="text-sm text-blue-600 font-medium flex items-center gap-1">
                        <ClockIcon className="h-4 w-4" />
                        {proceso.duracion}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{proceso.descripcion}</p>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {proceso.actividades.map((actividad, actIndex) => (
                        <div key={actIndex} className="text-sm text-gray-600 flex items-start gap-2">
                          <CheckCircleIcon className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          {actividad}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Factores Clave */}
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
              <span className="font-semibold">Factores</span> Determinantes
            </h2>
            <p className="max-w-3xl mx-auto text-lg text-gray-600">
              Variables que tienen mayor impacto en la valuación actuarial 
              de prima de antigüedad y su gestión estratégica.
            </p>
          </motion.div>

          <div className="space-y-6">
            {factoresClaved.map((factor, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-6 lg:p-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  <div className="lg:w-1/3">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{factor.factor}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        factor.impacto === 'Alto' ? 'bg-red-100 text-red-800' : 
                        factor.impacto === 'Medio-Alto' ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        Impacto {factor.impacto}
                      </span>
                    </div>
                    <p className="text-gray-600">{factor.descripcion}</p>
                  </div>
                  
                  <div className="lg:w-2/3">
                    <h4 className="text-lg font-medium text-gray-900 mb-3">Consideraciones Clave</h4>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {factor.consideraciones.map((consideracion, consIndex) => (
                        <div key={consIndex} className="text-sm text-gray-600 flex items-start gap-2">
                          <DocumentTextIcon className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          {consideracion}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Estrategias de Gestión */}
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
              Estrategias de <span className="font-semibold">Gestión</span>
            </h2>
            <p className="max-w-3xl mx-auto text-lg text-gray-600">
              Alternativas para optimizar el impacto financiero y fiscal 
              de las obligaciones por prima de antigüedad.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {estrategiasGestion.map((categoria, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 rounded-xl p-6 lg:p-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="mb-4 h-px w-12 bg-gray-900" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{categoria.categoria}</h3>
                <ul className="space-y-3">
                  {categoria.estrategias.map((estrategia, estrategiaIndex) => (
                    <li key={estrategiaIndex} className="text-sm text-gray-600 flex items-start gap-2">
                      <CheckCircleIcon className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      {estrategia}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
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
                ¿Necesita Valuar <span className="font-semibold">Prima de Antigüedad</span>?
              </h2>
              <p className="max-w-2xl mx-auto text-lg text-gray-700 mb-8">
                Nuestros actuarios especializados en legislación mexicana le ayudarán 
                a calcular y gestionar sus obligaciones por prima de antigüedad.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setIsContactModalOpen(true)}
                  className="bg-white text-gray-900 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-all duration-200 hover:shadow-lg"
                >
                  Consulta Actuarial
                </button>
                <button
                  onClick={() => setIsContactModalOpen(true)}
                  className="bg-white bg-opacity-90 text-gray-900 border border-gray-300 px-8 py-3 rounded-lg font-medium hover:bg-opacity-100 hover:border-gray-400 transition-all duration-200"
                >
                  Solicitar Valuación
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