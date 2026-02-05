'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRightIcon, CheckCircleIcon, GlobeAltIcon, ChartBarIcon, CurrencyDollarIcon, DocumentTextIcon, ClockIcon, UserGroupIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import ContactModal from '@/components/ContactModalOptimized';

export default function Ifrs19Page() {
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

  const caracteristicasIFRS = [
    {
      icon: GlobeAltIcon,
      titulo: "Estándar Internacional",
      descripcion: "Norma emitida por el International Accounting Standards Board (IASB) adoptada por más de 140 países a nivel mundial.",
      puntos: [
        "Aplicación global y consistente",
        "Convergencia entre mercados internacionales",
        "Actualizaciones periódicas del IASB",
        "Interpretaciones oficiales (IFRIC)"
      ]
    },
    {
      icon: ChartBarIcon,
      titulo: "Método Obligatorio",
      descripcion: "Establece el método de crédito unitario proyectado como único método aceptable para valuación actuarial.",
      puntos: [
        "Proyección de beneficios hasta jubilación",
        "Atribución de beneficios por período de servicio",
        "Descuento a valor presente",
        "Consideración de probabilidades actuariales"
      ]
    },
    {
      icon: CurrencyDollarIcon,
      titulo: "Reconocimiento en OCI",
      descripcion: "Las ganancias y pérdidas actuariales se reconocen inmediatamente en otro resultado integral (OCI).",
      puntos: [
        "No se reciclan al resultado del período",
        "Transparencia en volatilidad actuarial",
        "Separación entre operaciones y cambios técnicos",
        "Impacto directo en patrimonio"
      ]
    },
    {
      icon: DocumentTextIcon,
      titulo: "Revelaciones Exhaustivas",
      descripcion: "Requiere divulgaciones detalladas sobre los planes de beneficios y sus riesgos asociados.",
      puntos: [
        "Análisis de sensibilidad obligatorio",
        "Conciliación de saldos período a período",
        "Información sobre riesgos del plan",
        "Proyecciones de contribuciones futuras"
      ]
    }
  ];

  const tiposBeneficios = [
    {
      categoria: "Beneficios Post-Empleo",
      tipos: [
        "Planes de pensiones de beneficio definido",
        "Beneficios médicos post-jubilación",
        "Seguros de vida después del retiro",
        "Otros beneficios diferidos"
      ],
      tratamiento: "Valuación actuarial completa con reconocimiento de ganancias/pérdidas en OCI"
    },
    {
      categoria: "Beneficios a Largo Plazo",
      tipos: [
        "Ausencias compensadas a largo plazo",
        "Bonos por permanencia",
        "Beneficios por incapacidad",
        "Compensaciones diferidas"
      ],
      tratamiento: "Valuación actuarial con reconocimiento directo en resultados"
    },
    {
      categoria: "Beneficios por Terminación",
      tipos: [
        "Indemnizaciones por despido",
        "Programas de retiro anticipado",
        "Reestructuraciones organizacionales",
        "Liquidaciones por cambio de control"
      ],
      tratamiento: "Reconocimiento cuando existe compromiso demostrable o anuncio público"
    }
  ];

  const procesoImplementacion = [
    {
      etapa: "Diagnóstico Inicial",
      descripcion: "Evaluación completa de los planes de beneficios existentes y su clasificación bajo IFRS 19",
      actividades: [
        "Inventario de todos los beneficios a empleados",
        "Clasificación según categorías IFRS 19",
        "Evaluación de políticas contables actuales",
        "Identificación de brechas normativas"
      ],
      duracion: "4-6 semanas"
    },
    {
      etapa: "Valuación Actuarial",
      descripcion: "Implementación del método de crédito unitario proyectado según requerimientos IFRS",
      actividades: [
        "Definición de hipótesis según mercados locales",
        "Cálculo de obligaciones por beneficios definidos",
        "Determinación de costos de servicios",
        "Análisis de sensibilidad requerido"
      ],
      duracion: "6-8 semanas"
    },
    {
      etapa: "Ajustes Contables",
      descripcion: "Registro de los impactos financieros y ajuste de políticas contables",
      actividades: [
        "Registro de pasivos/activos por beneficios",
        "Reconocimiento en OCI de ganancias/pérdidas",
        "Ajuste de políticas contables",
        "Preparación de revelaciones"
      ],
      duracion: "3-4 semanas"
    },
    {
      etapa: "Cumplimiento Continuo",
      descripcion: "Establecimiento de procesos para mantener cumplimiento con actualizaciones normativas",
      actividades: [
        "Valuaciones actuariales periódicas",
        "Monitoreo de cambios en IFRS 19",
        "Actualización de revelaciones",
        "Capacitación del equipo contable"
      ],
      duracion: "Proceso continuo"
    }
  ];

  const consideracionesEspeciales = [
    {
      titulo: "Tasa de Descuento",
      descripcion: "Debe basarse en bonos corporativos de alta calidad o bonos gubernamentales si el mercado corporativo no es profundo",
      ejemplos: [
        "Bonos corporativos AA o superior",
        "Duración similar a las obligaciones",
        "Moneda consistente con los beneficios",
        "Mercado activo y líquido"
      ]
    },
    {
      titulo: "Rendimiento de Activos",
      descripcion: "Para planes con activos segregados, se debe considerar el rendimiento real y esperado",
      ejemplos: [
        "Rendimiento real vs. tasa de descuento",
        "Límite en el reconocimiento de excesos",
        "Disponibilidad de activos para la entidad",
        "Costos de administración del plan"
      ]
    },
    {
      titulo: "Análisis de Sensibilidad", 
      descripcion: "Revelación obligatoria del impacto de cambios en hipótesis principales",
      ejemplos: [
        "Cambio de +/- 0.5% en tasa de descuento",
        "Incremento salarial +/- 0.5%",
        "Esperanza de vida +/- 1 año",
        "Impacto cuantitativo en obligaciones"
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


      {/* ¿Qué es IAS-19? */}
      <section className="bg-white py-16 sm:py-24 pt-24 sm:pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl sm:text-4xl font-light text-gray-900 mb-6">
                <span className="font-semibold">IAS-19</span>: Estándar Internacional de Beneficios a Empleados
              </h1>
              
              <div className="prose prose-lg text-gray-600 space-y-4">
                <p>
                  <strong>DAFEL</strong> es experto en <strong>IAS-19</strong> (IAS 19) en México. 
                  IAS-19 "Employee Benefits" es el estándar internacional de información financiera 
                  que prescribe la contabilización e información a revelar respecto de los beneficios 
                  a los empleados, aplicable en más de 140 países alrededor del mundo.
                </p>
                
                <p>
                  Este estándar, emitido por el <strong>IASB</strong>, establece criterios específicos para 
                  el reconocimiento, medición y revelación de obligaciones por beneficios definidos, 
                  utilizando técnicas actuariales avanzadas y promoviendo la <strong>transparencia global</strong>.
                </p>

                <p>
                  IAS-19 es fundamental para empresas multinacionales y aquellas que reportan bajo 
                  estándares internacionales, proporcionando <strong>comparabilidad global</strong> en 
                  el tratamiento de beneficios a empleados.
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
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Ventajas Clave</h3>
                <div className="space-y-4">
                  {[
                    "Reconocimiento global y consistente",
                    "Transparencia en volatilidad actuarial", 
                    "Comparabilidad entre entidades",
                    "Revelaciones detalladas de riesgos"
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
              Elementos únicos que definen IAS-19 como el estándar internacional 
              de referencia para beneficios a empleados.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {caracteristicasIFRS.map((caracteristica, index) => (
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

      {/* Tipos de Beneficios */}
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
              Clasificación de <span className="font-semibold">Beneficios</span>
            </h2>
            <p className="max-w-3xl mx-auto text-lg text-gray-600">
              IAS-19 categoriza los beneficios a empleados según su naturaleza y 
              momento de pago, con tratamiento contable específico para cada tipo.
            </p>
          </motion.div>

          <div className="space-y-8">
            {tiposBeneficios.map((categoria, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 rounded-xl p-6 lg:p-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="mb-4 h-px w-12 bg-gray-900" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">{categoria.categoria}</h3>
                
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <h4 className="text-lg font-medium text-gray-900 mb-3">Tipos Incluidos</h4>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {categoria.tipos.map((tipo, tipoIndex) => (
                        <div key={tipoIndex} className="text-sm text-gray-600 flex items-start gap-2">
                          <CheckCircleIcon className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          {tipo}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-3">Tratamiento Contable</h4>
                    <p className="text-sm text-gray-600">{categoria.tratamiento}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Proceso de Implementación */}
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
              Proceso de <span className="font-semibold">Implementación</span>
            </h2>
            <p className="max-w-3xl mx-auto text-lg text-gray-600">
              Metodología estructurada para adoptar IAS-19 de manera efectiva 
              y mantener el cumplimiento con estándares internacionales.
            </p>
          </motion.div>

          <div className="space-y-8">
            {procesoImplementacion.map((proceso, index) => (
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

      {/* Consideraciones Especiales */}
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
              Consideraciones <span className="font-semibold">Técnicas</span>
            </h2>
            <p className="max-w-3xl mx-auto text-lg text-gray-600">
              Aspectos técnicos específicos que requieren atención especial 
              en la aplicación de IAS-19.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {consideracionesEspeciales.map((consideracion, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 rounded-xl p-6 lg:p-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="mb-4 h-px w-12 bg-gray-900" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{consideracion.titulo}</h3>
                <p className="text-gray-600 mb-4">{consideracion.descripcion}</p>
                <ul className="space-y-2">
                  {consideracion.ejemplos.map((ejemplo, ejemploIndex) => (
                    <li key={ejemploIndex} className="text-sm text-gray-600 flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      {ejemplo}
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
                ¿Necesita Implementar <span className="font-semibold">IAS-19</span>?
              </h2>
              <p className="max-w-2xl mx-auto text-lg text-gray-700 mb-8">
                Nuestros especialistas internacionales le ayudarán a adoptar IAS-19 
                y mantener el cumplimiento con estándares globales.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setIsContactModalOpen(true)}
                  className="bg-white text-gray-900 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-all duration-200 hover:shadow-lg"
                >
                  Consulta Internacional
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