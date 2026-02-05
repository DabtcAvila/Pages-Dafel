import emailjs from '@emailjs/browser';
import { CONTACT_CONFIG } from '@/config/contact';
import { validateEmailJSConfig } from '@/config/emailjs-credentials';

// Inicializar EmailJS con validación
export const initEmailJS = () => {
  if (validateEmailJSConfig()) {
    emailjs.init(CONTACT_CONFIG.emailjs.publicKey);
    console.log('📧 EmailJS initialized successfully');
  } else {
    console.warn('⚠️ EmailJS initialization failed, using mailto fallback');
  }
};

// Interface para los datos del formulario
export interface ContactFormData {
  firstName: string;
  lastName: string;
  company: string;
  quotationRecipient: string;
  approximateEmployees: string;
  state: string;
  email: string;
  phone: string;
  accountingStandards: string[];
  benefits: string[];
  privacyAccepted: boolean;
}

// Enviar email via EmailJS
export const sendContactEmail = async (formData: ContactFormData): Promise<boolean> => {
  try {
    // Verificar si EmailJS está configurado correctamente
    if (!CONTACT_CONFIG.emailjs.enabled || !validateEmailJSConfig()) {
      console.log('EmailJS no configurado o credenciales inválidas, usando mailto fallback');
      return false;
    }

    // Preparar datos para el template EmailJS
    const templateParams = {
      // Información del destinatario
      to_email: CONTACT_CONFIG.email,
      
      // Información del remitente
      client_name: `${formData.firstName} ${formData.lastName}`,
      client_email: formData.email,
      client_phone: formData.phone,
      
      // Información de la empresa
      company_name: formData.company,
      quotation_recipient: formData.quotationRecipient,
      employee_count: formData.approximateEmployees,
      company_state: formData.state,
      
      // Servicios solicitados
      accounting_standards: formData.accountingStandards.join(', '),
      benefits_requested: formData.benefits.join(', '),
      
      // Mensaje completo estructurado
      full_message: `
🏢 NUEVA SOLICITUD DE COTIZACIÓN - VALUACIÓN ACTUARIAL

📋 NORMAS CONTABLES SOLICITADAS:
${formData.accountingStandards.map(std => `• ${std}`).join('\n')}

👤 INFORMACIÓN DEL CLIENTE:
• Nombre: ${formData.firstName} ${formData.lastName}
• Empresa: ${formData.company}
• Destinatario cotización: ${formData.quotationRecipient}

🏭 INFORMACIÓN DE LA EMPRESA:
• Empleados aproximados: ${formData.approximateEmployees}
• Estado: ${formData.state}

📞 DATOS DE CONTACTO:
• Email: ${formData.email}
• Teléfono: ${formData.phone}

💼 BENEFICIOS A EVALUAR:
${formData.benefits.map(benefit => `• ${benefit}`).join('\n')}

---
✅ Solicitud generada automáticamente desde dafel.com.mx
🕐 ${new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}
      `.trim(),
      
      // Subject personalizado
      email_subject: `🔔 Nueva Cotización: ${formData.company} - ${formData.accountingStandards.join(', ')}`,
      
      // Timestamp para tracking
      timestamp: new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })
    };

    // Enviar email
    const response = await emailjs.send(
      CONTACT_CONFIG.emailjs.serviceId,
      CONTACT_CONFIG.emailjs.templateId,
      templateParams
    );

    console.log('✅ Email enviado exitosamente via EmailJS:', {
      status: response.status,
      text: response.text,
      company: formData.company,
      timestamp: new Date().toISOString()
    });
    return true;

  } catch (error) {
    console.error('❌ Error enviando email via EmailJS:', {
      error,
      company: formData.company,
      email: formData.email,
      timestamp: new Date().toISOString()
    });
    return false;
  }
};

// Función de fallback para mailto
export const sendMailtoFallback = (formData: ContactFormData): void => {
  const subject = `Cotización Valuación Actuarial - ${formData.company}`;
  const body = `
SOLICITUD DE COTIZACIÓN - VALUACIÓN ACTUARIAL

NORMAS CONTABLES:
${formData.accountingStandards.join(', ')}

INFORMACIÓN PERSONAL:
Nombre: ${formData.firstName} ${formData.lastName}
Empresa: ${formData.company}
Destinatario cotización: ${formData.quotationRecipient}

INFORMACIÓN EMPRESA:
Empleados aproximados: ${formData.approximateEmployees}
Estado: ${formData.state}

CONTACTO:
Email: ${formData.email}
Teléfono: ${formData.phone}

BENEFICIOS A EVALUAR:
${formData.benefits.join(', ')}

---
Solicitud generada desde dafel.com.mx
  `.trim();

  const mailtoUrl = `mailto:${CONTACT_CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailtoUrl;
};