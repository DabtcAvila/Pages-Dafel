import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Cookies | Dafel Technologies',
  description: 'Política de cookies de Dafel Technologies - Información sobre el uso de cookies y tecnologías similares en nuestro sitio web.',
}

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Política de Cookies</h1>
          <p className="mt-2 text-gray-600">Información sobre el uso de cookies en nuestro sitio web</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          
          {/* Qué son las cookies */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">¿Qué son las cookies?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita un sitio web. 
              Nos permiten reconocer su navegador y, si tiene una cuenta registrada, asociarla con ella.
            </p>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800 text-sm">
                <strong>Sitio web:</strong> dafel.com.mx<br/>
                <strong>Responsable:</strong> Dafel Consulting Services, S.C.<br/>
                <strong>Última actualización:</strong> {new Date().toLocaleDateString('es-MX', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </section>

          {/* Tipos de cookies */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Tipos de cookies que utilizamos</h2>
            <div className="space-y-4">
              
              {/* Cookies estrictamente necesarias */}
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-300">
                <h3 className="font-medium text-gray-900 mb-2">● Cookies estrictamente necesarias</h3>
                <p className="text-gray-700 text-sm mb-3">
                  Esenciales para el funcionamiento básico del sitio web. No pueden ser desactivadas.
                </p>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-300">
                        <th className="text-left py-2 font-medium text-gray-900">Cookie</th>
                        <th className="text-left py-2 font-medium text-gray-900">Propósito</th>
                        <th className="text-left py-2 font-medium text-gray-900">Duración</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-700">
                      <tr className="border-b border-gray-100">
                        <td className="py-2">session_id</td>
                        <td className="py-2">Mantener sesión del usuario</td>
                        <td className="py-2">Sesión</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2">csrf_token</td>
                        <td className="py-2">Seguridad contra ataques CSRF</td>
                        <td className="py-2">Sesión</td>
                      </tr>
                      <tr>
                        <td className="py-2">language_pref</td>
                        <td className="py-2">Recordar preferencia de idioma</td>
                        <td className="py-2">1 año</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Cookies de rendimiento */}
              <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-300">
                <h3 className="font-medium text-gray-900 mb-2">● Cookies de rendimiento</h3>
                <p className="text-gray-700 text-sm mb-3">
                  Nos ayudan a entender cómo los visitantes interactúan con nuestro sitio web.
                </p>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-300">
                        <th className="text-left py-2 font-medium text-gray-900">Servicio</th>
                        <th className="text-left py-2 font-medium text-gray-900">Propósito</th>
                        <th className="text-left py-2 font-medium text-gray-900">Más información</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-700">
                      <tr className="border-b border-gray-100">
                        <td className="py-2">Google Analytics</td>
                        <td className="py-2">Análisis del tráfico web</td>
                        <td className="py-2">
                          <a href="https://policies.google.com/privacy" 
                             className="text-blue-600 hover:text-blue-800 underline"
                             target="_blank" rel="noopener noreferrer">
                            Política de Google
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2">Hotjar</td>
                        <td className="py-2">Mapas de calor y grabaciones</td>
                        <td className="py-2">
                          <a href="https://www.hotjar.com/legal/policies/privacy" 
                             className="text-blue-600 hover:text-blue-800 underline"
                             target="_blank" rel="noopener noreferrer">
                            Política de Hotjar
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Cookies funcionales */}
              <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-300">
                <h3 className="font-medium text-gray-900 mb-2">● Cookies funcionales</h3>
                <p className="text-gray-700 text-sm mb-3">
                  Permiten funcionalidades mejoradas y personalización.
                </p>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-300">
                        <th className="text-left py-2 font-medium text-gray-900">Cookie</th>
                        <th className="text-left py-2 font-medium text-gray-900">Propósito</th>
                        <th className="text-left py-2 font-medium text-gray-900">Duración</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-700">
                      <tr className="border-b border-gray-100">
                        <td className="py-2">user_preferences</td>
                        <td className="py-2">Guardar preferencias del usuario</td>
                        <td className="py-2">30 días</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2">contact_form_data</td>
                        <td className="py-2">Recordar datos del formulario</td>
                        <td className="py-2">7 días</td>
                      </tr>
                      <tr>
                        <td className="py-2">theme_preference</td>
                        <td className="py-2">Tema claro/oscuro</td>
                        <td className="py-2">1 año</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Cookies de marketing */}
              <div className="p-4 bg-gray-100 rounded-lg border-l-4 border-blue-300">
                <h3 className="font-medium text-gray-900 mb-2">● Cookies de marketing</h3>
                <p className="text-gray-700 text-sm mb-3">
                  Se utilizan para mostrar anuncios relevantes y medir la efectividad de campañas.
                </p>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-300">
                        <th className="text-left py-2 font-medium text-gray-900">Servicio</th>
                        <th className="text-left py-2 font-medium text-gray-900">Propósito</th>
                        <th className="text-left py-2 font-medium text-gray-900">Duración típica</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-700">
                      <tr className="border-b border-gray-100">
                        <td className="py-2">Google Ads</td>
                        <td className="py-2">Remarketing y conversiones</td>
                        <td className="py-2">90 días</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2">Facebook Pixel</td>
                        <td className="py-2">Seguimiento de conversiones</td>
                        <td className="py-2">90 días</td>
                      </tr>
                      <tr>
                        <td className="py-2">LinkedIn Insight</td>
                        <td className="py-2">Analytics B2B</td>
                        <td className="py-2">30 días</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          {/* Control de cookies */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Cómo controlar las cookies</h2>
            <p className="text-gray-700 mb-4">
              Puede controlar y administrar las cookies de diversas maneras:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Configuración del navegador */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
                  </svg>
                  Configuración del navegador
                </h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• <strong>Chrome:</strong> Configuración → Privacidad y seguridad → Cookies</li>
                  <li>• <strong>Firefox:</strong> Opciones → Privacidad y seguridad</li>
                  <li>• <strong>Safari:</strong> Preferencias → Privacidad</li>
                  <li>• <strong>Edge:</strong> Configuración → Permisos del sitio → Cookies</li>
                </ul>
              </div>

              {/* Panel de consentimiento */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Panel de consentimiento
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Puede modificar sus preferencias en cualquier momento usando nuestro panel de cookies.
                </p>
                <button className="bg-blue-400 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-500 transition-colors">
                  Gestionar preferencias
                </button>
              </div>
            </div>
          </section>

          {/* Consecuencias de desactivar cookies */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Consecuencias de desactivar cookies</h2>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-300">
                <h3 className="font-medium text-gray-900 mb-2">⚠️ Importante</h3>
                <p className="text-gray-700 text-sm mb-3">
                  Desactivar ciertas cookies puede afectar la funcionalidad del sitio web:
                </p>
                <ul className="text-gray-600 text-sm space-y-1 list-disc list-inside">
                  <li>Dificultades para navegar por el sitio</li>
                  <li>Pérdida de preferencias personalizadas</li>
                  <li>Problemas con formularios de contacto</li>
                  <li>Experiencia de usuario reducida</li>
                  <li>Funciones de seguridad comprometidas</li>
                </ul>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-300">
                <h3 className="font-medium text-gray-900 mb-2">✅ Recomendación</h3>
                <p className="text-gray-700 text-sm">
                  Recomendamos mantener activadas las cookies necesarias para garantizar 
                  el correcto funcionamiento del sitio y una experiencia óptima.
                </p>
              </div>
            </div>
          </section>

          {/* Cookies de terceros */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Cookies de terceros</h2>
            <p className="text-gray-700 mb-4">
              Algunos de nuestros socios utilizan cookies en nuestro sitio web:
            </p>
            
            <div className="space-y-3">
              {[
                {
                  name: "Google Analytics",
                  purpose: "Análisis de tráfico web y comportamiento de usuarios",
                  privacy: "https://policies.google.com/privacy",
                  optout: "https://tools.google.com/dlpage/gaoptout"
                },
                {
                  name: "Google reCAPTCHA", 
                  purpose: "Protección contra spam y bots",
                  privacy: "https://policies.google.com/privacy"
                },
                {
                  name: "CloudFlare",
                  purpose: "CDN, seguridad y optimización del sitio",
                  privacy: "https://www.cloudflare.com/privacypolicy/"
                },
                {
                  name: "EmailJS",
                  purpose: "Servicio de envío de formularios de contacto",
                  privacy: "https://www.emailjs.com/legal/privacy-policy/"
                }
              ].map((service, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="mb-2 sm:mb-0">
                      <h4 className="font-medium text-gray-900">{service.name}</h4>
                      <p className="text-sm text-gray-600">{service.purpose}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <a 
                        href={service.privacy} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors text-center"
                      >
                        Política de privacidad
                      </a>
                      {service.optout && (
                        <a 
                          href={service.optout} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs bg-gray-100 text-gray-800 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors text-center"
                        >
                          Opt-out
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Actualizaciones */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Actualizaciones de esta política</h2>
            <p className="text-gray-700 mb-4">
              Esta política de cookies puede actualizarse periódicamente para reflejar cambios en nuestro 
              uso de cookies o por razones operativas, legales o regulatorias.
            </p>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 text-sm">
                <strong>Le recomendamos</strong> revisar esta página regularmente para mantenerse informado 
                sobre nuestro uso de cookies. Los cambios significativos se notificarán a través de un 
                banner en nuestro sitio web.
              </p>
            </div>
          </section>

          {/* Contacto */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contacto</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                Si tiene preguntas sobre nuestra política de cookies o el tratamiento de sus datos:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Responsable de datos</h4>
                  <div className="space-y-1 text-sm text-gray-700">
                    <p><strong>Empresa:</strong> Dafel Consulting Services, S.C.</p>
                    <p><strong>Correo:</strong> <a href="mailto:info@dafelconsulting.com.mx" className="text-blue-600 hover:text-blue-800">info@dafelconsulting.com.mx</a></p>
                    <p><strong>Teléfono:</strong> +52(55) 4623-0055</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Dirección</h4>
                  <div className="text-sm text-gray-700">
                    <p>Savona No. 72</p>
                    <p>Col. Residencial Acoxpa</p>
                    <p>Alcaldía Tlalpan</p>
                    <p>Ciudad de México, C.P. 14300</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  <strong>Horario:</strong> Lunes a viernes de 9:00 a 18:00 hrs (Tiempo del Centro de México)
                </p>
              </div>
            </div>
          </section>

          {/* Marco legal */}
          <section className="border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Marco legal</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Esta política de cookies se establece en cumplimiento de la <strong>Ley Federal de Protección 
              de Datos Personales en Posesión de los Particulares</strong> y demás normativas aplicables 
              en México. Para consultas sobre el tratamiento de datos personales, consulte nuestro 
              <a href="/privacidad" className="text-blue-600 hover:text-blue-800 ml-1">Aviso de Privacidad</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}