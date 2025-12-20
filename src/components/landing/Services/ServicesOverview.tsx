'use client';

import { motion } from 'framer-motion';
import { 
  ChartBarIcon, 
  CalculatorIcon, 
  DocumentTextIcon, 
  ComputerDesktopIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { Container, Card, Button } from '@/components/ui';
import { fadeInUp, staggerContainer, staggerItem, scrollFadeIn } from '@/lib/animations';
import { serviceCategories } from '@/data/services';

const iconMap = {
  'TrendingUpIcon': ChartBarIcon,
  'CalculatorIcon': CalculatorIcon,
  'DocumentTextIcon': DocumentTextIcon,
  'ComputerDesktopIcon': ComputerDesktopIcon,
};

export default function ServicesOverview() {
  // Seleccionar los 3 servicios principales para el overview
  const featuredServices = serviceCategories.slice(0, 3);

  return (
    <section className="section-padding bg-white" id="services">
      <Container maxWidth="xl">
        {/* Section Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <motion.div
            variants={staggerItem}
            className="inline-flex items-center px-4 py-2 rounded-full bg-dafel-blue-50 text-dafel-blue-600 text-sm font-medium mb-6"
          >
            <CheckCircleIcon className="w-4 h-4 mr-2" />
            Servicios especializados
          </motion.div>

          <motion.h2
            variants={staggerItem}
            className="heading-section text-balance mb-6"
          >
            El Tesoro Oculto en tu{' '}
            <span className="text-dafel-blue-500">Cajón de Reportes</span>{' '}
            Actuariales
          </motion.h2>

          <motion.p
            variants={staggerItem}
            className="text-lead text-balance max-w-3xl mx-auto"
          >
            ¿Reconoces esta situación? 10+ años de reportes actuariales archivados en PDFs, 
            datos valiosos dispersos en emails, decisiones basadas solo en el reporte más reciente. 
            <strong className="text-dafel-blue-600"> Nosotros convertimos ese archivo en tu ventaja estratégica</strong>.
          </motion.p>
        </motion.div>

        {/* Problem → Solution Visual */}
        <motion.div
          {...scrollFadeIn}
          className="mb-20"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Problema */}
            <Card variant="outlined" className="p-8 border-red-200 bg-red-50/30">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">❌</span>
                </div>
                <h3 className="text-xl font-bold text-red-700 mb-2">Situación Actual</h3>
                <p className="text-red-600">El problema que reconoces</p>
              </div>

              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-red-700">
                  <span className="text-red-500 mt-1">•</span>
                  <span>10+ años de reportes actuariales archivados en PDFs</span>
                </li>
                <li className="flex items-start gap-3 text-red-700">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Datos valiosos dispersos en emails y carpetas</span>
                </li>
                <li className="flex items-start gap-3 text-red-700">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Decisiones basadas solo en el reporte más reciente</span>
                </li>
                <li className="flex items-start gap-3 text-red-700">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Patrones históricos que nadie ha analizado</span>
                </li>
                <li className="flex items-start gap-3 text-red-700">
                  <span className="text-red-500 mt-1">•</span>
                  <span>Oportunidades fiscales pasando desapercibidas</span>
                </li>
              </ul>

              <div className="mt-6 p-4 bg-red-100 rounded-lg">
                <p className="text-red-800 text-sm italic">
                  "Cada reporte que recibiste contiene información estratégica. 
                  El problema es que nadie los ve como un conjunto inteligente."
                </p>
              </div>
            </Card>

            {/* Solución */}
            <Card variant="elevated" className="p-8 bg-gradient-to-br from-dafel-blue-50 to-dafel-orange-50 border-dafel-blue-200">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-dafel-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✅</span>
                </div>
                <h3 className="text-xl font-bold text-dafel-blue-700 mb-2">La Transformación</h3>
                <p className="text-dafel-blue-600">Imagínate esto:</p>
              </div>

              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-dafel-blue-700">
                  <CheckCircleIcon className="w-5 h-5 text-dafel-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Análisis histórico de 10 años en un dashboard inteligente</span>
                </li>
                <li className="flex items-start gap-3 text-dafel-blue-700">
                  <CheckCircleIcon className="w-5 h-5 text-dafel-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Tendencias de costos laborales proyectadas a 5 años</span>
                </li>
                <li className="flex items-start gap-3 text-dafel-blue-700">
                  <CheckCircleIcon className="w-5 h-5 text-dafel-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Identificación automática de oportunidades de ahorro</span>
                </li>
                <li className="flex items-start gap-3 text-dafel-blue-700">
                  <CheckCircleIcon className="w-5 h-5 text-dafel-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Comparativos anuales que revelan patrones ocultos</span>
                </li>
                <li className="flex items-start gap-3 text-dafel-blue-700">
                  <CheckCircleIcon className="w-5 h-5 text-dafel-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Recomendaciones estratégicas basadas en tu histórico</span>
                </li>
              </ul>

              <div className="mt-6 p-4 bg-white rounded-lg shadow-soft">
                <p className="text-dafel-blue-800 text-sm italic font-medium">
                  "Convertimos tu biblioteca de reportes en un sistema de inteligencia actuarial."
                </p>
              </div>
            </Card>
          </div>

          {/* Transformation Arrow */}
          <div className="flex justify-center my-8">
            <motion.div
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
              className="w-16 h-16 bg-dafel-orange-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <ArrowRightIcon className="w-8 h-8 text-white" />
            </motion.div>
          </div>
        </motion.div>

        {/* Featured Services Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="mb-16"
        >
          <motion.h3
            variants={staggerItem}
            className="text-2xl font-bold text-center text-dafel-slate-900 mb-12"
          >
            Nuestras 3 Especialidades Principales
          </motion.h3>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredServices.map((category, index) => {
              const IconComponent = iconMap[category.icon as keyof typeof iconMap] || ChartBarIcon;
              
              return (
                <motion.div
                  key={category.id}
                  variants={staggerItem}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card 
                    variant="elevated" 
                    className={`h-full p-8 ${category.highlight ? 'border-2 border-dafel-blue-200 bg-gradient-to-br from-white to-dafel-blue-50' : ''} card-hover`}
                  >
                    {category.highlight && (
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-dafel-orange-100 text-dafel-orange-700 text-xs font-semibold mb-4">
                        ⭐ MÁS POPULAR
                      </div>
                    )}
                    
                    <div className="text-center mb-6">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center ${
                        category.highlight 
                          ? 'bg-dafel-blue-500' 
                          : 'bg-dafel-slate-100'
                      }`}>
                        <IconComponent className={`w-8 h-8 ${
                          category.highlight 
                            ? 'text-white' 
                            : 'text-dafel-slate-600'
                        }`} />
                      </div>
                      
                      <h4 className="text-xl font-bold text-dafel-slate-900 mb-3">
                        {category.name}
                      </h4>
                      
                      <p className="text-dafel-slate-600 text-pretty">
                        {category.description}
                      </p>
                    </div>

                    {/* Service Highlights */}
                    <div className="space-y-3 mb-6">
                      {category.services.slice(0, 2).map((service, serviceIndex) => (
                        <div key={serviceIndex} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-dafel-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <h5 className="font-semibold text-dafel-slate-900 text-sm mb-1">
                              {service.name}
                            </h5>
                            <p className="text-dafel-slate-600 text-xs">
                              {service.description.substring(0, 80)}...
                            </p>
                            {service.historicalDataYears && (
                              <div className="text-dafel-blue-600 text-xs font-medium mt-1">
                                📊 {service.historicalDataYears} años de análisis
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full group"
                    >
                      Ver detalles
                      <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          {...scrollFadeIn}
          className="text-center bg-gradient-to-r from-dafel-blue-500 to-dafel-orange-500 rounded-2xl p-8 text-white"
        >
          <h3 className="text-2xl font-bold mb-4">
            ¿Listo para transformar tu histórico en ventaja estratégica?
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Agenda una consulta gratuita de 30 minutos. Analizamos tus reportes históricos 
            y te mostramos 3 oportunidades específicas que puedes activar inmediatamente.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-dafel-blue-600 hover:bg-blue-50"
            >
              Agendar Consulta Gratuita
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              Descargar Caso de Éxito
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}