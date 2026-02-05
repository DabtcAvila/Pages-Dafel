'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRightIcon, CheckCircleIcon, ClockIcon, CurrencyDollarIcon, ScaleIcon, DocumentTextIcon, UserGroupIcon, ExclamationTriangleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import ContactModal from '@/components/ContactModalOptimized';

export default function IndemnizacionesPage() {
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

  const tiposIndemnizaciones = [
    {
      tipo: "Despido Injustificado",
      baseLegal: "Artículo 50 LFT",
      calculo: "3 meses + 20 días por año + salarios vencidos",
      caracteristicas: [
        "Aplicable cuando no existe causa justificada",
        "Incluye prima de antigüedad si procede",
        "Salarios caídos hasta resolución judicial",
        "Intereses moratorios según jurisprudencia"
      ]
    },
    {
      tipo: "Terminación Voluntaria por Causa Imputable al Patrón",
      baseegal: "Artículo 50 LFT",
      calculo: "3 meses + 20 días por año + prima de antigüedad",
      caracteristicas: [
        "Reducción de salario sin justificación",
        "Cambio de lugar de trabajo perjudicial",
        "Incumplimiento de obligaciones patronales",
        "Violencia, amenazas o malos tratos"
      ]
    },
    {
      tipo: "Muerte o Incapacidad del Trabajador",
      baseegal: "Artículo 162 LFT",
      calculo: "2 meses + prima de antigüedad",
      caracteristicas: [
        "Fallecimiento por causas no laborales",
        "Incapacidad total permanente",
        "Pago a beneficiarios designados",
        "Prima de antigüedad proporcional"
      ]
    },
    {
      tipo: "Reestructuración o Cierre",
      baseegal: "Artículo 436-439 LFT",
      calculo: "3 meses + 20 días por año + prima de antigüedad",
      caracteristicas: [
        "Cambios tecnológicos que reduzcan personal",
        "Cierre total o parcial de empresa",
        "Conciliación ante autoridad laboral",
        "Posible diferimiento de pagos"
      ]
    }
  ];

  const factoresActuariales = [
    {
      factor: "Probabilidades de Terminación",
      descripcion: "Estimación de la likelihood de diferentes tipos de terminación laboral",
      componentes: [
        "Tasas de despido históricas por categoría",
        "Análisis de litigios laborales previos",
        "Rotación voluntaria e involuntaria",
        "Impacto de ciclos económicos"
      ]
    },
    {
      factor: "Montos de Indemnización",
      descripcion: "Cálculo del valor presente de pagos esperados por indemnizaciones",
      componentes: [
        "Salarios proyectados al momento del despido",
        "Antigüedad esperada al momento de terminación",
        "Prima de antigüedad asociada",
        "Costos legales y procesales"
      ]
    },
    {
      factor: "Timing de Pagos",
      descripcion: "Momentos esperados en que se materializarán las obligaciones",
      componentes: [
        "Distribución temporal de despidos",
        "Duración promedio de procesos legales",
        "Patrones estacionales de terminaciones",
        "Impacto de reestructuraciones planeadas"
      ]
    }
  ];

  const metodologiaValuacion = [
    {
      etapa: "Análisis de Experiencia",
      descripcion: "Estudio de la experiencia histórica de terminaciones laborales en la empresa",
      actividades: [
        "Recopilación de datos de terminaciones (5-10 años)",
        "Clasificación por tipo de terminación",
        "Análisis de montos pagados históricamente",
        "Identificación de tendencias y patrones"
      ],
      duracion: "3-4 semanas"
    },
    {
      etapa: "Modelado Actuarial",
      descripcion: "Desarrollo de modelo probabilístico para proyectar futuras indemnizaciones",
      actividades: [
        "Definición de hipótesis de terminación",
        "Modelado de montos esperados",
        "Incorporación de factores de riesgo",
        "Validación con experiencia histórica"
      ],
      duracion: "4-5 semanas"
    },
    {
      etapa: "Cálculo de Reservas",
      descripcion: "Determinación del pasivo actuarial por concepto de indemnizaciones",
      actividades: [
        "Proyección de flujos de efectivo",
        "Descuento a valor presente",
        "Análisis de sensibilidad",
        "Cálculo de componentes del costo"
      ],
      duracion: "2-3 semanas"
    },
    {
      etapa: "Monitoreo y Actualización",
      descripcion: "Establecimiento de procesos de seguimiento y actualización periódica",
      actividades: [
        "Sistema de alertas tempranas",
        "Actualización trimestral/anual",
        "Análisis de experiencia vs. esperado",
        "Ajuste de hipótesis según tendencias"
      ],
      duracion: "Proceso continuo"
    }
  ];

  const riesgosAsociados = [
    {
      categoria: "Riesgos Legales",
      riesgos: [
        "Cambios en legislación laboral",
        "Nuevas interpretaciones jurisprudenciales",
        "Modificaciones en criterios de autoridades",
        "Reformas al sistema de justicia laboral"
      ],
      mitigacion: "Monitoreo constante de cambios normativos y actualización de políticas"
    },
    {
      categoria: "Riesgos Operacionales",
      riesgos: [
        "Reestructuraciones no planificadas",
        "Crisis económicas o sectoriales",
        "Cambios en estrategia empresarial",
        "Problemas de liquidez temporal"
      ],
      mitigacion: "Scenario planning y constitución de reservas contingentes"
    },
    {
      categoria: "Riesgos Actuariales",
      riesgos: [
        "Experiencia adversa vs. hipótesis",
        "Concentración en ciertos grupos demográficos",
        "Correlación entre terminaciones",
        "Inadecuación de datos históricos"
      ],
      mitigacion: "Validación continua de hipótesis y análisis de sensibilidad robusto"
    }
  ];

  const estrategiasGestion = [
    {
      estrategia: "Gestión de Políticas de RH",
      descripcion: "Implementación de mejores prácticas para reducir riesgo de terminaciones conflictivas",
      acciones: [
        "Programas de capacitación en legislación laboral",
        "Políticas claras de disciplina progresiva",
        "Documentación adecuada de procesos",
        "Sistemas de evaluación de desempeño objetivos"
      ]
    },
    {
      estrategia: "Provisión Financiera",
      descripcion: "Establecimiento de reservas y fondos para cubrir obligaciones potenciales",
      acciones: [
        "Constitución de reservas según valuación actuarial",
        "Fondos específicos para contingencias laborales",
        "Optimización fiscal de provisiones",
        "Seguros de responsabilidad civil patronal"
      ]
    },
    {
      estrategia: "Gestión Proactiva de Casos",
      descripcion: "Manejo temprano y efectivo de conflictos laborales para minimizar exposiciones",
      acciones: [
        "Sistemas de alerta temprana de conflictos",
        "Mediación y conciliación preventiva",
        "Asesoría legal especializada continua",
        "Negociación estratégica de finiquitos"
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


      {/* ¿Qué son las Indemnizaciones? */}
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
                ¿Qué son las <span className="font-semibold">Indemnizaciones</span>?
              </h2>
              
              <div className="prose prose-lg text-gray-600 space-y-4">
                <p>
                  Las <strong>indemnizaciones laborales</strong> son compensaciones económicas que el empleador 
                  debe pagar al trabajador por la terminación de la relación laboral en circunstancias específicas 
                  establecidas por la <strong>Ley Federal del Trabajo</strong>.
                </p>
                
                <p>
                  Estas obligaciones requieren <strong>valuación actuarial especializada</strong> para estimar 
                  su valor presente, considerando probabilidades de terminación, montos esperados y timing de 
                  pagos, permitiendo el reconocimiento contable adecuado de estos pasivos contingentes.
                </p>

                <p>
                  La valuación de indemnizaciones es esencial para el <strong>cumplimiento contable</strong> 
                  bajo normativas mexicanas e internacionales, y para la gestión de riesgos laborales en 
                  organizaciones de cualquier tamaño.
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
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Características Clave</h3>
                <div className="space-y-4">
                  {[
                    "Obligaciones contingentes por terminación",
                    "Cálculo basado en salarios y antigüedad", 
                    "Diferentes tipos según causa de terminación",
                    "Requiere provisión contable actuarial"
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

      {/* Tipos de Indemnizaciones */}
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
              Tipos de <span className="font-semibold">Indemnizaciones</span>
            </h2>
            <p className="max-w-3xl mx-auto text-lg text-gray-600">
              Clasificación de indemnizaciones según la causa de terminación 
              y su tratamiento legal específico.
            </p>
          </motion.div>

          <div className="space-y-8">
            {tiposIndemnizaciones.map((indemnizacion, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-6 lg:p-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="mb-4 h-px w-12 bg-gray-900" />
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{indemnizacion.tipo}</h3>
                  <div className="flex flex-col gap-2">
                    <span className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full">
                      {indemnizacion.baseegal}
                    </span>
                    <span className="text-sm text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full">
                      {indemnizacion.calculo}
                    </span>
                  </div>
                </div>
                
                <div className="grid lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-3">Supuestos de Aplicación</h4>
                    <ul className="space-y-2">
                      {indemnizacion.caracteristicas.map((caracteristica, carIndex) => (
                        <li key={carIndex} className="text-sm text-gray-600 flex items-start gap-2">
                          <ScaleIcon className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          {caracteristica}
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

      {/* Factores Actuariales */}
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
              Factores <span className="font-semibold">Actuariales</span>
            </h2>
            <p className="max-w-3xl mx-auto text-lg text-gray-600">
              Variables clave consideradas en la valuación actuarial de 
              obligaciones por indemnizaciones laborales.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {factoresActuariales.map((factor, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 rounded-xl p-6 lg:p-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="mb-4 h-px w-12 bg-gray-900" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{factor.factor}</h3>
                <p className="text-gray-600 mb-4">{factor.descripcion}</p>
                <ul className="space-y-2">
                  {factor.componentes.map((componente, compIndex) => (
                    <li key={compIndex} className="text-sm text-gray-600 flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      {componente}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Metodología de Valuación */}
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
              Metodología de <span className="font-semibold">Valuación</span>
            </h2>
            <p className="max-w-3xl mx-auto text-lg text-gray-600">
              Proceso técnico para determinar el valor presente de obligaciones 
              contingentes por indemnizaciones laborales.
            </p>
          </motion.div>

          <div className="space-y-8">
            {metodologiaValuacion.map((etapa, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-6 lg:p-8"
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
                      <h3 className="text-xl font-semibold text-gray-900">{etapa.etapa}</h3>
                      <span className="text-sm text-blue-600 font-medium flex items-center gap-1">
                        <ClockIcon className="h-4 w-4" />
                        {etapa.duracion}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{etapa.descripcion}</p>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {etapa.actividades.map((actividad, actIndex) => (
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

      {/* Riesgos Asociados */}
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
              <span className="font-semibold">Riesgos</span> Asociados
            </h2>
            <p className="max-w-3xl mx-auto text-lg text-gray-600">
              Identificación y gestión de riesgos inherentes a las obligaciones 
              por indemnizaciones laborales.
            </p>
          </motion.div>

          <div className="space-y-8">
            {riesgosAsociados.map((categoria, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 rounded-xl p-6 lg:p-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex items-start gap-4">
                  <ExclamationTriangleIcon className="h-6 w-6 text-orange-600 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{categoria.categoria}</h3>
                    <div className="grid lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 mb-3">Riesgos Identificados</h4>
                        <ul className="space-y-2">
                          {categoria.riesgos.map((riesgo, riesgoIndex) => (
                            <li key={riesgoIndex} className="text-sm text-gray-600 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                              {riesgo}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 mb-3">Estrategia de Mitigación</h4>
                        <p className="text-sm text-gray-600">{categoria.mitigacion}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Estrategias de Gestión */}
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
              Estrategias de <span className="font-semibold">Gestión</span>
            </h2>
            <p className="max-w-3xl mx-auto text-lg text-gray-600">
              Enfoques integrales para gestionar y minimizar el impacto de 
              obligaciones por indemnizaciones laborales.
            </p>
          </motion.div>

          <div className="space-y-8">
            {estrategiasGestion.map((estrategia, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-6 lg:p-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="mb-4 h-px w-12 bg-gray-900" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{estrategia.estrategia}</h3>
                <p className="text-gray-600 mb-4">{estrategia.descripcion}</p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {estrategia.acciones.map((accion, accionIndex) => (
                    <div key={accionIndex} className="text-sm text-gray-600 flex items-start gap-2">
                      <CheckCircleIcon className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      {accion}
                    </div>
                  ))}
                </div>
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
                ¿Necesita Valuar <span className="font-semibold">Indemnizaciones</span>?
              </h2>
              <p className="max-w-2xl mx-auto text-lg text-gray-700 mb-8">
                Nuestros especialistas en riesgo laboral le ayudarán a estimar y gestionar 
                sus obligaciones contingentes por indemnizaciones.
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