'use client';

import { motion } from 'framer-motion';
import { 
  ChartBarIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  DocumentChartBarIcon,
  LightBulbIcon,
  ArrowTrendingUpIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { Container, Card } from '@/components/ui';
import { scrollFadeIn, staggerContainer, staggerItem } from '@/lib/animations';

export default function DataAdvantage() {
  const advantages = [
    {
      icon: ChartBarIcon,
      title: "PRECISIÓN ESTRATÉGICA",
      subtitle: "Para el CFO",
      benefits: [
        "Presupuestos actuariales con 89% de precisión",
        "Identificación de ciclos de optimización fiscal específicos",
        "Reducción de sorpresas en auditorías mediante análisis predictivo"
      ],
      highlight: "vs. 34% con métodos tradicionales"
    },
    {
      icon: CalendarDaysIcon,
      title: "PLANIFICACIÓN INTELIGENTE",
      subtitle: "Para RH",
      benefits: [
        "Anticipación de jubilaciones masivas con 18 meses de anticipación",
        "Diseño de beneficios basado en patrones históricos de retención",
        "Costos laborales futuros calculados desde tu realidad específica"
      ],
      highlight: "No desde tablas genéricas"
    },
    {
      icon: ArrowTrendingUpIcon,
      title: "VENTAJA COMPETITIVA",
      subtitle: "Para la Dirección General",
      benefits: [
        "Decisiones estratégicas basadas en 15 años de aprendizaje actuarial",
        "Identificación de oportunidades que solo emergen del análisis temporal",
        "Convertir costos actuariales en inversión estratégica medible"
      ],
      highlight: "ROI demostrable"
    }
  ];

  const dataFlow = [
    {
      step: "1",
      title: "Reportes Dispersos",
      description: "PDFs en emails, Excel desactualizados, años de información sin aprovechar",
      icon: DocumentChartBarIcon,
      color: "text-red-500 bg-red-50"
    },
    {
      step: "2", 
      title: "Análisis Inteligente",
      description: "Procesamiento y consolidación de 5-15 años de data histórica",
      icon: SparklesIcon,
      color: "text-dafel-orange-500 bg-dafel-orange-50"
    },
    {
      step: "3",
      title: "Insights Accionables",
      description: "Dashboard con tendencias, proyecciones y recomendaciones específicas",
      icon: LightBulbIcon,
      color: "text-dafel-blue-500 bg-dafel-blue-50"
    }
  ];

  const keyNumbers = [
    {
      value: "$50M+",
      label: "Valor total identificado",
      description: "En oportunidades para nuestros clientes",
      icon: CurrencyDollarIcon
    },
    {
      value: "18%",
      label: "Ahorro fiscal promedio",
      description: "Identificado en análisis históricos",
      icon: ArrowTrendingUpIcon
    },
    {
      value: "89%",
      label: "Precisión en proyecciones",
      description: "vs 34% con métodos tradicionales",
      icon: ArrowTrendingUpIcon
    },
    {
      value: "15 años",
      label: "Rango de análisis",
      description: "Máximo histórico procesable",
      icon: CalendarDaysIcon
    }
  ];

  return (
    <section className="section-padding bg-sand-50" id="data-advantage">
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
            <SparklesIcon className="w-4 h-4 mr-2" />
            Tu ventaja histórica
          </motion.div>

          <motion.h2
            variants={staggerItem}
            className="heading-section text-balance mb-6"
          >
            ¿Por Qué el{' '}
            <span className="text-dafel-blue-500">Análisis Histórico</span>{' '}
            Cambia Todo?
          </motion.h2>

          <motion.p
            variants={staggerItem}
            className="text-lead text-balance max-w-4xl mx-auto"
          >
            Tu ventaja competitiva no está en el software más nuevo, sino en{' '}
            <strong className="text-dafel-blue-600">tu data más antigua analizada inteligentemente</strong>. 
            Años de información actuarial estructurada se convierten en predicciones precisas 
            y oportunidades estratégicas que tus competidores no pueden replicar.
          </motion.p>
        </motion.div>

        {/* Data Flow Visualization */}
        <motion.div
          {...scrollFadeIn}
          className="mb-20"
        >
          <h3 className="text-xl font-bold text-center text-dafel-slate-900 mb-12">
            La Transformación de Tus Datos
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            {dataFlow.map((step, index) => {
              const IconComponent = step.icon;
              
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="relative"
                >
                  <Card className="text-center p-8 h-full">
                    {/* Step Number */}
                    <div className="w-12 h-12 bg-dafel-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                      {step.step}
                    </div>
                    
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 ${step.color}`}>
                      <IconComponent className="w-8 h-8" />
                    </div>
                    
                    {/* Content */}
                    <h4 className="text-lg font-bold text-dafel-slate-900 mb-3">
                      {step.title}
                    </h4>
                    <p className="text-dafel-slate-600 text-pretty">
                      {step.description}
                    </p>
                  </Card>

                  {/* Arrow (except for last item) */}
                  {index < dataFlow.length - 1 && (
                    <motion.div
                      animate={{ x: [0, 10, 0] }}
                      transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, delay: index * 0.5 }}
                      className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2 text-dafel-blue-400"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                      </svg>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Key Numbers */}
        <motion.div
          {...scrollFadeIn}
          className="mb-20"
        >
          <div className="bg-white rounded-2xl p-8 shadow-large border border-dafel-slate-100">
            <h3 className="text-xl font-bold text-center text-dafel-slate-900 mb-8">
              Números que Respaldan Nuestra Metodología
            </h3>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {keyNumbers.map((number, index) => {
                const IconComponent = number.icon;
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="text-center p-4 rounded-xl bg-sand-50 hover:bg-dafel-blue-50 transition-colors"
                  >
                    <div className="w-12 h-12 bg-dafel-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <IconComponent className="w-6 h-6 text-dafel-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-dafel-blue-600 mb-1">
                      {number.value}
                    </div>
                    <div className="text-sm font-semibold text-dafel-slate-900 mb-1">
                      {number.label}
                    </div>
                    <div className="text-xs text-dafel-slate-600">
                      {number.description}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Advantages Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="mb-16"
        >
          <motion.h3
            variants={staggerItem}
            className="text-xl font-bold text-center text-dafel-slate-900 mb-12"
          >
            Beneficios Transformacionales por Área
          </motion.h3>

          <div className="grid lg:grid-cols-3 gap-8">
            {advantages.map((advantage, index) => {
              const IconComponent = advantage.icon;
              
              return (
                <motion.div
                  key={index}
                  variants={staggerItem}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card variant="elevated" className="h-full p-8 card-hover">
                    {/* Header */}
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-dafel-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      
                      <h4 className="text-lg font-bold text-dafel-slate-900 mb-1">
                        {advantage.title}
                      </h4>
                      <p className="text-dafel-blue-600 font-medium text-sm">
                        {advantage.subtitle}
                      </p>
                    </div>

                    {/* Benefits */}
                    <ul className="space-y-3 mb-6">
                      {advantage.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-start gap-3 text-sm">
                          <div className="w-2 h-2 bg-dafel-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-dafel-slate-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Highlight */}
                    <div className="bg-dafel-blue-50 rounded-lg p-3 text-center">
                      <p className="text-dafel-blue-700 text-sm font-semibold">
                        {advantage.highlight}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Bottom Quote */}
        <motion.div
          {...scrollFadeIn}
          className="text-center bg-gradient-to-r from-dafel-slate-900 to-dafel-blue-900 rounded-2xl p-12 text-white"
        >
          <div className="max-w-4xl mx-auto">
            <div className="text-6xl text-dafel-blue-400 mb-6">"</div>
            <blockquote className="text-2xl font-medium mb-6 italic">
              La consultoría que convierte tu pasado actuarial en tu futuro estratégico. 
              Donde 15 años de reportes se transforman en ventaja competitiva insuperable.
            </blockquote>
            <cite className="text-dafel-blue-300 font-semibold">
              — Filosofía Dafel Technologies
            </cite>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}