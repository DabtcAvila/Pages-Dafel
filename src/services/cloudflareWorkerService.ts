/**
 * 🌐 CLOUDFLARE WORKER API CLIENT
 * 
 * Servicio para enviar formularios de contacto via Cloudflare Workers
 * Endpoint: /api/contact
 */

import type { ContactFormData } from './emailService';

// 🔧 Configuración del API
const API_CONFIG = {
  // Detectar endpoint automáticamente
  getEndpoint: () => {
    if (typeof window === 'undefined') return '';
    
    // En desarrollo: localhost
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:8787'; // Worker local
    }
    
    // En production: Worker deployado
    return 'https://dafel-contact-api.davidfernando.workers.dev';
  },

  // Headers por defecto
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },

  // Timeout para requests
  timeout: 10000 // 10 segundos
};

// 📤 Interfaz de respuesta del Worker
interface WorkerResponse {
  success?: boolean;
  message?: string;
  id?: string;
  error?: string;
  details?: string[];
}

// 🚀 Enviar formulario via Cloudflare Worker
export const sendViaCloudflareWorker = async (formData: ContactFormData): Promise<{
  success: boolean;
  message: string;
  id?: string;
}> => {
  try {
    const endpoint = API_CONFIG.getEndpoint();
    
    if (!endpoint) {
      throw new Error('No se pudo determinar el endpoint del API');
    }

    console.log('📤 Enviando formulario a Cloudflare Worker:', {
      endpoint,
      company: formData.company,
      email: formData.email
    });

    // Crear AbortController para timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

    // Preparar payload
    const payload = {
      ...formData,
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      source: 'dafel-contact-form'
    };

    // Hacer request al Worker
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: API_CONFIG.headers,
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    // Parsear respuesta
    let result: WorkerResponse;
    try {
      result = await response.json();
    } catch (parseError) {
      throw new Error(`Error parseando respuesta del servidor: ${response.status}`);
    }

    // Verificar si fue exitoso
    if (response.ok && result.success) {
      console.log('✅ Formulario enviado exitosamente via Worker:', {
        id: result.id,
        message: result.message,
        company: formData.company
      });

      return {
        success: true,
        message: result.message || 'Cotización enviada exitosamente',
        id: result.id
      };
    } else {
      console.error('❌ Error del Worker:', {
        status: response.status,
        error: result.error,
        details: result.details
      });

      throw new Error(result.error || `Error del servidor: ${response.status}`);
    }

  } catch (error: any) {
    console.error('💥 Error enviando via Cloudflare Worker:', {
      error: error.message,
      company: formData.company,
      email: formData.email
    });

    // Errores específicos
    if (error.name === 'AbortError') {
      throw new Error('Timeout: La solicitud tardó demasiado en responder');
    }

    if (error.message.includes('fetch')) {
      throw new Error('Error de conexión: Verifique su internet');
    }

    throw error;
  }
};

// 🔍 Verificar si Worker está disponible
export const checkWorkerHealth = async (): Promise<boolean> => {
  try {
    const endpoint = API_CONFIG.getEndpoint();
    if (!endpoint) return false;

    // Hacer OPTIONS request para verificar CORS
    const response = await fetch(endpoint, {
      method: 'OPTIONS',
      headers: { 'Content-Type': 'application/json' }
    });

    return response.ok;
  } catch (error) {
    console.warn('⚠️ Worker health check failed:', error);
    return false;
  }
};

// 📊 Detectar entorno
export const getEnvironmentInfo = () => {
  if (typeof window === 'undefined') {
    return { environment: 'server', endpoint: 'unknown' };
  }

  const hostname = window.location.hostname;
  const endpoint = API_CONFIG.getEndpoint();

  let environment: string;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    environment = 'development';
  } else if (hostname.includes('pages.dev')) {
    environment = 'staging';
  } else if (hostname.includes('dafel.com')) {
    environment = 'production';
  } else {
    environment = 'unknown';
  }

  return {
    environment,
    hostname,
    endpoint
  };
};