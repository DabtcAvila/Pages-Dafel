'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRightIcon, CheckCircleIcon, ClockIcon, HeartIcon, CurrencyDollarIcon, DocumentTextIcon, UserGroupIcon, ChartBarIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import ContactModal from '@/components/ContactModalOptimized';

export default function GastosMedicosRetiroPage() {
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

  const tiposBeneficios = [
    {
      tipo: "Seguros de Gastos Médicos Mayores",
      descripcion: "Cobertura integral para tratamientos médicos especializados y hospitalarios post-jubilación",
      caracteristicas: [
        "Cobertura hospitalaria completa",
        "Tratamientos especializados y cirugías",
        "Medicamentos de alto costo",
        "Terapias de rehabilitación"
      ],
      consideraciones: [
        "Incremento de costos médicos por inflación",
        "Mayor utilización por edad avanzada",
        "Tecnologías médicas emergentes",
        "Cambios en perfiles epidemiológicos"
      ]
    },
    {
      tipo: "Consultas Médicas de Rutina",
      descripcion: "Atención médica preventiva y de mantenimiento para jubilados y pensionados",
      caracteristicas: [
        "Consultas con medicina general",
        "Especialistas médicos",
        "Estudios diagnósticos periódicos",
        "Medicina preventiva"
      ],
      consideraciones: [
        "Frecuencia aumentada con la edad",
        "Costos crecientes de consultas",
        "Necesidad de medicina geriátrica",
        "Programas de prevención específicos"
      ]
    },
    {
      tipo: "Medicamentos y Tratamientos Crónicos",
      descripcion: "Cobertura de medicamentos y terapias para enfermedades crónicas comunes en la vejez",
      caracteristicas: [
        "Medicamentos para diabetes",
        "Tratamientos cardiovasculares",
        "Medicinas para hipertensión",
        "Terapias oncológicas"
      ],
      consideraciones: [
        "Desarrollo de nuevos medicamentos",
        "Patentes y medicamentos genéricos",
        "Terapias personalizadas",
        "Costos de medicamentos especializados"
      ]
    },
    {
      tipo: "Cuidados a Largo Plazo",
      descripcion: "Servicios de atención prolongada para jubilados con dependencia funcional",
      caracteristicas: [
        "Cuidados en el hogar",
        "Instituciones geriátricas",
        "Servicios de enfermería",
        "Terapias ocupacionales"
      ],
      consideraciones: [
        "Aumento de expectativa de vida",
        "Mayor prevalencia de dependencia",
        "Costos elevados de cuidados especializados",
        "Escasez de personal capacitado"
      ]
    }
  ];

  const factoresActuariales = [
    {
      factor: "Tendencias de Costos Médicos",
      descripcion: "Proyección de incrementos en costos de atención médica superior a la inflación general",
      componentes: [
        "Inflación médica histórica (5-8% anual)",
        "Introducción de nuevas tecnologías",
        "Costos de medicamentos innovadores",
        "Cambios en protocolos médicos"
      ]
    },
    {
      factor: "Utilización por Edad",
      descripcion: "Patrones de uso de servicios médicos según grupos de edad post-jubilación",
      componentes: [
        "Frecuencia de consultas por edad",
        "Probabilidades de hospitalización",
        "Uso de medicamentos crónicos",
        "Servicios de emergencia"
      ]
    },
    {
      factor: "Demografía de Jubilados",
      descripcion: "Características demográficas que impactan el costo y utilización de beneficios médicos",
      componentes: [
        "Distribución por edad y género",
        "Condiciones de salud preexistentes",
        "Esperanza de vida post-jubilación",
        "Dependientes elegibles (cónyuge)"
      ]
    },
    {
      factor: "Diseño del Plan",
      descripcion: "Estructura de beneficios que determina la exposición de costos para la empresa",
      componentes: [
        "Deducibles y coaseguros",
        "Límites anuales y de por vida",
        "Redes de proveedores médicos",
        "Servicios incluidos y excluidos"
      ]
    }
  ];

  const procesovaluacion = [
    {
      etapa: "Análisis de Experiencia",
      descripcion: "Estudio detallado de la experiencia histórica de costos médicos de jubilados",
      actividades: [
        "Recopilación de datos de siniestralidad",
        "Análisis de tendencias de utilización",
        "Identificación de patrones por edad",
        "Benchmarking con mercado asegurador"
      ],
      duracion: "4-5 semanas"
    },
    {
      etapa: "Modelado de Costos",
      descripcion: "Desarrollo de modelo actuarial para proyectar costos futuros de beneficios médicos",
      actividades: [
        "Definición de curvas de utilización",
        "Proyección de tendencias médicas",
        "Modelado de supervivencia post-jubilación",
        "Incorporación de factores de riesgo"
      ],
      duracion: "5-6 semanas"
    },
    {
      etapa: "Cálculo de Obligaciones",
      descripcion: "Determinación del valor presente de obligaciones por beneficios médicos post-empleo",
      actividades: [
        "Proyección de flujos de efectivo",
        "Descuento con tasas apropiadas",
        "Cálculo de componentes del costo",
        "Análisis de sensibilidad robusto"
      ],
      duracion: "3-4 semanas"
    },
    {
      etapa: "Monitoreo y Actualización",
      descripcion: "Establecimiento de procesos de seguimiento y actualización de valuaciones",
      actividades: [
        "Sistema de monitoreo de experiencia",
        "Actualización de tendencias médicas",
        "Revisión anual de supuestos",
        "Análisis de experiencia vs. esperado"
      ],
      duracion: "Proceso continuo"
    }
  ];

  const hipotesisEspecializadas = [
    {
      categoria: "Tendencias Médicas",
      hipotesis: [
        "Inflación médica: 6.5% anual promedio",
        "Incremento diferencial por tipo de servicio",
        "Impacto de nuevas tecnologías médicas",
        "Efectos de reformas en sistema de salud"
      ]
    },
    {
      categoria: "Utilización de Servicios",
      hipotesis: [
        "Consultas médicas: 8-12 por año según edad",
        "Hospitalización: 0.15-0.25 eventos anuales",
        "Medicamentos: 85% de jubilados usuarios",
        "Estudios diagnósticos: crecimiento 3% anual"
      ]
    },
    {
      categoria: "Supervivencia Post-Jubilación",
      hipotesis: [
        "Tablas de mortalidad específicas de jubilados",
        "Ajustes por condición socioeconómica",
        "Diferencial por género (mujeres +3 años)",
        "Mejora en mortalidad: 1.5% anual"
      ]
    },
    {
      categoria: "Factores Económicos",
      hipotesis: [
        "Tasa de descuento: curva de bonos corporativos",
        "Correlación con inflación general",
        "Impacto de políticas públicas de salud",
        "Efectos de subsidios gubernamentales"
      ]
    }
  ];

  const estrategiasGestion = [
    {
      estrategia: "Gestión de Costos Médicos",
      descripcion: "Implementación de medidas para controlar el crecimiento de costos sin comprometer la calidad",
      acciones: [
        "Programas de medicina preventiva",
        "Negociación con redes de proveedores",
        "Protocolos de autorización previa",
        "Medicina basada en evidencia"
      ]
    },
    {
      estrategia: "Optimización del Diseño de Plan",
      descripcion: "Ajuste de características del plan para balancear costos y beneficios",
      acciones: [
        "Implementación de deducibles escalonados",
        "Coaseguros diferenciados por servicio",
        "Límites anuales y de por vida apropiados",
        "Incentivos para uso de medicina preventiva"
      ]
    },
    {
      estrategia: "Fondeo y Reservas",
      descripcion: "Estrategias financieras para asegurar la sostenibilidad de los beneficios",
      acciones: [
        "Constitución de fondos específicos",
        "Inversiones de largo plazo",
        "Seguros de stop-loss para casos catastróficos",
        "Optimización fiscal de contribuciones"
      ]
    },
    {
      estrategia: "Gestión Actuarial Continua",
      descripcion: "Monitoreo y ajuste constante de supuestos y proyecciones",
      acciones: [
        "Valuaciones actuariales frecuentes",
        "Análisis de experiencia trimestral",
        "Actualización de tendencias médicas",
        "Modelado de escenarios de stress"
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


      {/* ¿Qué son los Gastos Médicos al Retiro? */}
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
                ¿Qué son los <span className="font-semibold">Gastos Médicos al Retiro</span>?
              </h2>
              
              <div className="prose prose-lg text-gray-600 space-y-4">
                <p>
                  Los <strong>gastos médicos al retiro</strong> son beneficios post-empleo que consisten 
                  en la cobertura de atención médica, hospitalaria y farmacéutica para empleados 
                  jubilados y sus dependientes elegibles.
                </p>
                
                <p>
                  Estos beneficios requieren <strong>valuación actuarial especializada</strong> que considera 
                  factores únicos como tendencias de costos médicos, utilización por edad, cambios 
                  demográficos y avances tecnológicos en medicina, presentando desafíos técnicos particulares.
                </p>

                <p>
                  La valuación de gastos médicos post-empleo es fundamental para el <strong>cumplimiento 
                  contable</strong> bajo IAS-19, ASC 715 y NIF D-3, representando uno de los pasivos 
                  más volátiles e inciertos en la gestión de beneficios a empleados.
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
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Características Distintivas</h3>
                <div className="space-y-4">
                  {[
                    "Costos médicos crecientes por inflación",
                    "Mayor utilización con el envejecimiento", 
                    "Incertidumbre en proyecciones a largo plazo",
                    "Impacto de avances médicos y tecnológicos"
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

      {/* Tipos de Beneficios */}
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
              Tipos de <span className="font-semibold">Beneficios Médicos</span>
            </h2>
            <p className="max-w-3xl mx-auto text-lg text-gray-600">
              Clasificación de beneficios médicos post-empleo según tipo de cobertura 
              y sus consideraciones actuariales específicas.
            </p>
          </motion.div>

          <div className="space-y-8">
            {tiposBeneficios.map((beneficio, index) => (
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
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">{beneficio.tipo}</h3>
                  <p className="text-gray-600 mb-6">{beneficio.descripcion}</p>
                  
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <HeartIcon className="h-5 w-5 text-red-600" />
                        Servicios Incluidos
                      </h4>
                      <ul className="space-y-2">
                        {beneficio.caracteristicas.map((caracteristica, carIndex) => (
                          <li key={carIndex} className="text-sm text-gray-600 flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                            {caracteristica}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <ChartBarIcon className="h-5 w-5 text-blue-600" />
                        Consideraciones Actuariales
                      </h4>
                      <ul className="space-y-2">
                        {beneficio.consideraciones.map((consideracion, consIndex) => (
                          <li key={consIndex} className="text-sm text-gray-600 flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                            {consideracion}
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
              Variables especializadas consideradas en la valuación actuarial de 
              beneficios médicos post-empleo.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
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
                      <DocumentTextIcon className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      {componente}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Proceso de Valuación */}
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
              Proceso de <span className="font-semibold">Valuación</span>
            </h2>
            <p className="max-w-3xl mx-auto text-lg text-gray-600">
              Metodología especializada para valuar beneficios médicos post-empleo 
              considerando sus características únicas.
            </p>
          </motion.div>

          <div className="space-y-8">
            {procesovaluacion.map((etapa, index) => (
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

      {/* Hipótesis Especializadas */}
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
              <span className="font-semibold">Hipótesis</span> Especializadas
            </h2>
            <p className="max-w-3xl mx-auto text-lg text-gray-600">
              Supuestos técnicos específicos requeridos para la valuación de 
              gastos médicos post-empleo.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {hipotesisEspecializadas.map((categoria, index) => (
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
                  {categoria.hipotesis.map((hipotesis, hipIndex) => (
                    <li key={hipIndex} className="text-sm text-gray-600 flex items-start gap-2">
                      <CurrencyDollarIcon className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      {hipotesis}
                    </li>
                  ))}
                </ul>
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
              Enfoques integrales para gestionar los costos y riesgos asociados 
              con beneficios médicos post-empleo.
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
                ¿Necesita Valuar <span className="font-semibold">Gastos Médicos</span>?
              </h2>
              <p className="max-w-2xl mx-auto text-lg text-gray-700 mb-8">
                Nuestros especialistas en beneficios médicos post-empleo le ayudarán 
                a valuar y gestionar estos complejos beneficios actuariales.
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