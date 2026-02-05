'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRightIcon, CheckCircleIcon, BanknotesIcon, ChartBarIcon, DocumentTextIcon, ScaleIcon, ClockIcon, BuildingOfficeIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import ContactModal from '@/components/ContactModalOptimized';

export default function UsGaapPage() {
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

  const caracteristicasUSGAAP = [
    {
      icon: BuildingOfficeIcon,
      titulo: "Marco Estadounidense",
      descripcion: "Principios contables generalmente aceptados en Estados Unidos, administrados por el FASB bajo la Codificación ASC 715.",
      puntos: [
        "Aplicable a empresas públicas y privadas en EE.UU.",
        "Codificación ASC 715 para beneficios post-empleo",
        "Actualizaciones constantes del FASB",
        "Interpretaciones técnicas especializadas"
      ]
    },
    {
      icon: ChartBarIcon,
      titulo: "Método Corredor",
      descripcion: "Permite el uso del método corredor para el reconocimiento diferido de ganancias y pérdidas actuariales.",
      puntos: [
        "Amortización en períodos futuros",
        "Banda del 10% de mayor valor",
        "Suavizado de volatilidad en resultados",
        "Flexibilidad en aplicación"
      ]
    },
    {
      icon: BanknotesIcon,
      titulo: "Costos de Servicios Pasados",
      descripcion: "Reconocimiento y amortización sistemática de costos por modificaciones a planes existentes.",
      puntos: [
        "Amortización lineal requerida",
        "Período basado en vida laboral esperada",
        "Reconocimiento inmediato si empleados jubilados",
        "Tratamiento diferencial por tipo de beneficio"
      ]
    },
    {
      icon: DocumentTextIcon,
      titulo: "Revelaciones Detalladas",
      descripcion: "Requisitos específicos de divulgación en notas a estados financieros bajo estándares estadounidenses.",
      puntos: [
        "Conciliación de cambios en obligaciones",
        "Componentes del costo neto periódico",
        "Hipótesis actuariales utilizadas",
        "Contribuciones esperadas futuras"
      ]
    }
  ];

  const diferenciasIFRS = [
    {
      aspecto: "Ganancias/Pérdidas Actuariales",
      usgaap: "Método corredor opcional con amortización diferida",
      ifrs: "Reconocimiento inmediato en OCI (otros resultados integrales)"
    },
    {
      aspecto: "Costos de Servicios Pasados",
      usgaap: "Amortización sistemática obligatoria",
      ifrs: "Reconocimiento inmediato en resultados"
    },
    {
      aspecto: "Tasa de Descuento",
      usgaap: "Bonos corporativos de alta calidad o curva de rendimientos",
      ifrs: "Bonos corporativos de alta calidad preferentemente"
    },
    {
      aspecto: "Presentación en Estados",
      usgaap: "Separación entre costo de servicios y otros componentes",
      ifrs: "Presentación unificada del costo neto"
    },
    {
      aspecto: "Medición de Activos del Plan",
      usgaap: "Valor razonable con opciones de suavizado",
      ifrs: "Valor razonable sin suavizado"
    }
  ];

  const componentesCosto = [
    {
      componente: "Costo de Servicios",
      descripcion: "Incremento en el valor presente de obligaciones por servicios del período actual",
      ubicacion: "Gastos operativos",
      caracteristicas: [
        "Servicios prestados en el período",
        "Incrementos por años adicionales de servicio",
        "Cambios en fórmulas de beneficios",
        "Presentación separada requerida"
      ]
    },
    {
      componente: "Costo por Intereses",
      descripcion: "Incremento en obligaciones por el paso del tiempo (desenrrollamiento del descuento)",
      ubicacion: "Gastos financieros",
      caracteristicas: [
        "Tasa de descuento aplicada a obligaciones",
        "Efecto del tiempo en valor presente",
        "No incluye cambios en tasas",
        "Presentación en gastos no operativos"
      ]
    },
    {
      componente: "Rendimiento Esperado",
      descripcion: "Rendimiento esperado sobre activos del plan basado en estrategia de inversión a largo plazo",
      ubicacion: "Ingresos financieros",
      caracteristicas: [
        "Tasa de rendimiento esperado",
        "Aplicada sobre valor de mercado",
        "Reduce el costo neto del período",
        "Diferencia vs. rendimiento real"
      ]
    },
    {
      componente: "Amortizaciones",
      descripcion: "Amortización de ganancias/pérdidas actuariales y costos de servicios pasados",
      ubicacion: "Según naturaleza del concepto",
      caracteristicas: [
        "Método corredor para ganancias/pérdidas",
        "Amortización lineal de servicios pasados",
        "Vida laboral promedio remanente",
        "Posibilidad de métodos acelerados"
      ]
    }
  ];

  const procesoImplementacion = [
    {
      paso: "Análisis de Cumplimiento",
      descripcion: "Evaluación del cumplimiento actual con ASC 715 y identificación de brechas",
      actividades: [
        "Revisión de políticas contables actuales",
        "Evaluación de planes de beneficios",
        "Identificación de requerimientos ASC 715",
        "Gap analysis con prácticas actuales"
      ],
      duracion: "3-4 semanas"
    },
    {
      paso: "Valuación bajo US GAAP",
      descripcion: "Desarrollo de valuación actuarial completa bajo principios estadounidenses",
      actividades: [
        "Definición de hipótesis según mercado US",
        "Aplicación de ASC 715-30 y 715-60",
        "Cálculo de componentes del costo",
        "Determinación de método corredor si aplica"
      ],
      duracion: "6-8 semanas"
    },
    {
      paso: "Implementación Contable",
      descripcion: "Ajustes contables y preparación de revelaciones según estándares estadounidenses",
      actividades: [
        "Registro de activos/pasivos por beneficios",
        "Separación de componentes del costo",
        "Preparación de revelaciones ASC 715",
        "Ajuste de políticas contables"
      ],
      duracion: "4-5 semanas"
    },
    {
      paso: "Mantenimiento Continuo",
      descripcion: "Procesos para mantener cumplimiento y actualizaciones con cambios en ASC 715",
      actividades: [
        "Valuaciones actuariales anuales",
        "Monitoreo de cambios en FASB",
        "Actualización de revelaciones",
        "Capacitación del equipo contable"
      ],
      duracion: "Proceso continuo"
    }
  ];

  const consideracionesEspeciales = [
    {
      titulo: "Empresas Públicas vs. Privadas",
      descripcion: "US GAAP permite ciertos alivios para empresas privadas bajo ASC 715",
      detalles: [
        "Opción de usar tasa de bonos corporativos AA",
        "Simplificaciones en revelaciones",
        "Métodos alternativos de amortización",
        "Menor frecuencia de valuaciones"
      ]
    },
    {
      titulo: "Planes Múltiples",
      descripcion: "Tratamiento especial cuando la empresa patrocina varios planes de beneficios",
      detalles: [
        "Agregación permitida bajo ciertas condiciones",
        "Revelaciones por plan o agregadas",
        "Diferentes tasas de descuento posibles",
        "Consideración de riesgos específicos"
      ]
    },
    {
      titulo: "Beneficios Médicos",
      descripcion: "Aspectos específicos para planes de salud post-jubilación bajo ASC 715-60",
      detalles: [
        "Consideración de tendencias de costos médicos",
        "Efectos de reformas de salud",
        "Caps y límites en beneficios",
        "Análisis de sensibilidad específico"
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


      {/* ¿Qué es US GAAP? */}
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
                ¿Qué es <span className="font-semibold">US GAAP</span>?
              </h2>
              
              <div className="prose prose-lg text-gray-600 space-y-4">
                <p>
                  <strong>US GAAP (Generally Accepted Accounting Principles)</strong> son los principios 
                  contables generalmente aceptados en Estados Unidos, que incluyen estándares específicos 
                  para beneficios a empleados bajo la <strong>Codificación ASC 715</strong>.
                </p>
                
                <p>
                  Estos principios, administrados por el <strong>FASB</strong>, establecen criterios únicos 
                  que difieren de los estándares internacionales, ofreciendo mayor flexibilidad en el 
                  reconocimiento de ganancias y pérdidas actuariales mediante el <strong>método corredor</strong>.
                </p>

                <p>
                  US GAAP es fundamental para empresas estadounidenses y aquellas subsidiarias que requieren 
                  reportar bajo estándares locales, proporcionando <strong>comparabilidad en el mercado estadounidense</strong> 
                  y cumplimiento con regulaciones de la SEC.
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
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Ventajas Distintivas</h3>
                <div className="space-y-4">
                  {[
                    "Flexibilidad en reconocimiento actuarial",
                    "Método corredor para suavizado", 
                    "Opciones para empresas privadas",
                    "Enfoque en mercado estadounidense"
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
              Características <span className="font-semibold">Distintivas</span>
            </h2>
            <p className="max-w-3xl mx-auto text-lg text-gray-600">
              Elementos únicos que diferencian US GAAP de otros marcos normativos 
              en el tratamiento de beneficios a empleados.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {caracteristicasUSGAAP.map((caracteristica, index) => (
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

      {/* Diferencias con IFRS */}
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
              <span className="font-semibold">Comparativo</span> US GAAP vs IFRS
            </h2>
            <p className="max-w-3xl mx-auto text-lg text-gray-600">
              Principales diferencias entre US GAAP e IFRS en el tratamiento 
              contable de beneficios a empleados.
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
                    <th className="px-6 py-4 text-center font-semibold">US GAAP</th>
                    <th className="px-6 py-4 text-center font-semibold">IFRS</th>
                  </tr>
                </thead>
                <tbody>
                  {diferenciasIFRS.map((diff, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 font-medium text-gray-900">{diff.aspecto}</td>
                      <td className="px-6 py-4 text-center text-gray-600">{diff.usgaap}</td>
                      <td className="px-6 py-4 text-center text-gray-600">{diff.ifrs}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Componentes del Costo */}
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
              Componentes del <span className="font-semibold">Costo Neto</span>
            </h2>
            <p className="max-w-3xl mx-auto text-lg text-gray-600">
              Elementos que integran el costo neto periódico de beneficios bajo US GAAP 
              y su tratamiento contable específico.
            </p>
          </motion.div>

          <div className="space-y-8">
            {componentesCosto.map((componente, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-6 lg:p-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex items-start gap-4">
                  <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">{componente.componente}</h3>
                      <span className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full">
                        {componente.ubicacion}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{componente.descripcion}</p>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {componente.caracteristicas.map((caracteristica, carIndex) => (
                        <div key={carIndex} className="text-sm text-gray-600 flex items-start gap-2">
                          <CheckCircleIcon className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          {caracteristica}
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

      {/* Proceso de Implementación */}
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
              Proceso de <span className="font-semibold">Implementación</span>
            </h2>
            <p className="max-w-3xl mx-auto text-lg text-gray-600">
              Metodología para adoptar US GAAP ASC 715 de manera efectiva 
              y mantener el cumplimiento con estándares estadounidenses.
            </p>
          </motion.div>

          <div className="space-y-8">
            {procesoImplementacion.map((proceso, index) => (
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
                      <h3 className="text-xl font-semibold text-gray-900">{proceso.paso}</h3>
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

      {/* Consideraciones Especiales */}
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
              Consideraciones <span className="font-semibold">Especiales</span>
            </h2>
            <p className="max-w-3xl mx-auto text-lg text-gray-600">
              Aspectos específicos de US GAAP que requieren atención particular 
              en la implementación y mantenimiento del estándar.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {consideracionesEspeciales.map((consideracion, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-6 lg:p-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="mb-4 h-px w-12 bg-gray-900" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{consideracion.titulo}</h3>
                <p className="text-gray-600 mb-4">{consideracion.descripcion}</p>
                <ul className="space-y-2">
                  {consideracion.detalles.map((detalle, detalleIndex) => (
                    <li key={detalleIndex} className="text-sm text-gray-600 flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      {detalle}
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
                ¿Necesita Implementar <span className="font-semibold">US GAAP</span>?
              </h2>
              <p className="max-w-2xl mx-auto text-lg text-gray-700 mb-8">
                Nuestros especialistas en estándares estadounidenses le ayudarán a cumplir 
                con ASC 715 y optimizar su reporte financiero.
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
                  Solicitar Implementación
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