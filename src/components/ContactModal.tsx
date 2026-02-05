'use client';

import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '@/contexts/LanguageContext';

interface ContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ValidationMessages = {
  contactModal: {
    validation: {
      nameRequired: string;
      emailRequired: string;
      emailInvalid: string;
      companyRequired: string;
    };
  };
};

const createContactSchema = (messages: ValidationMessages) => z.object({
  // Campos de normas contables
  accountingStandards: z.array(z.string()).min(1, "Seleccione al menos una norma contable"),

  // Información personal
  firstName: z.string().min(1, "Nombre es requerido"),
  lastName: z.string().min(1, "Apellido es requerido"),
  company: z.string().min(1, "Empresa es requerida"),
  quotationRecipient: z.string().min(1, "Destinatario de la cotización es requerido"),

  // Información de la empresa
  approximateEmployees: z.string().min(1, "Número de empleados es requerido"),
  state: z.string().min(1, "Estado es requerido"),

  // Contacto
  email: z.string()
    .min(1, "Email es requerido")
    .email("Email inválido"),
  phone: z.string().min(1, "Teléfono es requerido"),

  // Beneficios a evaluar
  benefits: z.array(z.string()).min(1, "Seleccione al menos un beneficio"),

  // Privacidad
  privacyAccepted: z.boolean().refine(val => val === true, {
    message: "Debe aceptar el aviso de privacidad"
  })
});

type ContactFormData = z.infer<ReturnType<typeof createContactSchema>>;

