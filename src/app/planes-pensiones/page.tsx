'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRightIcon, CheckCircleIcon, UserGroupIcon, ChartBarIcon, ShieldCheckIcon, CurrencyDollarIcon, CalendarIcon, ArrowTrendingUpIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import ContactModal from '@/components/ContactModalOptimized';

export default function PlanesPensionesPage() {
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

  const tiposPensiones = [
    {
      name: "Beneficio Definido",
      description: "Planes donde el beneficio futuro está predeterminado por una fórmula que considera factores como años de servicio y salario promedio.",
      caracteristicas: [
        "Beneficio garantizado al empleado",
        "Riesgo actuarial para el empleador",
        "Requiere valuaciones actuariales periódicas",
        "Otorgan ingreso adicional a la pensión IMSS y Bienestar"
      ],
      ventajas: [
        "Seguridad de ingreso para el empleado mejorando su calidad de vida a la jubilación",
        "Atracción y retención de talento",
        "Beneficios fiscales para la empresa y para el trabajador"
      ],
      consideraciones: [
        "Se puede otorgar pago único a la jubilación, o en forma de pensiones",
        "Costos con exposición a riesgos de longevidad en caso de otorgar pensiones",
        "Fondeo determinado por estudio actuarial"
      ]
    },
    {
      name: "Contribución Definida",
      description: "Planes donde las contribuciones están predefinidas, pero el beneficio final depende del monto acumulado y del rendimiento de las inversiones.",
      caracteristicas: [
        "Costos fijos o como porcentaje de la nómina claros y definidos por el patrón",
        "Beneficio variable según rendimientos",
        "Portabilidad entre empleadores",
        "Posibilidad de participación de trabajadores con aportaciones voluntarias"
      ],
      ventajas: [
        "Costos predecibles para el empleador",
        "Flexibilidad en contribuciones y fomenta el ahorro de largo plazo",
        "Menor complejidad regulatoria",
        "El trabajador ve crecer sus fondos individuales durante su vida laboral",
        "Retención de talento y mejora de calidad de vida a la jubilación"
      ],
      consideraciones: [
        "Riesgo de mercado para el empleado",
        "Requiere educación financiera",
        "Mayor complejidad administrativa"
      ]
    },
    {
      name: "Planes Híbridos",
      description: "Combinación de elementos de beneficio definido y contribución definida, ofreciendo balance entre seguridad y flexibilidad.",
      caracteristicas: [
        "Beneficio mínimo garantizado",
        "Riesgo compartido",
        "Flexibilidad en diseño"
      ],
      ventajas: [
        "Balance entre seguridad y costo",
        "Flexibilidad para diferentes generaciones",
        "Gestión de riesgos optimizada",
        "Posibilidad de participación de trabajadores con aportaciones voluntarias",
        "Portabilidad entre empleadores",
        "Adaptabilidad a diferentes perfiles"
      ],
      consideraciones: [
        "Mayor complejidad de comunicación",
        "Requiere diseño cuidadoso",
        "Supervisión regulatoria especializada"
      ]
    }
  ];

  const serviciosActuariales = [
    {
      icon: ChartBarIcon,
      title: "Diseño de Planes",
      description: "Diseñamos planes de pensiones personalizados que se adapten a los objetivos de su organización y perfil demográfico de empleados.",
      servicios: [
        "Análisis demográfico y financiero",
        "Modelado de diferentes estructuras",
        "Optimización de beneficios y costos",
        "Cumplimiento regulatorio"
      ]
    },
    {
      icon: ShieldCheckIcon,
      title: "Valuaciones Actuariales",
      description: "Realizamos valuaciones técnicas precisas para determinar obligaciones, costos y fondeo requerido bajo estándares nacionales e internacionales.",
      servicios: [
        "Valuaciones NIF D-3 e IAS-19",
        "Cálculo de reservas técnicas",
        "Análisis de sensibilidad",
        "Proyecciones de flujo de efectivo",
        "Registro de planes ante CONSAR para cumplimiento normativo"
      ]
    },
    {
      icon: ArrowTrendingUpIcon,
      title: "Gestión de Riesgos",
      description: "Identificamos, medimos y gestionamos los riesgos inherentes a los planes de pensiones para proteger tanto al empleador como al empleado.",
      servicios: [
        "Análisis de riesgo de longevidad",
        "Gestión de riesgo de inversión",
        "Estrategias de cobertura (hedging)",
        "Monitoreo continuo de riesgos"
      ]
    },
    {
      icon: CurrencyDollarIcon,
      title: "Estrategias de Fondeo",
      description: "Desarrollamos estrategias óptimas de fondeo y políticas de inversión para asegurar la sostenibilidad financiera de los planes.",
      servicios: [
        "Políticas de contribución",
        "Asset-Liability Matching",
        "Optimización de portafolios",
        "Análisis de liquidez"
      ]
    }
  ];

  const procesoPensiones = [
    {
      paso: 1,
      titulo: "Diagnóstico Inicial",
      descripcion: "Evaluamos la situación actual de la empresa y objetivos del plan de pensiones",
      actividades: ["Análisis demográfico", "Evaluación financiera", "Benchmarking sectorial"]
    },
    {
      paso: 2,
      titulo: "Diseño Actuarial",
      descripcion: "Desarrollamos la estructura técnica del plan adaptada a las necesidades específicas",
      actividades: ["Modelado actuarial", "Simulaciones", "Optimización de beneficios"]
    },
    {
      paso: 3,
      titulo: "Implementación",
      descripcion: "Ponemos en marcha el plan con todos los componentes técnicos y administrativos",
      actividades: ["Documentación técnica", "Sistemas de administración", "Capacitación"]
    },
    {
      paso: 4,
      titulo: "Registro y revalidación anual CONSAR",
      descripcion: "Permite excluir del Salario Integrado de aportaciones al IMSS, las contribuciones realizadas al plan",
      actividades: ["Trámites ante CONSAR", "Documentación regulatoria", "Validación anual"]
    },
    {
      paso: 5,
      titulo: "Monitoreo Continuo",
      descripcion: "Supervisamos el plan y realizamos ajustes necesarios para mantener su efectividad",
      actividades: ["Valuaciones periódicas", "Análisis de experiencia", "Ajustes técnicos"]
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


      {/* ¿Qué son los Planes de Pensiones? */}
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
                ¿Qué son los <span className="font-semibold">Planes de Pensiones</span>?
              </h2>
              
              <div className="prose prose-lg text-gray-600 space-y-4">
                <p>
                  Los planes de pensiones son <strong>sistemas estructurados de ahorro y protección</strong> diseñados 
                  para proporcionar ingresos a los empleados durante su jubilación, complementando o sustituyendo 
                  los sistemas públicos de seguridad social.
                </p>
                
                <p>
                  Estos planes requieren <strong>diseño actuarial especializado</strong> para equilibrar los beneficios 
                  ofrecidos con la sostenibilidad financiera, considerando factores demográficos, económicos y 
                  regulatorios específicos de cada organización.
                </p>

                <p>
                  La implementación exitosa de un plan de pensiones no solo cumple con <strong>obligaciones laborales</strong>, 
                  sino que se convierte en una herramienta estratégica para la atracción y retención de talento, 
                  mientras optimiza el tratamiento fiscal y contable de la empresa.
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
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Beneficios Clave</h3>
                <div className="space-y-4">
                  {[
                    "Seguridad financiera para empleados",
                    "Ventajas fiscales para la empresa", 
                    "Herramienta de retención de talento",
                    "Cumplimiento de obligaciones laborales"
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

      {/* Tipos de Planes */}
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
              Tipos de <span className="font-semibold">Planes de Pensiones</span>
            </h2>
            <p className="max-w-3xl mx-auto text-lg text-gray-600">
              Cada tipo de plan tiene características específicas que deben evaluarse según los objetivos 
              organizacionales y el perfil demográfico de los empleados.
            </p>
          </motion.div>

          <div className="space-y-8">
            {tiposPensiones.map((tipo, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="p-6 lg:p-8">
                  <div className="mb-4 h-px w-12 bg-gray-900" />
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">{tipo.name}</h3>
                  <p className="text-gray-600 mb-6">{tipo.description}</p>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <CheckCircleIcon className="h-5 w-5 text-green-600" />
                        Características
                      </h4>
                      <ul className="space-y-2">
                        {tipo.caracteristicas.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-sm text-gray-600 flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <ArrowTrendingUpIcon className="h-5 w-5 text-green-600" />
                        Ventajas
                      </h4>
                      <ul className="space-y-2">
                        {tipo.ventajas.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-sm text-gray-600 flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <ShieldCheckIcon className="h-5 w-5 text-orange-600" />
                        Consideraciones
                      </h4>
                      <ul className="space-y-2">
                        {tipo.consideraciones.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-sm text-gray-600 flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Servicios Actuariales */}
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
              Servicios <span className="font-semibold">Actuariales Especializados</span>
            </h2>
            <p className="max-w-3xl mx-auto text-lg text-gray-600">
              Ofrecemos consultoría integral para el diseño, implementación y gestión de planes de 
              pensiones con rigor técnico y cumplimiento normativo.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {serviciosActuariales.map((servicio, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 rounded-xl p-6 lg:p-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex items-start gap-4">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <servicio.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{servicio.title}</h3>
                    <p className="text-gray-600 mb-4">{servicio.description}</p>
                    <ul className="space-y-2">
                      {servicio.servicios.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-sm text-gray-600 flex items-start gap-2">
                          <CheckCircleIcon className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          {item}
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
              Metodología estructurada para asegurar el éxito en la implementación y gestión 
              continua de su plan de pensiones.
            </p>
          </motion.div>

          <div className="space-y-8">
            {/* Primera fila: 3 elementos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {procesoPensiones.slice(0, 3).map((proceso, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-xl p-6 text-center relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">
                      {proceso.paso}
                    </div>
                  </div>
                  <div className="pt-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{proceso.titulo}</h3>
                    <p className="text-sm text-gray-600 mb-4">{proceso.descripcion}</p>
                    <ul className="space-y-1">
                      {proceso.actividades.map((actividad, actIndex) => (
                        <li key={actIndex} className="text-xs text-gray-500">
                          {actividad}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Segunda fila: 2 elementos centrados */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {procesoPensiones.slice(3).map((proceso, index) => (
                <motion.div
                  key={index + 3}
                  className="bg-white rounded-xl p-6 text-center relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: (index + 3) * 0.1 }}
                >
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">
                      {proceso.paso}
                    </div>
                  </div>
                  <div className="pt-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{proceso.titulo}</h3>
                    <p className="text-sm text-gray-600 mb-4">{proceso.descripcion}</p>
                    <ul className="space-y-1">
                      {proceso.actividades.map((actividad, actIndex) => (
                        <li key={actIndex} className="text-xs text-gray-500">
                          {actividad}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
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
                ¿Listo para <span className="font-semibold">Diseñar su Plan</span>?
              </h2>
              <p className="max-w-2xl mx-auto text-lg text-gray-700 mb-8">
                Nuestros actuarios especializados le ayudarán a diseñar e implementar un plan de 
                pensiones que se adapte perfectamente a su organización.
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
                  Solicitar Propuesta
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