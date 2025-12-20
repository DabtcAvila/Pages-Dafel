'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { 
  SparklesIcon,
  CheckCircleIcon,
  ClockIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  DocumentChartBarIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { Container, Card, Button, Input } from '@/components/ui';
import { scrollFadeIn, staggerContainer, staggerItem } from '@/lib/animations';

// Form validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  company: z.string().min(2, 'Empresa requerida'),
  phone: z.string().regex(/^[0-9+\s\-()]{10,15}$/, 'Teléfono inválido'),
  yearsOfReports: z.enum(['3-5', '6-10', '10+'], {
    errorMap: () => ({ message: 'Selecciona años de reportes' })
  }),
  currentChallenge: z.string().min(10, 'Describe tu desafío (mínimo 10 caracteres)')
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('¡Solicitud enviada! Te contactaremos en menos de 24 horas.', {
        duration: 5000,
        position: 'top-center'
      });
      
      reset();
    } catch (error) {
      toast.error('Error al enviar. Por favor intenta nuevamente.', {
        duration: 4000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const analysisIncludes = [
    {
      icon: DocumentChartBarIcon,
      title: "Identificación de 5 oportunidades ocultas",
      description: "En tu histórico específico"
    },
    {
      icon: CurrencyDollarIcon,
      title: "Estimado de potencial de ahorro fiscal",
      description: "Específico de tu empresa"
    },
    {
      icon: SparklesIcon,
      title: "Proyección predictiva gratuita para 2025",
      description: "Basada en tus patrones únicos"
    },
    {
      icon: CheckCircleIcon,
      title: "Roadmap personalizado",
      description: "Para maximizar tu ventaja histórica"
    }
  ];

  const eliminators = [
    { icon: CheckCircleIcon, text: "Sin compromiso de compra" },
    { icon: ShieldCheckIcon, text: "Confidencialidad total garantizada" },
    { icon: ClockIcon, text: "Análisis en 48 horas" },
    { icon: PhoneIcon, text: "Consulta telefónica incluida" }
  ];

  return (
    <section className="section-padding bg-dafel-blue-900 text-white" id="contact">
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
            className="inline-flex items-center px-4 py-2 rounded-full bg-dafel-orange-500/20 text-dafel-orange-300 text-sm font-medium mb-6"
          >
            <SparklesIcon className="w-4 h-4 mr-2" />
            Análisis gratuito disponible
          </motion.div>

          <motion.h2
            variants={staggerItem}
            className="heading-section text-white text-balance mb-6"
          >
            Transforma tu{' '}
            <span className="text-dafel-orange-400">Histórico Actuarial</span>{' '}
            en Ventaja Estratégica Hoy
          </motion.h2>

          <motion.p
            variants={staggerItem}
            className="text-lead text-blue-100 text-balance max-w-4xl mx-auto"
          >
            <strong className="text-white">ANÁLISIS GRATUITO DE TU HISTÓRICO</strong>
            <br />
            Envíanos tus últimos 3 reportes actuariales. En 48 horas recibes un análisis 
            completo que identifica oportunidades específicas en tu empresa.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Form */}
          <motion.div
            {...scrollFadeIn}
          >
            <Card className="p-8 bg-white text-dafel-slate-900">
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-4">
                  Solicita tu Análisis Histórico Gratuito
                </h3>
                <div className="bg-dafel-orange-50 border border-dafel-orange-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 text-dafel-orange-700 mb-2">
                    <ClockIcon className="w-5 h-5" />
                    <span className="font-semibold">Análisis limitado</span>
                  </div>
                  <p className="text-dafel-orange-600 text-sm">
                    Solo procesamos <strong>15 análisis por mes</strong> para garantizar 
                    calidad personalizada. Asegura tu lugar hoy.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    label="Nombre completo *"
                    {...register('name')}
                    error={errors.name?.message}
                    placeholder="Tu nombre"
                  />
                  
                  <Input
                    label="Email corporativo *"
                    type="email"
                    {...register('email')}
                    error={errors.email?.message}
                    placeholder="tu@empresa.com"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    label="Empresa *"
                    {...register('company')}
                    error={errors.company?.message}
                    placeholder="Nombre de tu empresa"
                  />
                  
                  <Input
                    label="Teléfono *"
                    type="tel"
                    {...register('phone')}
                    error={errors.phone?.message}
                    placeholder="+52 55 1234 5678"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dafel-slate-700 mb-2">
                    Años de reportes actuariales disponibles *
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['3-5', '6-10', '10+'].map((option) => (
                      <label key={option} className="relative">
                        <input
                          type="radio"
                          value={option}
                          {...register('yearsOfReports')}
                          className="sr-only peer"
                        />
                        <div className="p-3 border border-dafel-slate-300 rounded-lg cursor-pointer text-center text-sm font-medium transition-all peer-checked:border-dafel-blue-500 peer-checked:bg-dafel-blue-50 peer-checked:text-dafel-blue-700 hover:border-dafel-blue-300">
                          {option} años
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.yearsOfReports && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.yearsOfReports.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-dafel-slate-700 mb-2">
                    Desafío principal actual con reportes actuariales *
                  </label>
                  <textarea
                    {...register('currentChallenge')}
                    rows={4}
                    className="w-full px-4 py-3 border border-dafel-slate-300 rounded-lg focus:ring-2 focus:ring-dafel-blue-500 focus:border-dafel-blue-500 resize-none"
                    placeholder="Describe tu situación actual: ¿Dónde están tus reportes? ¿Qué información necesitas extraer? ¿Cuál es tu mayor frustración?"
                  />
                  {errors.currentChallenge && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.currentChallenge.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  size="xl"
                  loading={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? 'Enviando...' : 'Analizar Mi Histórico Ahora'}
                </Button>

                <p className="text-xs text-dafel-slate-500 text-center">
                  Al enviar este formulario, aceptas ser contactado por un consultor actuarial 
                  certificado de Dafel Technologies para discutir tu análisis gratuito.
                </p>
              </form>
            </Card>
          </motion.div>

          {/* Benefits & Info */}
          <div className="space-y-8">
            {/* What's Included */}
            <motion.div
              {...scrollFadeIn}
            >
              <Card className="p-8 bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <h4 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <SparklesIcon className="w-6 h-6 text-dafel-orange-400" />
                  Tu análisis gratuito incluye:
                </h4>
                
                <div className="space-y-4">
                  {analysisIncludes.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="flex items-start gap-4"
                      >
                        <div className="w-10 h-10 bg-dafel-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h5 className="font-semibold mb-1">{item.title}</h5>
                          <p className="text-blue-200 text-sm">{item.description}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </Card>
            </motion.div>

            {/* Eliminators */}
            <motion.div
              {...scrollFadeIn}
            >
              <div className="grid grid-cols-2 gap-3">
                {eliminators.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm bg-white/10 rounded-lg p-3 backdrop-blur-sm"
                    >
                      <IconComponent className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-blue-100">{item.text}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              {...scrollFadeIn}
            >
              <Card className="p-6 bg-dafel-slate-800 border-dafel-slate-700">
                <h4 className="text-lg font-bold text-white mb-4">
                  ¿Prefieres hablar directamente?
                </h4>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-blue-200">
                    <PhoneIcon className="w-5 h-5 text-dafel-orange-400" />
                    <div>
                      <div className="font-semibold text-white">+52 55 1234 5678</div>
                      <div className="text-sm">Lun-Vie 9:00 AM - 6:00 PM</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-blue-200">
                    <EnvelopeIcon className="w-5 h-5 text-dafel-orange-400" />
                    <div>
                      <div className="font-semibold text-white">historico@dafel.com.mx</div>
                      <div className="text-sm">Análisis históricos especializados</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-blue-200">
                    <MapPinIcon className="w-5 h-5 text-dafel-orange-400" />
                    <div>
                      <div className="font-semibold text-white">Ciudad de México</div>
                      <div className="text-sm">Consultoría presencial disponible</div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Bottom Assurance */}
        <motion.div
          {...scrollFadeIn}
          className="mt-16 text-center"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h4 className="text-xl font-bold text-white mb-4">
              🔒 Compromiso de Confidencialidad Total
            </h4>
            <p className="text-blue-200 max-w-3xl mx-auto">
              Entendemos que tus reportes actuariales contienen información sensible. 
              Todos nuestros análisis se realizan bajo estrictos acuerdos de confidencialidad. 
              Tu información nunca se comparte y se elimina de nuestros sistemas tras 
              entregar tu análisis, a menos que decidas continuar con nuestros servicios.
            </p>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}