export default function ContactModal({ open, onOpenChange }: ContactModalProps) {
  const { messages, locale } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const contactSchema = createContactSchema(messages as ValidationMessages);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      accountingStandards: [],
      firstName: '',
      lastName: '',
      company: '',
      quotationRecipient: '',
      approximateEmployees: '',
      state: '',
      email: '',
      phone: '',
      benefits: [],
      privacyAccepted: false
    }
  });

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      // Prevent iOS bounce scroll but allow modal scroll
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'unset';
    };
  }, [open]);

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log('Contact Form Data:', data);

    setIsSubmitting(false);
    setShowSuccess(true);

    // Close drawer after success message
    setTimeout(() => {
      setShowSuccess(false);
      reset();
      onOpenChange(false);
    }, 2500);
  };

  const breadcrumbText = 'COTIZACIÓN > VALUACIÓN ACTUARIAL';

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            {/* Overlay */}
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              />
            </Dialog.Overlay>

            {/* Drawer Panel */}
            <Dialog.Content asChild>
              <motion.div
                className="fixed right-0 top-0 h-screen max-h-screen w-full sm:w-[480px] bg-white shadow-2xl z-50 focus:outline-none"
                style={{
                  height: '100vh',
                  maxHeight: '100vh',
                  overflowY: 'hidden'
                }}
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{
                  type: 'spring',
                  damping: 30,
                  stiffness: 300,
                  duration: 0.3
                }}
              >
                <div className="h-full flex flex-col max-h-screen">
                  {/* Fixed Header */}
                  <div className="flex-shrink-0 border-b border-gray-100">
                    <div className="px-8 py-6">
                      {/* Close button */}
                      <Dialog.Close asChild>
                        <button
                          className="absolute right-6 top-6 rounded-md p-2 text-gray-400 transition-all hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                          aria-label="Close"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </Dialog.Close>

                      {/* Breadcrumb */}
                      <div className="mb-4">
                        <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                          {breadcrumbText}
                        </span>
                      </div>

                      {/* Title and Subtitle */}
                      <div>
                        <Dialog.Title className="text-3xl font-bold text-gray-900 mb-2">
                          Cotiza tu valuación bajo NIF D-3, IFRS-19 y/o USGAAP
                        </Dialog.Title>
                        <Dialog.Description className="text-base text-gray-500">
                          Completa los datos para recibir tu cotización
                        </Dialog.Description>
                      </div>
                    </div>
                  </div>

                  {/* Scrollable Content */}
                  <div className="flex-1 overflow-y-auto overscroll-contain">
                    <div className="px-4 sm:px-8 py-6 sm:py-8 pb-24 sm:pb-8 min-h-0">
                      {/* Success Message */}
                      <AnimatePresence>
                        {showSuccess && (
                          <motion.div
                            initial={{ opacity: 0, y: -10, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: -10, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mb-6 overflow-hidden"
                          >
                            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                              <p className="text-green-800 text-sm font-medium">
                                ¡Solicitud enviada exitosamente! Recibirá su cotización en las próximas 24 horas.
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Form */}
                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Normas Contables */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-3">
                            Bajo qué norma(s) contable(s) desea cotizar: *
                          </label>
                          <div className="space-y-2">
                            {['NIF D-3', 'IFRS-19', 'USGAAP'].map((standard) => (
                              <label key={standard} className="flex items-center">
                                <input
                                  {...register('accountingStandards')}
                                  type="checkbox"
                                  value={standard}
                                  className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300 rounded"
                                  disabled={isSubmitting}
                                />
                                <span className="ml-2 text-gray-900">{standard}</span>
                              </label>
                            ))}
                          </div>
                          {errors.accountingStandards && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="mt-2 text-xs text-red-600"
                            >
                              {errors.accountingStandards.message}
                            </motion.p>
                          )}
                        </div>

                        {/* Nombre y Apellido */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="firstName" className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
                              Nombre *
                            </label>
                            <input
                              {...register('firstName')}
                              type="text"
                              id="firstName"
                              className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                              placeholder="Juan"
                              disabled={isSubmitting}
                            />
                            {errors.firstName && (
                              <motion.p
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-2 text-xs text-red-600"
                              >
                                {errors.firstName.message}
                              </motion.p>
                            )}
                          </div>

                          <div>
                            <label htmlFor="lastName" className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
                              Apellido *
                            </label>
                            <input
                              {...register('lastName')}
                              type="text"
                              id="lastName"
                              className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                              placeholder="Pérez"
                              disabled={isSubmitting}
                            />
                            {errors.lastName && (
                              <motion.p
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-2 text-xs text-red-600"
                              >
                                {errors.lastName.message}
                              </motion.p>
                            )}
                          </div>
                        </div>

                        {/* Empresa */}
                        <div>
                          <label htmlFor="company" className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
                            Empresa o institución *
                          </label>
                          <input
                            {...register('company')}
                            type="text"
                            id="company"
                            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                            placeholder="Empresa S.A. de C.V."
                            disabled={isSubmitting}
                          />
                          {errors.company && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="mt-2 text-xs text-red-600"
                            >
                              {errors.company.message}
                            </motion.p>
                          )}
                        </div>

                        {/* Destinatario de la cotización */}
                        <div>
                          <label htmlFor="quotationRecipient" className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
                            ¿A quién va dirigida la cotización? *
                          </label>
                          <input
                            {...register('quotationRecipient')}
                            type="text"
                            id="quotationRecipient"
                            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                            placeholder="Director de Finanzas, CFO, etc."
                            disabled={isSubmitting}
                          />
                          {errors.quotationRecipient && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="mt-2 text-xs text-red-600"
                            >
                              {errors.quotationRecipient.message}
                            </motion.p>
                          )}
                        </div>

                        {/* Número de empleados */}
                        <div>
                          <label htmlFor="approximateEmployees" className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
                            No. de empleados aproximados *
                          </label>
                          <select
                            {...register('approximateEmployees')}
                            id="approximateEmployees"
                            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all appearance-none bg-white text-gray-900"
                            disabled={isSubmitting}
                          >
                            <option value="">Seleccione...</option>
                            <option value="1-10">1-10 empleados</option>
                            <option value="11-50">11-50 empleados</option>
                            <option value="51-100">51-100 empleados</option>
                            <option value="101-500">101-500 empleados</option>
                            <option value="501-1000">501-1000 empleados</option>
                            <option value="1000+">Más de 1000 empleados</option>
                          </select>
                          {errors.approximateEmployees && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="mt-2 text-xs text-red-600"
                            >
                              {errors.approximateEmployees.message}
                            </motion.p>
                          )}
                        </div>

                        {/* Beneficios a evaluar */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-3">
                            ¿Qué beneficios desea evaluar? *
                          </label>
                          <div className="space-y-2">
                            {[
                              'Prima de antigüedad',
                              'Indemnización por despido',
                              'Plan de pensiones existente',
                              'Otros beneficios superiores a la LFT',
                              'Diseño de un nuevo Plan de Pensiones'
                            ].map((benefit) => (
                              <label key={benefit} className="flex items-center">
                                <input
                                  {...register('benefits')}
                                  type="checkbox"
                                  value={benefit}
                                  className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300 rounded"
                                  disabled={isSubmitting}
                                />
                                <span className="ml-2 text-gray-900">{benefit}</span>
                              </label>
                            ))}
                          </div>
                          {errors.benefits && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="mt-2 text-xs text-red-600"
                            >
                              {errors.benefits.message}
                            </motion.p>
                          )}
                        </div>

                        {/* Estado */}
                        <div>
                          <label htmlFor="state" className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
                            Estado *
                          </label>
                          <select
                            {...register('state')}
                            id="state"
                            className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all appearance-none bg-white text-gray-900"
                            disabled={isSubmitting}
                          >
                            <option value="">Seleccione su estado...</option>
                            <option value="Aguascalientes">Aguascalientes</option>
                            <option value="Baja California">Baja California</option>
                            <option value="Baja California Sur">Baja California Sur</option>
                            <option value="Campeche">Campeche</option>
                            <option value="Chiapas">Chiapas</option>
                            <option value="Chihuahua">Chihuahua</option>
                            <option value="Ciudad de México">Ciudad de México</option>
                            <option value="Coahuila">Coahuila</option>
                            <option value="Colima">Colima</option>
                            <option value="Durango">Durango</option>
                            <option value="Estado de México">Estado de México</option>
                            <option value="Guanajuato">Guanajuato</option>
                            <option value="Guerrero">Guerrero</option>
                            <option value="Hidalgo">Hidalgo</option>
                            <option value="Jalisco">Jalisco</option>
                            <option value="Michoacán">Michoacán</option>
                            <option value="Morelos">Morelos</option>
                            <option value="Nayarit">Nayarit</option>
                            <option value="Nuevo León">Nuevo León</option>
                            <option value="Oaxaca">Oaxaca</option>
                            <option value="Puebla">Puebla</option>
                            <option value="Querétaro">Querétaro</option>
                            <option value="Quintana Roo">Quintana Roo</option>
                            <option value="San Luis Potosí">San Luis Potosí</option>
                            <option value="Sinaloa">Sinaloa</option>
                            <option value="Sonora">Sonora</option>
                            <option value="Tabasco">Tabasco</option>
                            <option value="Tamaulipas">Tamaulipas</option>
                            <option value="Tlaxcala">Tlaxcala</option>
                            <option value="Veracruz">Veracruz</option>
                            <option value="Yucatán">Yucatán</option>
                            <option value="Zacatecas">Zacatecas</option>
                          </select>
                          {errors.state && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="mt-2 text-xs text-red-600"
                            >
                              {errors.state.message}
                            </motion.p>
                          )}
                        </div>

                        {/* Email y Teléfono */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="email" className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
                              E-mail *
                            </label>
                            <input
                              {...register('email')}
                              type="email"
                              id="email"
                              className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                              placeholder="correo@empresa.com"
                              disabled={isSubmitting}
                            />
                            {errors.email && (
                              <motion.p
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-2 text-xs text-red-600"
                              >
                                {errors.email.message}
                              </motion.p>
                            )}
                          </div>

                          <div>
                            <label htmlFor="phone" className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
                              Teléfono *
                            </label>
                            <input
                              {...register('phone')}
                              type="tel"
                              id="phone"
                              className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                              placeholder="55 1234 5678"
                              disabled={isSubmitting}
                            />
                            {errors.phone && (
                              <motion.p
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-2 text-xs text-red-600"
                              >
                                {errors.phone.message}
                              </motion.p>
                            )}
                          </div>
                        </div>

                        {/* Aviso de Privacidad */}
                        <div>
                          <label className="flex items-start">
                            <input
                              {...register('privacyAccepted')}
                              type="checkbox"
                              className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300 rounded mt-1"
                              disabled={isSubmitting}
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              He leído y estoy de acuerdo con el <a href="#" className="text-gray-900 underline hover:text-gray-600">Aviso de privacidad</a> *
                            </span>
                          </label>
                          {errors.privacyAccepted && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="mt-2 text-xs text-red-600"
                            >
                              {errors.privacyAccepted.message}
                            </motion.p>
                          )}
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6 sm:pt-4 mt-4 sm:mt-0">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full px-6 py-4 sm:py-4 text-base sm:text-sm font-semibold sm:font-medium text-white bg-gray-900 rounded-lg sm:rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.98] touch-manipulation"
                            style={{ minHeight: '52px' }}
                          >
                            {isSubmitting ? (
                              <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Enviando solicitud...
                              </span>
                            ) : (
                              'Solicitar Cotización'
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}