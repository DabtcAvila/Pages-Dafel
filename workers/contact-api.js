/**
 * 📧 CLOUDFLARE WORKER - API DE CONTACTO DAFEL
 * 
 * Endpoint: https://pages-dafel.pages.dev/api/contact
 * Función: Recibir formularios y enviar emails a davidfernando@dafel.com.mx
 * 
 * Stack: Cloudflare Workers + Resend API
 */

// 🔧 CONFIGURACIÓN
const CONFIG = {
  // Email destinatario (debe coincidir con el registrado en Resend)
  TO_EMAIL: 'df.avila.diaz@gmail.com',
  
  // Resend API (servicio de envío de emails)
  RESEND_API_URL: 'https://api.resend.com/emails',
  
  // Headers CORS para tu dominio
  CORS_HEADERS: {
    'Access-Control-Allow-Origin': '*', // En producción: 'https://dafel.com.mx'
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  }
};

// 🎯 FUNCIÓN PRINCIPAL
export default {
  async fetch(request, env, ctx) {
    try {
      // Manejar preflight OPTIONS
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 200,
          headers: CONFIG.CORS_HEADERS
        });
      }

      // Solo aceptar POST
      if (request.method !== 'POST') {
        return new Response(
          JSON.stringify({ error: 'Método no permitido' }), 
          { status: 405, headers: CONFIG.CORS_HEADERS }
        );
      }

      // Validar Content-Type
      const contentType = request.headers.get('Content-Type');
      if (!contentType?.includes('application/json')) {
        return new Response(
          JSON.stringify({ error: 'Content-Type debe ser application/json' }),
          { status: 400, headers: CONFIG.CORS_HEADERS }
        );
      }

      // Extraer datos del formulario
      const formData = await request.json();
      
      // Validar datos requeridos
      const validation = validateFormData(formData);
      if (!validation.valid) {
        return new Response(
          JSON.stringify({ 
            error: 'Datos incompletos', 
            details: validation.errors 
          }),
          { status: 400, headers: CONFIG.CORS_HEADERS }
        );
      }

      // Enviar email
      const emailResult = await sendEmail(formData, env.RESEND_API_KEY);
      
      if (emailResult.success) {
        // Log exitoso
        console.log('📧 Email enviado exitosamente:', {
          company: formData.company,
          email: formData.email,
          timestamp: new Date().toISOString()
        });

        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'Cotización enviada exitosamente',
            id: emailResult.id 
          }),
          { status: 200, headers: CONFIG.CORS_HEADERS }
        );
      } else {
        // Log de error
        console.error('❌ Error enviando email:', emailResult.error);

        return new Response(
          JSON.stringify({ 
            error: 'Error interno del servidor',
            message: 'No se pudo enviar la cotización' 
          }),
          { status: 500, headers: CONFIG.CORS_HEADERS }
        );
      }

    } catch (error) {
      console.error('💥 Error inesperado:', error);
      
      return new Response(
        JSON.stringify({ 
          error: 'Error interno del servidor',
          message: 'Algo salió mal procesando tu solicitud' 
        }),
        { status: 500, headers: CONFIG.CORS_HEADERS }
      );
    }
  }
};

