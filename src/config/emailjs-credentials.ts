// 🔒 CREDENCIALES EMAILJS CONFIGURADAS PARA DAFEL
// ✅ Estas credenciales están configuradas y listas para usar

export const EMAILJS_CONFIG = {
  // Servicio Gmail configurado para davidfernando@dafel.com.mx
  SERVICE_ID: 'service_mjdlgbs',
  
  // Template configurado para cotizaciones actuariales
  TEMPLATE_ID: 'template_x8vkq9f',
  
  // Clave pública para autenticación
  PUBLIC_KEY: 'RNNjxYdPmE-mhVJg7',
  
  // Rate limits y configuración
  RATE_LIMIT: 200, // emails por mes (plan gratuito)
  
  // Template variables configuradas en EmailJS:
  TEMPLATE_VARS: {
    to_email: '{{to_email}}',           // davidfernando@dafel.com.mx
    client_name: '{{client_name}}',     // Juan Pérez
    client_email: '{{client_email}}',   // juan@empresa.com
    company_name: '{{company_name}}',   // Empresa S.A.
    full_message: '{{full_message}}',   // Mensaje completo
    email_subject: '{{email_subject}}', // Subject personalizado
    timestamp: '{{timestamp}}'          // Fecha/hora
  }
};

// Validar que las credenciales están configuradas
export const validateEmailJSConfig = (): boolean => {
  const { SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY } = EMAILJS_CONFIG;
  
  if (SERVICE_ID.length < 10 || TEMPLATE_ID.length < 10 || PUBLIC_KEY.length < 10) {
    console.warn('⚠️ EmailJS credentials appear to be invalid');
    return false;
  }
  
  console.log('✅ EmailJS configured with service:', SERVICE_ID.substring(0, 8) + '...');
  return true;
};