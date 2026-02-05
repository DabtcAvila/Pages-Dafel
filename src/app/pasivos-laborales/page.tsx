'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRightIcon, CheckCircleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import ContactModal from '@/components/ContactModalOptimized';

export default function PasivosLaboralesPage() {
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


  const pasivosTypes = [
    {
      title: "Prima de Antigüedad",
      description: "Obligación patronal establecida por la Ley Federal del Trabajo pagadera en casos de: muerte, invalidez, despido, y separación voluntaria con más de 15 años de servicio.",
      features: [
        "Valuación bajo NIF D-3 / ASC 715 / IAS-19",
        "Cálculo actuarial completo aplicable a toda empresa con trabajadores sin importar su tamaño"
      ]
    },
    {
      title: "Indemnizaciones por Despido",
      description: "Pasivos derivados de terminación de relación laboral sin causa justificada o por causa imputable al patrón.",
      features: [
        "Indemnización constitucional, salarios vencidos y prestaciones pendientes",
        "Importe conforme a Ley, o montos acordados con el trabajador a cambio de la renuncia voluntaria",
        "Se pueden dar de forma planeada (reestructuras) o por rotación habitual de personal",
        "Valuación bajo NIF D-3 / ASC 715 / IAS-19 aplicable a toda empresa"
      ]
    },
    {
      title: "Planes de Pensiones",
      description: "Obligaciones post-empleo y otros beneficios a largo plazo para empleados. Provienen de planes privados o beneficios adicionales a los de ley.",
      features: [
        "Contribución Definida (aportaciones fijas, sin beneficios mínimos a la jubilación)",
        "Beneficio Definido o Híbridos",
        "Valuación bajo NIF D-3 / ASC 715 / IAS-19",
        "Cálculo actuarial completo aplicable"
      ]
    }
  ];

  const normativas = [
    {
      norma: "NIF D-3",
      descripcion: "Norma de Información Financiera para beneficios a empleados en México",
      aplicacion: "Empresas públicas y privadas mexicanas",
      href: "/nif-d3"
    },
    {
      norma: "IAS-19", 
      descripcion: "International Financial Reporting Standards para beneficios a empleados",
      aplicacion: "Subsidiarias de empresas internacionales",
      href: "/ias-19"
    },
    {
      norma: "US GAAP",
      descripcion: "Generally Accepted Accounting Principles estadounidenses",
      aplicacion: "Empresas que reportan en EE.UU.",
      href: "/us-gaap"
    }
  ];

  return (
    <>
      {/* Advanced JSON-LD for Featured Snippets */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "name": "Preguntas Frecuentes sobre Pasivos Laborales en México",
          "description": "Respuestas expertas sobre valuación actuarial de pasivos laborales, prima de antigüedad e indemnizaciones bajo NIF D-3",
          "publisher": {
            "@type": "Organization",
            "name": "DAFEL Technologies",
            "url": "https://dafel.com.mx"
          },
          "mainEntity": [
            {
              "@type": "Question",
              "name": "¿Cuándo es obligatorio registrar los pasivos laborales?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Los pasivos laborales deben registrarse desde el momento en que se genera la obligación laboral. Para prima de antigüedad desde el primer día de contratación, para indemnizaciones desde que existe la probabilidad de terminación laboral. La valuación actuarial determina el monto exacto a reconocer contablemente bajo NIF D-3."
              }
            },
            {
              "@type": "Question", 
              "name": "¿Qué diferencia hay entre prima de antigüedad e indemnizaciones?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Prima de antigüedad es obligación patronal por Ley Federal del Trabajo pagadera en muerte, invalidez, despido y separación voluntaria +15 años. Indemnizaciones son compensaciones por despido injustificado. Ambas requieren valuación actuarial pero tienen bases de cálculo diferentes."
              }
            },
            {
              "@type": "Question",
              "name": "¿Cada cuánto tiempo se debe actualizar la valuación de pasivos laborales?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Mínimo anualmente para cumplir con auditorías externas. Se recomienda semestralmente para empresas grandes o cuando hay cambios significativos en nómina, salarios o beneficios. Los auditores externos requieren estudios actuariales actualizados para eliminar observaciones."
              }
            }
          ]
        })
      }} />
      
      {/* How-To Schema for Process Guidance */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          "name": "Cómo Calcular Pasivos Laborales en México",
          "description": "Proceso paso a paso para valuación actuarial de pasivos laborales bajo NIF D-3",
          "image": "https://dafel.com.mx/dafel-og-image.png",
          "totalTime": "PT30D",
          "estimatedCost": {
            "@type": "MonetaryAmount",
            "currency": "MXN",
            "value": "Variable"
          },
          "supply": [
            {
              "@type": "HowToSupply",
              "name": "Información de empleados actualizada"
            },
            {
              "@type": "HowToSupply", 
              "name": "Políticas de beneficios de la empresa"
            },
            {
              "@type": "HowToSupply",
              "name": "Actuario certificado en pasivos laborales"
            }
          ],
          "step": [
            {
              "@type": "HowToStep",
              "name": "Análisis de Base de Datos",
              "text": "Recopilar información completa de empleados: antigüedad, salarios, edad, beneficios. Validar integridad de datos para cálculo actuarial preciso.",
              "url": "https://dafel.com.mx/pasivos-laborales#analisis"
            },
            {
              "@type": "HowToStep",
              "name": "Aplicación de Métodos Actuariales",
              "text": "Utilizar técnicas estadísticas bajo NIF D-3 para proyectar obligaciones futuras. Considerar mortalidad, rotación, incrementos salariales según experiencia empresarial.",
              "url": "https://dafel.com.mx/pasivos-laborales#metodos"
            },
            {
              "@type": "HowToStep",
              "name": "Cálculo de Prima de Antigüedad",
              "text": "Determinar obligación por Ley Federal del Trabajo: 12 días de salario por año trabajado. Aplicar probabilidades actuariales para muerte, invalidez, despido y separación voluntaria.",
              "url": "https://dafel.com.mx/prima-antiguedad"
            },
            {
              "@type": "HowToStep",
              "name": "Valuación de Indemnizaciones",
              "text": "Calcular pasivos por terminación laboral según políticas empresariales y rotación histórica. Incluir 3 meses de salario + 20 días por año + prestaciones.",
              "url": "https://dafel.com.mx/indemnizaciones"
            },
            {
              "@type": "HowToStep",
              "name": "Documentación para Auditoria",
              "text": "Elaborar reporte actuarial completo con metodología, supuestos y resultados. Certificación CONAC para cumplir requerimientos de auditores externos.",
              "url": "https://dafel.com.mx/pasivos-laborales#auditoria"
            }
          ]
        })
      }} />

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



      {/* ¿Qué son los Pasivos Laborales? */}
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
                ¿Qué son los <span className="font-semibold">Pasivos Laborales</span>?
              </h2>
              
              <div className="prose prose-lg text-gray-600 space-y-4">
                <p>
                  Los pasivos laborales representan las <strong>obligaciones futuras</strong> que una empresa 
                  debe cumplir con sus empleados, derivadas de la <strong>Ley Federal del Trabajo</strong> por su relación laboral presente y pasada.
                </p>
                
                <p>
                  Estas obligaciones incluyen beneficios post-empleo, indemnizaciones, prima de antigüedad 
                  y otros compromisos laborales que deben ser <strong>valuados, reconocidos y provisionados</strong> adecuadamente en los estados financieros. Estas obligaciones son generadas durante los años de servicio y no solamente en el año en el que se retiran los empleados y es necesario pagarles.
                </p>

                <p>
                  La correcta gestión de pasivos laborales no solo asegura el <strong>cumplimiento normativo</strong>, 
                  sino que también proporciona <strong>transparencia financiera</strong>, reduce riesgos operacionales y de{' '}
                  <strong>omisiones en auditorías o revisiones fiscales</strong>.
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
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Principales Características</h3>
                <div className="space-y-4">
                  {[
                    "Obligaciones futuras por servicios pasados",
                    "Requieren valuación actuarial especializada", 
                    "Impactan estados financieros significativamente",
                    "Sujetos a regulación específica por norma (NIF D-3 en México, IAS-19 Internacional, ASC 715 en Estados Unidos)"
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

      {/* Tipos de Pasivos Laborales */}
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
              Tipos de <span className="font-semibold">Pasivos Laborales</span>
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
              Análisis especializado para cada tipo de obligación laboral según su naturaleza y marco normativo aplicable.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {pasivosTypes.map((tipo, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{tipo.title}</h3>
                <p className="text-gray-600 mb-6">{tipo.description}</p>
                
                <div className="space-y-2">
                  {tipo.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Marco Normativo */}
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
              <span className="font-semibold">Marco</span> Normativo
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
              Cumplimiento integral con las principales normativas contables mexicanas e internacionales.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
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
                    className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                    style={{
                      '&:hover': {
                        borderColor: '#9fc8fc'
                      }
                    } as any}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#9fc8fc';
                      e.currentTarget.querySelector('h3')!.style.color = '#9fc8fc';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '';
                      e.currentTarget.querySelector('h3')!.style.color = '';
                    }}
                  >
                    <div className="text-center">
                      <h3 className="text-2xl font-semibold text-gray-900 mb-2 transition-colors">{normativa.norma}</h3>
                      <p className="text-gray-600 mb-4">{normativa.descripcion}</p>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <span className="text-sm font-medium text-gray-700">{normativa.aplicacion}</span>
                      </div>
                    </div>
                  </div>
                </Link>
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
                ¿Necesitas una <span className="font-semibold">Valuación Actuarial</span>?
              </h2>
              <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-700 mb-6 sm:mb-8 px-4 sm:px-0">
                Nuestro equipo de actuarios especializados te ayuda a cumplir con todas las normativas 
                y optimizar la gestión de tus pasivos laborales.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
                <button
                  onClick={() => setIsContactModalOpen(true)}
                  className="bg-white text-gray-900 px-6 sm:px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-all duration-200 hover:shadow-lg w-full sm:w-auto"
                >
                  Contactar Especialista
                </button>
                <button
                  onClick={() => setIsContactModalOpen(true)}
                  className="bg-white bg-opacity-90 text-gray-900 border border-gray-300 px-6 sm:px-8 py-3 rounded-lg font-medium hover:bg-opacity-100 hover:border-gray-400 transition-all duration-200 w-full sm:w-auto"
                >
                  Solicitar Cotización
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