// 📝 VALIDACIÓN DE DATOS
function validateFormData(data) {
  const errors = [];
  
  // Campos requeridos
  const required = [
    'firstName', 'lastName', 'company', 'quotationRecipient',
    'approximateEmployees', 'state', 'email', 'phone'
  ];
  
  for (const field of required) {
    if (!data[field] || data[field].toString().trim() === '') {
      errors.push(`${field} es requerido`);
    }
  }
  
  // Validar email
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Email inválido');
  }
  
  // Validar arrays
  if (!data.accountingStandards || !Array.isArray(data.accountingStandards) || data.accountingStandards.length === 0) {
    errors.push('Debe seleccionar al menos una norma contable');
  }
  
  if (!data.benefits || !Array.isArray(data.benefits) || data.benefits.length === 0) {
    errors.push('Debe seleccionar al menos un beneficio');
  }
  
  // Validar privacidad
  if (!data.privacyAccepted) {
    errors.push('Debe aceptar el aviso de privacidad');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// 📧 ENVÍO DE EMAIL VIA RESEND
async function sendEmail(formData, resendApiKey) {
  try {
    if (!resendApiKey) {
      return { success: false, error: 'RESEND_API_KEY no configurada' };
    }

    // Preparar contenido del email
    const emailContent = generateEmailContent(formData);
    
    const emailPayload = {
      from: 'Dafel Sitio Web <onboarding@resend.dev>',
      to: [CONFIG.TO_EMAIL],
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text
    };

    // Enviar via Resend API
    const response = await fetch(CONFIG.RESEND_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailPayload)
    });

    const result = await response.json();

    if (response.ok) {
      return { success: true, id: result.id };
    } else {
      return { success: false, error: result.message || 'Error enviando email' };
    }

  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ✨ GENERAR CONTENIDO DEL EMAIL PROFESIONAL
function generateEmailContent(data) {
  const timestamp = new Date().toLocaleString('es-MX', { 
    timeZone: 'America/Mexico_City',
    year: 'numeric',
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const subject = `Nueva Solicitud de Cotización Actuarial - ${data.company}`;

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nueva Cotización Actuarial - Dafel Technologies</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          line-height: 1.6; 
          color: #2c3e50; 
          background-color: #f8f9fa;
        }
        
        .email-container { 
          max-width: 700px; 
          margin: 20px auto; 
          background: white; 
          border-radius: 12px; 
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        
        .header { 
          background: linear-gradient(135deg, #BDE5FF 0%, #ffffff 50%, #BDE5FF 100%); 
          color: #333333; 
          padding: 30px; 
          text-align: center;
        }
        
        .header h1 { 
          font-size: 28px; 
          font-weight: 700; 
          margin-bottom: 8px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .header p { 
          font-size: 16px; 
          opacity: 0.9;
          font-weight: 300;
        }
        
        .priority-badge {
          display: inline-block;
          background: #BDE5FF;
          color: #333333;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          margin-top: 12px;
          letter-spacing: 0.5px;
        }
        
        .content { 
          padding: 0;
        }
        
        .client-summary {
          background: #ffffff;
          padding: 25px;
          border-left: 4px solid #BDE5FF;
          margin: 0;
        }
        
        .client-summary h2 {
          color: #333333;
          font-size: 20px;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 15px;
        }
        
        .summary-item {
          background: white;
          padding: 15px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }
        
        .summary-label {
          font-size: 12px;
          text-transform: uppercase;
          color: #64748b;
          font-weight: 600;
          margin-bottom: 4px;
          letter-spacing: 0.5px;
        }
        
        .summary-value {
          font-size: 16px;
          font-weight: 600;
          color: #1e40af;
        }
        
        .section { 
          padding: 25px;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .section:last-child {
          border-bottom: none;
        }
        
        .section-title { 
          font-size: 18px;
          font-weight: 700; 
          color: #333333; 
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }
        
        .info-item {
          background: #f8fafc;
          padding: 16px;
          border-radius: 8px;
          border-left: 3px solid #3b82f6;
        }
        
        .info-label { 
          font-size: 12px;
          text-transform: uppercase;
          color: #64748b;
          font-weight: 600;
          margin-bottom: 4px;
          letter-spacing: 0.5px;
        }
        
        .info-value { 
          font-size: 15px;
          font-weight: 500;
          color: #1e40af;
        }
        
        .contact-links a {
          color: #3b82f6;
          text-decoration: none;
          font-weight: 500;
        }
        
        .contact-links a:hover {
          text-decoration: underline;
        }
        
        .standards-list, .benefits-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
          margin-top: 12px;
        }
        
        .list-item {
          background: white;
          padding: 12px 16px;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .list-item::before {
          content: "✓";
          background: #10b981;
          color: white;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
          flex-shrink: 0;
        }
        
        .cta-section {
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }
        
        .cta-button {
          display: inline-block;
          background: #BDE5FF;
          color: #333333;
          padding: 12px 30px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
          font-size: 16px;
          margin-top: 15px;
          transition: all 0.3s ease;
        }
        
        .footer { 
          background: #ffffff; 
          color: #333333; 
          padding: 20px; 
          text-align: center; 
          font-size: 13px;
          line-height: 1.8;
          border-top: 2px solid #BDE5FF;
        }
        
        .footer a {
          color: #333333;
          text-decoration: none;
          font-weight: bold;
        }
        
        .timestamp {
          background: #BDE5FF;
          color: #333333;
          padding: 8px 16px;
          border-radius: 4px;
          display: inline-block;
          margin-top: 10px;
          font-size: 12px;
        }
        
        @media (max-width: 600px) {
          .email-container { margin: 10px; }
          .summary-grid, .info-grid { grid-template-columns: 1fr; }
          .standards-list, .benefits-list { grid-template-columns: 1fr; }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <div style="margin-bottom: 20px;">
            <img src="https://cdn.jsdelivr.net/gh/davicho/Dafel-logos/logo-dafel.png" alt="Dafel Technologies" style="max-width: 200px; height: auto; display: block; margin: 0 auto;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
            <div style="display: none; background: rgba(51,51,51,0.1); padding: 12px 24px; border-radius: 8px; margin: 0 auto; width: fit-content;">
              <div style="font-family: 'Arial', sans-serif; font-size: 28px; font-weight: bold; color: #333333; text-align: center; letter-spacing: 2px;">
                DAFEL
              </div>
              <div style="font-family: 'Arial', sans-serif; font-size: 11px; color: #666666; text-align: center; margin-top: 2px; letter-spacing: 1px;">
                CONSULTING SERVICES
              </div>
            </div>
          </div>
          <h1>Nueva Solicitud de Cotización Actuarial</h1>
          <p>Consultoría Especializada en Valuación Actuarial</p>
          <div class="priority-badge">REQUIERE ATENCION</div>
        </div>
        
        <div class="content">
          <!-- Database Ready Data -->
          <div style="background: #ffffff; padding: 20px; margin: 20px 0; border: 2px solid #BDE5FF; font-family: 'Courier New', monospace; font-size: 12px; border-radius: 8px;">
            <div style="font-weight: bold; margin-bottom: 10px; color: #333333;">DATABASE READY - COPY/PASTE FORMAT:</div>
            <div style="background: #BDE5FF; padding: 10px; border: 1px solid #BDE5FF; border-radius: 4px; color: #333333;">
${data.firstName}|${data.lastName}|${data.email}|${data.phone}|${data.company}|${data.quotationRecipient}|${data.state}|${data.approximateEmployees}|${data.accountingStandards.join(';')}|${data.benefits.join(';')}|${timestamp}
            </div>
            <div style="font-size: 10px; color: #666666; margin-top: 5px;">
              Formato: firstName|lastName|email|phone|company|quotationRecipient|state|employees|standards|benefits|timestamp
            </div>
          </div>

          <!-- Resumen Ejecutivo -->
          <div class="client-summary">
            <h2>Resumen Ejecutivo</h2>
            <div class="summary-grid">
              <div class="summary-item">
                <div class="summary-label">Cliente</div>
                <div class="summary-value">${data.firstName} ${data.lastName}</div>
              </div>
              <div class="summary-item">
                <div class="summary-label">Empresa</div>
                <div class="summary-value">${data.company}</div>
              </div>
              <div class="summary-item">
                <div class="summary-label">Tamaño</div>
                <div class="summary-value">${data.approximateEmployees} empleados</div>
              </div>
              <div class="summary-item">
                <div class="summary-label">Ubicación</div>
                <div class="summary-value">${data.state}</div>
              </div>
            </div>
          </div>

          <!-- Normas Contables -->
          <div class="section">
            <div class="section-title">Normas Contables Requeridas</div>
            <div class="standards-list">
              ${data.accountingStandards.map(std => `
                <div class="list-item">${std}</div>
              `).join('')}
            </div>
          </div>

          <!-- Información del Cliente -->
          <div class="section">
            <div class="section-title">Información de Contacto</div>
            <div class="info-grid contact-links">
              <div class="info-item">
                <div class="info-label">Nombre Completo</div>
                <div class="info-value">${data.firstName} ${data.lastName}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Email</div>
                <div class="info-value"><a href="mailto:${data.email}">${data.email}</a></div>
              </div>
              <div class="info-item">
                <div class="info-label">Teléfono</div>
                <div class="info-value"><a href="tel:${data.phone}">${data.phone}</a></div>
              </div>
              <div class="info-item">
                <div class="info-label">Destinatario de Cotización</div>
                <div class="info-value">${data.quotationRecipient}</div>
              </div>
            </div>
          </div>

          <!-- Beneficios a Evaluar -->
          <div class="section">
            <div class="section-title">Beneficios a Evaluar</div>
            <div class="benefits-list">
              ${data.benefits.map(benefit => `
                <div class="list-item">${benefit}</div>
              `).join('')}
            </div>
          </div>

          <!-- CTA -->
          <div class="cta-section">
            <h3 style="margin-bottom: 10px;">Próximos Pasos</h3>
            <p>Revisa la solicitud y prepara la cotización personalizada</p>
            <a href="mailto:${data.email}?subject=Re: Cotización Actuarial - ${data.company}" class="cta-button">
              Responder al Cliente
            </a>
          </div>
        </div>

        <div class="footer">
          <strong>Dafel Technologies</strong><br>
          Consultoría Especializada en Valuación Actuarial<br>
          <a href="mailto:davidfernando@dafel.com.mx">davidfernando@dafel.com.mx</a> • 
          <a href="https://dafel.com.mx">dafel.com.mx</a>
          <div class="timestamp">
            Recibido: ${timestamp}
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
DATABASE READY - COPY/PASTE FORMAT:
${data.firstName}|${data.lastName}|${data.email}|${data.phone}|${data.company}|${data.quotationRecipient}|${data.state}|${data.approximateEmployees}|${data.accountingStandards.join(';')}|${data.benefits.join(';')}|${timestamp}

FORMAT: firstName|lastName|email|phone|company|quotationRecipient|state|employees|standards|benefits|timestamp

═══════════════════════════════════════════════════════════════
DAFEL TECHNOLOGIES - NUEVA SOLICITUD DE COTIZACION ACTUARIAL
═══════════════════════════════════════════════════════════════

RESUMEN EJECUTIVO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Empresa: ${data.company}
Tamaño: ${data.approximateEmployees} empleados
Ubicación: ${data.state}
Estado: PROSPECTO CALIENTE - REQUIERE SEGUIMIENTO INMEDIATO

INFORMACION DE CONTACTO PRINCIPAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Solicitante: ${data.firstName} ${data.lastName}
- Email corporativo: ${data.email}
- Teléfono directo: ${data.phone}
- Destinatario cotización: ${data.quotationRecipient}

MARCOS NORMATIVOS REQUERIDOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${data.accountingStandards.map((std, index) => `${index + 1}. ${std}`).join('\n')}

BENEFICIOS PARA VALUACION ACTUARIAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${data.benefits.map((benefit, index) => `${index + 1}. ${benefit}`).join('\n')}

ANALISIS DE OPORTUNIDAD COMERCIAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Complejidad del proyecto: ${data.accountingStandards.length > 2 ? 'ALTA' : data.accountingStandards.length > 1 ? 'MEDIA' : 'BASICA'}
- Número de normas solicitadas: ${data.accountingStandards.length}
- Beneficios a evaluar: ${data.benefits.length}
- Potencial de ingresos: ${data.approximateEmployees > 1000 ? 'ALTO' : data.approximateEmployees > 100 ? 'MEDIO' : 'BAJO'}

VENTAJAS COMPETITIVAS DAFEL PARA ${data.company.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Especialización en normativas mexicanas e internacionales
- Metodologías actuariales de última generación
- Cumplimiento 100% con marcos regulatorios
- Reportería ejecutiva automatizada
- Soporte técnico especializado 24/7
- Ahorro promedio del 35% vs. competencia

PLAN DE ACCION RECOMENDADO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Contacto telefónico en las próximas 24 horas
2. Análisis detallado de necesidades específicas
3. Elaboración de cotización personalizada
4. Presentación ejecutiva de propuesta
5. Cierre comercial y firma de contrato

═══════════════════════════════════════════════════════════════
Generado automáticamente desde: dafel.com.mx
Timestamp: ${timestamp}
Confidencial - Solo para uso interno DAFEL TECHNOLOGIES
═══════════════════════════════════════════════════════════════
  `.trim();

  return { subject, html, text };
}