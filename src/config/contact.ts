import { EMAILJS_CONFIG } from './emailjs-credentials';

// Configuración de contacto y formularios
export const CONTACT_CONFIG = {
  // Email principal para recibir formularios
  email: 'davidfernando@dafel.com.mx',
  
  // Configuración de Netlify Forms (deshabilitada para Cloudflare Pages)
  netlifyForms: {
    enabled: false,
    formName: 'contact'
  },
  
  // Configuración de Formspree (alternativa futura)
  formspree: {
    enabled: false,
    endpoint: '' // Se puede configurar más adelante
  },
  
  // Configuración de EmailJS - ⚠️ REQUIERE CONFIGURACIÓN REAL
  emailjs: {
    enabled: false, // Disabled hasta obtener credenciales reales
    serviceId: 'YOUR_SERVICE_ID', // Obtener de emailjs.com
    templateId: 'YOUR_TEMPLATE_ID', // Obtener de emailjs.com
    publicKey: 'YOUR_PUBLIC_KEY' // Obtener de emailjs.com
  }
};

// Función helper para generar el mailto
export const generateMailto = (
  subject: string,
  body: string,
  email: string = CONTACT_CONFIG.email
): string => {
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  return `mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`;
};

// Función para detectar si estamos en un entorno que soporta Netlify Forms
export const isNetlifyEnvironment = (): boolean => {
  if (typeof window === 'undefined') return false;
  return (
    window.location.hostname.includes('netlify') ||
    window.location.hostname.includes('pages.dev') ||
    window.location.hostname.includes('dafel.com.mx')
  );
};