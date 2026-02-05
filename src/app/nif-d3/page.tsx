'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRightIcon, CheckCircleIcon, DocumentTextIcon, ScaleIcon, ChartBarIcon, ClockIcon, UserGroupIcon, BanknotesIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import ContactModal from '@/components/ContactModalOptimized';

export default function NifD3Page() {
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

  const caracteristicasNIF = [
    {
      icon: DocumentTextIcon,
      titulo: "Marco Normativo",
      descripcion: "Norma emitida por el Consejo Mexicano de Normas de Información Financiera (CINIF) para regular el tratamiento contable de beneficios a empleados.",
      puntos: [
        "Aplicable a todas las entidades en México",
        "Convergencia con estándares internacionales",
        "Enfoque en transparencia y comparabilidad",
        "Actualizada periódicamente"
      ]
    },
    {
      icon: UserGroupIcon,
      titulo: "Alcance de Aplicación",
      descripcion: "Define qué beneficios a empleados deben reconocerse y cómo valuarlos actuarialmente.",
      puntos: [
        "Prima de antigüedad",
        "Beneficios por terminación",
        "Planes de jubilación",
        "PTU diferida",
        "Vacaciones y aguinaldo proporcional"
      ]
    },
    {
      icon: ChartBarIcon,
      titulo: "Método de Valuación",
      descripcion: "Establece el método de crédito unitario proyectado como base para la valuación actuarial.",
      puntos: [
        "Proyección de salarios futuros",
        "Aplicación de tablas de mortalidad",
        "Consideración de rotación de personal",
        "Descuento con tasas de bonos gubernamentales"
      ]
    },
    {
      icon: BanknotesIcon,
      titulo: "Reconocimiento Contable",
      descripcion: "Define cuándo y cómo reconocer los pasivos y costos por beneficios a empleados.",
      puntos: [
        "Reconocimiento de la Obligación por Beneficios Definidos (Servicios Pasados)",
        "Reconocimiento anual del Costo Neto por Beneficios Definidos (CNBD) del período (Cargo a Resultados del ejercicio)",
        "Ganancias y pérdidas actuariales con reconocimiento inmediato en Otros Resultados Integrales (ORI) y su posterior reciclaje al CNBD de ejercicios futuros",
        "Revelaciones en notas a estados financieros"
      ]
    }
  ];

  const procesoCumplimiento = [
    {
      paso: 1,
      fase: "Identificación",
      descripcion: "Identificar todos los beneficios a empleados que requieren tratamiento bajo NIF D-3",
      actividades: [
        "Básicos: Prima de Antigüedad e Indemnización Legal conforme a LFT",
        "Adicionales: contratos colectivos, políticas de RH, planes privados de beneficios al retiro",
        "Documentación de beneficios a enviar al actuario"
      ],
      tiempoEstimado: "1 día"
    },
    {
      paso: 2,
      fase: "Envío de Información Inicial al equipo actuarial",
      descripcion: "Tiempo definido por la empresa empleadora, estimado 1 semana",
      actividades: [
        "Información de beneficios detectados en el paso 1",
        "Datos del personal vigente en nómina (fechas de nacimiento, de ingreso, sueldos)",
        "Datos históricos de al menos 3 años del personal que ha causado \"baja\" en la empresa",
        "Dafel proporciona a sus clientes un layout de llenado de información necesaria"
      ],
      tiempoEstimado: "1 semana"
    },
    {
      paso: 3,
      fase: "Realizar la valuación actuarial de las obligaciones identificadas",
      descripcion: "Proceso técnico de cálculo actuarial",
      actividades: [
        "Análisis de información del personal",
        "Definición de hipótesis actuariales económicas y demográficas",
        "Cálculo de obligaciones conforme al método de \"Crédito Unitario Proyectado\"",
        "Determinación de obligaciones por servicios pasados (OBD), Costo Anual, revelaciones y notas a los estados financieros"
      ],
      tiempoEstimado: "1 a 3 días"
    },
    {
      paso: 4,
      fase: "Implementación",
      descripcion: "Incorporar los resultados actuariales en la contabilidad de la empresa",
      actividades: [
        "Registro de pasivos iniciales",
        "Ajustes a políticas contables",
        "Capacitación al equipo contable"
      ],
      tiempoEstimado: "1-2 días"
    },
    {
      paso: 5,
      fase: "Monitoreo",
      descripcion: "Establecer procesos para actualizaciones periódicas y cumplimiento continuo",
      actividades: [
        "Valuaciones actuariales anuales",
        "Actualización de hipótesis",
        "Monitoreo de cambios normativos",
        "Revisión de revelaciones"
      ],
      tiempoEstimado: "Continuo"
    }
  ];

  const hipotesisActuariales = [
    {
      categoria: "Demográficas",
      elementos: [
        "Tablas de mortalidad (EMSSA 2015)",
        "Tasas de rotación por edad y antigüedad",
        "Tasas de invalidez",
        "Edad de jubilación"
      ]
    },
    {
      categoria: "Financieras", 
      elementos: [
        "Tasa de descuento (bonos gubernamentales)",
        "Incrementos salariales futuros",
        "Inflación esperada",
        "Rendimiento de activos del plan"
      ]
    },
    {
      categoria: "Específicas del Plan",
      elementos: [
        "Porcentaje de empleados con derecho",
        "Fórmula de cálculo de beneficios",
        "Límites y topes aplicables",
        "Condiciones de elegibilidad"
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


      {/* ¿Qué es NIF D-3? */}
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
                <span className="font-semibold">NIF D-3</span>: Norma de Información Financiera D-3 "Beneficios a los empleados"
              </h1>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Marco Regulatorio Mexicano
                  </h3>
                  <p className="text-gray-600 mb-4">
                    La NIF D-3 establece los criterios para el reconocimiento, valuación actuarial, presentación y revelación de las obligaciones asumidas con los empleados, como son la prima de antigüedad e indemnizaciones por despido en cumplimiento con la Ley Federal del Trabajo (LFT).
                  </p>
                  <p className="text-gray-600 mb-4">
                    La NIF D-3 Fue emitida en 2014 y es obligatoria desde 2016 para todas las empresas con trabajadores en nómina, sin importar su tamaño.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Convergencia con Estándares Internacionales
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Esta norma busca la convergencia con los estándares internacionales (IAS-19) y requiere el uso de técnicas actuariales para determinar el valor presente de las obligaciones por beneficios definidos a registrar en contabilidad, asegurando información confiable sobre los compromisos laborales futuros de las empresas.
                  </p>
                  <p className="text-gray-600">
                    Dafel es una firma actuarial con más de 15 años asesorando a empresas nacionales y multinacionales en la correcta aplicación de la NIF D-3, con un equipo multidisciplinario que combina actuarios con experiencia, especialistas financieros y contables que traducen resultados técnicos en lenguaje de negocio y herramientas tecnológicas que agilizan la recopilación de datos y generan reportes intuitivos.
                  </p>
                </div>
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
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Principios Fundamentales</h3>
                <div className="space-y-4">
                  {[
                    "Reconocimiento de servicios pasados (pasivo devengado)",
                    "Valuación actuarial a valor presente", 
                    "Revelación transparente",
                    "Comparabilidad entre períodos"
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
              Características <span className="font-semibold">Principales</span>
            </h2>
            <p className="max-w-3xl mx-auto text-lg text-gray-600">
              Elementos clave que definen el alcance y aplicación de la norma NIF D-3 
              en el reconocimiento de beneficios a empleados.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {caracteristicasNIF.map((caracteristica, index) => (
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

      {/* Proceso de Cumplimiento */}
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
              Proceso de <span className="font-semibold">Cumplimiento de la NIF D-3</span>
            </h2>
            <p className="max-w-3xl mx-auto text-lg text-gray-600 mb-8">
              El estudio actuarial es la única técnica confiable para cuantificar los pasivos laborales contingentes, ya que combina estadística, finanzas y normativa contable para estimar con rigor profesional y transparencia, el costo real de los beneficios al personal.
            </p>
            <div className="max-w-3xl mx-auto mb-8">
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  Garantiza cifras defendibles ante auditorías
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  Sustenta decisiones de negocio
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  Mantiene a la empresa en cumplimiento con la NIF D-3 y estándares internacionales
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  Es la técnica de referencia —y exigida por la norma— para cuantificar pasivos laborales
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  Frecuencia anual
                </li>
              </ul>
            </div>
          </motion.div>

          <div className="space-y-8">
            {procesoCumplimiento.map((proceso, index) => (
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
                    {proceso.paso}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">{proceso.fase}</h3>
                      <span className="text-sm text-blue-600 font-medium flex items-center gap-1">
                        <ClockIcon className="h-4 w-4" />
                        {proceso.tiempoEstimado}
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

      {/* Hipótesis Actuariales */}
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
              <span className="font-semibold">Hipótesis</span> Actuariales
            </h2>
            <p className="max-w-3xl mx-auto text-lg text-gray-600">
              Variables y supuestos clave requeridos para la valuación actuarial 
              bajo los criterios de NIF D-3.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {hipotesisActuariales.map((categoria, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-6 lg:p-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="mb-4 h-px w-12 bg-gray-900" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{categoria.categoria}</h3>
                <ul className="space-y-3">
                  {categoria.elementos.map((elemento, elemIndex) => (
                    <li key={elemIndex} className="text-sm text-gray-600 flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      {elemento}
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
                ¿Necesita Cumplir con <span className="font-semibold">NIF D-3</span>?
              </h2>
              <p className="max-w-2xl mx-auto text-lg text-gray-700 mb-8">
                Nuestros actuarios especializados le ayudarán a implementar NIF D-3 
                de manera efectiva y mantener el cumplimiento normativo.
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