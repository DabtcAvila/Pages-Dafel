'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { CONTACT_CONFIG } from '@/config/contact';
import { initEmailJS, sendContactEmail, sendMailtoFallback, type ContactFormData } from '@/services/emailService';
import { sendViaCloudflareWorker, checkWorkerHealth, getEnvironmentInfo } from '@/services/cloudflareWorkerService';

interface ContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ContactModalOptimized({ open, onOpenChange }: ContactModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Inicializar servicios cuando el componente se monta
  useEffect(() => {
    // Log environment info
    const envInfo = getEnvironmentInfo();
    console.log('🌐 Environment Info:', envInfo);

    // Verificar Cloudflare Worker
    checkWorkerHealth().then(isHealthy => {
      console.log('🔧 Cloudflare Worker health:', isHealthy ? '✅ OK' : '❌ Failed');
    });

    // Inicializar EmailJS como fallback
    if (CONTACT_CONFIG.emailjs.enabled) {
      initEmailJS();
    }
  }, []);

  // Submit usando Cloudflare Workers → EmailJS → mailto (cascada de fallbacks)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    
    // Extraer datos del formulario
    const quotationRecipientName = formData.get('quotationRecipientName') as string;
    const quotationRecipientPosition = formData.get('quotationRecipientPosition') as string;
    const quotationRecipient = `${quotationRecipientName} - ${quotationRecipientPosition}`.trim();

    const contactData: ContactFormData = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      company: formData.get('company') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      quotationRecipient: quotationRecipient,
      approximateEmployees: formData.get('approximateEmployees') as string,
      state: formData.get('state') as string,
      accountingStandards: formData.getAll('accountingStandards[]') as string[],
      benefits: formData.getAll('benefits[]') as string[],
      privacyAccepted: formData.get('privacyAccepted') === 'on'
    };

    let emailSent = false;
    let successMessage = 'Cotización enviada exitosamente';

    try {
      // 🥇 OPCIÓN 1: Cloudflare Workers (Profesional)
      console.log('🚀 Intentando envío via Cloudflare Workers...');
      const workerResult = await sendViaCloudflareWorker(contactData);
      
      if (workerResult.success) {
        console.log('✅ Enviado exitosamente via Cloudflare Workers');
        emailSent = true;
        successMessage = workerResult.message;
      }
    } catch (workerError) {
      console.warn('⚠️ Cloudflare Worker falló, probando EmailJS...', workerError);

      // 🥈 OPCIÓN 2: EmailJS (Backup)
      if (CONTACT_CONFIG.emailjs.enabled) {
        try {
          console.log('📧 Intentando envío via EmailJS...');
          emailSent = await sendContactEmail(contactData);
          
          if (emailSent) {
            console.log('✅ Enviado exitosamente via EmailJS');
            successMessage = 'Cotización enviada exitosamente (via EmailJS)';
          }
        } catch (emailjsError) {
          console.warn('⚠️ EmailJS también falló, usando mailto...', emailjsError);
        }
      }
    }

    // 🥉 OPCIÓN 3: Mailto (Último recurso)
    if (!emailSent) {
      console.log('📮 Usando mailto como último recurso...');
      sendMailtoFallback(contactData);
      successMessage = 'Se abrió tu cliente de correo para completar el envío';
    }
    
    // Mostrar mensaje de éxito
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onOpenChange(false);
      formRef.current?.reset();
    }, 3000);
    
    setIsSubmitting(false);
  };

  // Validación simple sin librerías pesadas
  const handleFormValidation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    // Campos requeridos
    const firstName = form.elements.namedItem('firstName') as HTMLInputElement;
    const lastName = form.elements.namedItem('lastName') as HTMLInputElement;
    const email = form.elements.namedItem('email') as HTMLInputElement;
    const company = form.elements.namedItem('company') as HTMLInputElement;
    const quotationRecipientName = form.elements.namedItem('quotationRecipientName') as HTMLInputElement;
    const quotationRecipientPosition = form.elements.namedItem('quotationRecipientPosition') as HTMLInputElement;
    const employees = form.elements.namedItem('approximateEmployees') as HTMLSelectElement;
    const state = form.elements.namedItem('state') as HTMLSelectElement;
    const phone = form.elements.namedItem('phone') as HTMLInputElement;
    const privacyAccepted = form.elements.namedItem('privacyAccepted') as HTMLInputElement;

    // Validar checkboxes
    const accountingStandards = form.querySelectorAll('input[name="accountingStandards[]"]:checked');
    const benefits = form.querySelectorAll('input[name="benefits[]"]:checked');

    let isValid = true;
    let errors: string[] = [];

    if (!firstName?.value.trim()) errors.push('Nombre es requerido');
    if (!lastName?.value.trim()) errors.push('Apellido es requerido');
    if (!email?.value.trim()) errors.push('Email es requerido');
    else if (!/\S+@\S+\.\S+/.test(email.value)) errors.push('Email inválido');
    if (!company?.value.trim()) errors.push('Empresa es requerida');
    if (!quotationRecipientName?.value.trim()) errors.push('Nombre del destinatario es requerido');
    if (!quotationRecipientPosition?.value.trim()) errors.push('Puesto del destinatario es requerido');
    if (!employees?.value.trim()) errors.push('Número de empleados es requerido');
    if (!state?.value.trim()) errors.push('Estado es requerido');
    if (!phone?.value.trim()) errors.push('Teléfono es requerido');
    if (accountingStandards.length === 0) errors.push('Seleccione al menos una norma contable');
    if (benefits.length === 0) errors.push('Seleccione al menos un beneficio');
    if (!privacyAccepted?.checked) errors.push('Debe aceptar el aviso de privacidad');

    if (errors.length > 0) {
      alert('Errores encontrados:\n' + errors.join('\n'));
      return;
    }

    handleSubmit(e);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => onOpenChange(false)}
            />

            {/* Modal */}
            <motion.div
              className="fixed right-0 top-0 h-screen w-full sm:w-[480px] bg-white shadow-2xl z-50"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <div className="h-full flex flex-col">
                {/* Header */}
                <div className="flex-shrink-0 border-b border-gray-100 px-6 py-6">
                  <button
                    onClick={() => onOpenChange(false)}
                    className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                  
                  <div className="mb-2">
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                      COTIZACIÓN > VALUACIÓN ACTUARIAL
                    </span>
                  </div>
                  
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Cotiza tu valuación bajo NIF D-3, IAS-19 y/o USGAAP
                  </h2>
                  <p className="text-gray-500">
                    Completa los datos para recibir tu cotización
                  </p>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  {/* Success Message */}
                  <AnimatePresence>
                    {showSuccess && (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg"
                      >
                        <p className="text-green-800 text-sm font-medium">
                          ¡Solicitud enviada exitosamente! Recibirá su cotización en las próximas 24 horas.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Form */}
                  <form 
                    ref={formRef}
                    onSubmit={handleFormValidation}
                    className="space-y-4"
                  >

                    {/* Normas Contables */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
                        Bajo qué norma(s) contable(s) desea cotizar: *
                      </label>
                      <div className="space-y-2">
                        {['NIF D-3', 'IAS-19', 'US GAAP'].map((standard) => (
                          <label key={standard} className="flex items-center">
                            <input
                              type="checkbox"
                              name="accountingStandards[]"
                              value={standard}
                              className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300 rounded"
                              disabled={isSubmitting}
                            />
                            <span className="ml-2 text-gray-900">{standard}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Nombre y Apellido */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1">
                          Nombre *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                          placeholder="Juan"
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1">
                          Apellido *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                          placeholder="Pérez"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    {/* Empresa */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1">
                        Empresa o institución *
                      </label>
                      <input
                        type="text"
                        name="company"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                        placeholder="Empresa S.A. de C.V."
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* Destinatario */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1">
                        ¿A quién va dirigida la cotización? *
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <input
                            type="text"
                            name="quotationRecipientName"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                            placeholder="Nombre completo"
                            disabled={isSubmitting}
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            name="quotationRecipientPosition"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                            placeholder="Puesto"
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Empleados */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1">
                        No. de empleados *
                      </label>
                      <select
                        name="approximateEmployees"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
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
                    </div>

                    {/* Beneficios */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
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
                              type="checkbox"
                              name="benefits[]"
                              value={benefit}
                              className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300 rounded"
                              disabled={isSubmitting}
                            />
                            <span className="ml-2 text-gray-900 text-sm">{benefit}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Estado */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1">
                        Estado *
                      </label>
                      <select
                        name="state"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
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
                    </div>

                    {/* Email y Teléfono */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1">
                          E-mail *
                        </label>
                        <input
                          type="email"
                          name="email"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                          placeholder="correo@empresa.com"
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1">
                          Teléfono *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                          placeholder="55 1234 5678"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    {/* Privacidad */}
                    <div>
                      <label className="flex items-start">
                        <input
                          type="checkbox"
                          name="privacyAccepted"
                          className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300 rounded mt-1"
                          disabled={isSubmitting}
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          He leído y estoy de acuerdo con el <a href="#" className="text-gray-900 underline hover:text-gray-600">Aviso de privacidad</a> *
                        </span>
                      </label>
                    </div>

                    {/* Submit */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 px-4 bg-gray-900 text-white font-medium rounded-md hover:bg-gray-800 focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
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
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}