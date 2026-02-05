'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import ContactModal from '@/components/ContactModalOptimized';

export default function NosotrosPage() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const values = [
    {
      title: "Integridad",
      description: "Actuamos con transparencia y honestidad en todas nuestras relaciones comerciales."
    },
    {
      title: "Compromiso",
      description: "Nos dedicamos completamente al éxito y satisfacción de nuestros clientes."
    },
    {
      title: "Calidad Superior",
      description: "Entregamos servicios de la más alta calidad con estándares de excelencia."
    },
    {
      title: "Competitividad",
      description: "Mantenemos ventajas competitivas que benefician a nuestros clientes."
    }
  ];

  const services = [
    {
      title: "Atención Integral",
      description: "Trabajo directo con el personal de las distintas áreas de su empresa, además atendemos los requerimientos externos tanto de auditores como de las autoridades fiscales correspondientes."
    },
    {
      title: "Resultados Oportunos",
      description: "Nuestro sistema de comunicaciones, el tiempo de respuesta y la disponibilidad de nuestros ejecutivos los 365 días del año respaldan esta característica esencial para el éxito de nuestros proyectos en su empresa."
    },
    {
      title: "Confiabilidad y Satisfacción Total",
      description: "La capacitación constante y la amplia experiencia de nuestro equipo de consultores otorgan seguridad y confiabilidad a nuestros resultados."
    }
  ];

  return (
    <>
      {/* Breadcrumb Navigation */}
      <nav className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="text-gray-500 hover:text-gray-700 transition-colors">
                Inicio
              </Link>
            </li>
            <ChevronRightIcon className="h-4 w-4 text-gray-400" />
            <li>
              <span className="text-gray-900 font-medium">Nosotros</span>
            </li>
          </ol>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 text-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-gray-900 mb-6">
              Acerca de <span className="font-semibold">DAFEL</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-700 max-w-4xl mx-auto font-light">
              <span className="font-semibold">15 años</span> de experiencia brindando 
              <span className="font-semibold"> consultoría empresarial integral</span> y 
              asesoría en planes de beneficio a empleados
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quiénes Somos */}
      <section className="bg-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-6">
                ¿Quiénes <span className="font-semibold">somos</span>?
              </h2>
              
              <div className="prose prose-lg text-gray-600 space-y-4">
                <p>
                  <strong>DAFEL Consulting</strong> es una firma de Consultoría Empresarial en crecimiento, 
                  fundada en <strong>2009</strong> ofreciendo servicios integrales y asesoría en planes de 
                  beneficio a empleados y análisis de riesgos, brindando respaldo total en su toma de decisiones.
                </p>
                
                <p>
                  DAFEL Consulting surge tras un sueño de muchos años, motivado por la firme creencia de que 
                  las oportunidades se generan por medio de la <strong>entrega y el trabajo constante</strong> {' '}
                  para "estar a la altura de los propios ideales", los cuales exigen niveles de 
                  <strong> rendimiento superior, alta calidad, competitividad, integridad y compromiso</strong> {' '}
                  con nuestros clientes y con nuestra sociedad.
                </p>

                <p>
                  Nuestro país enfrenta retos de pobreza que aumentarán considerablemente en la población adulta, 
                  por lo que motivamos a nuestros clientes a fomentar la <strong>cultura del ahorro para el retiro</strong>, 
                  a través de planes contributorios, donde tanto la empresa como el trabajador constituyan 
                  beneficios que mejoren la calidad de vida a la jubilación.
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
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Nuestros Valores</h3>
                <div className="space-y-4">
                  {values.map((value, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircleIcon className="h-5 w-5 flex-shrink-0 mt-0.5" style={{color: '#9fc8fc'}} />
                      <div>
                        <h4 className="font-semibold text-gray-900">{value.title}</h4>
                        <p className="text-sm text-gray-600">{value.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Nuestros Clientes */}
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
              Nuestros <span className="font-semibold">Clientes</span>
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-lg text-gray-600 mb-8">
                DAFEL brinda asesoría a más de <span className="font-semibold text-gray-900">200 empresas</span> nacionales 
                y con presencia internacional, incluyendo a los sectores industriales y de servicios.
              </p>
              <p className="text-lg text-gray-600">
                Nuestros clientes reciben <span className="font-semibold text-gray-900">asesoría personalizada</span> sin importar el tamaño de la empresa.
              </p>
            </div>
          </motion.div>

          {/* Crecimiento */}
          <motion.div
            className="bg-white rounded-xl p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Crecimiento Acelerado</h3>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Desde sus inicios, la firma mantiene un <strong>nivel de crecimiento acelerado</strong>, 
              el cual nos lleva a desafíos constantes y a una <strong>máxima exigencia en nuestros procesos</strong>.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Nuestros Servicios Ofrecen */}
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
              Nuestros Servicios <span className="font-semibold">Ofrecen</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contacto con Banda Baja */}
      <section className="relative min-h-[500px] sm:h-80 lg:h-96 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
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
            title="Banda Baja Animation Final"
          />
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-full py-8 sm:py-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-gray-800 text-center lg:text-left"
              >
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light mb-4 sm:mb-6">
                  ¿Listo para <span className="font-semibold">trabajar juntos</span>?
                </h2>
                <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8">
                  Contáctanos y descubre cómo podemos ayudar a tu empresa a alcanzar sus objetivos.
                </p>
                <button
                  onClick={() => setIsContactModalOpen(true)}
                  className="bg-white text-gray-900 px-6 sm:px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-all duration-200 hover:shadow-lg w-full sm:w-auto"
                >
                  Contactar Especialista
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl p-6 sm:p-8 mt-6 lg:mt-0"
              >
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Información de Contacto</h3>
                
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-start gap-3 text-gray-600">
                    <svg className="h-5 w-5 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm sm:text-base font-medium text-gray-700 mb-1">Teléfonos</p>
                      <p className="text-sm sm:text-base">+52 (55) 4444-5684</p>
                      <p className="text-sm sm:text-base">+52 (55) 4623-0055</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 text-gray-600">
                    <svg className="h-5 w-5 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 0115 0z" />
                    </svg>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm sm:text-base font-medium text-gray-700 mb-1">Dirección</p>
                      <p className="text-sm sm:text-base">Savona No.72</p>
                      <p className="text-sm sm:text-base">Col. Residencial Acoxpa</p>
                      <p className="text-sm sm:text-base">Alcaldía Tlalpan</p>
                      <p className="text-sm sm:text-base">Ciudad de México C.P. 14300</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
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