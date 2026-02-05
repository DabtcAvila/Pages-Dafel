import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Aviso de Privacidad | Dafel Technologies',
  description: 'Aviso de privacidad de Dafel Technologies - Protección de datos personales conforme a la legislación mexicana.',
}

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Aviso de Privacidad</h1>
          <p className="mt-2 text-gray-600">Protección de datos personales conforme a la legislación mexicana</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          
          {/* Responsable */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Responsable del tratamiento de datos</h2>
            <p className="text-gray-700 leading-relaxed">
              De acuerdo con la <strong>Ley Federal de Protección de Datos Personales en Posesión de Particulares</strong> {' '}
              publicada en el Diario Oficial de la Federación el 5 de julio de 2010, y su Reglamento, 
              <strong> Dafel Consulting Services, S.C.</strong>, con domicilio fiscal ubicado en:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">Savona No. 72</p>
              <p className="text-gray-700">Col. Residencial Acoxpa</p>
              <p className="text-gray-700">Alcaldía Tlalpan</p>
              <p className="text-gray-700">Ciudad de México, C.P. 14300</p>
              <p className="text-gray-700 mt-2">
                Tel: +52(55) 4623-0055 / +52(55) 4444-5684<br/>
                Web: <a href="https://dafel.com.mx" className="text-blue-600 hover:text-blue-800">www.dafel.com.mx</a>
              </p>
            </div>
          </section>

          {/* Datos recopilados */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Datos personales que recabamos</h2>
            <p className="text-gray-700 mb-4">Recopilamos los siguientes tipos de datos personales:</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Datos de identificación</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Nombre completo</li>
                  <li>• Correo electrónico</li>
                  <li>• Teléfono</li>
                  <li>• Empresa o institución</li>
                  <li>• Puesto o cargo</li>
                </ul>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Datos empresariales</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Número de empleados</li>
                  <li>• Estado de operación</li>
                  <li>• Tipo de servicios requeridos</li>
                  <li>• Normas contables aplicables</li>
                  <li>• Beneficios a evaluar</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Finalidades */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Finalidades del tratamiento</h2>
            <p className="text-gray-700 mb-4">Utilizamos sus datos personales para las siguientes finalidades:</p>
            
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-300">
                <h3 className="font-medium text-gray-900 mb-2">Finalidades Primarias (necesarias)</h3>
                <ul className="text-gray-700 space-y-1">
                  <li>• Proporcionar servicios de consultoría actuarial</li>
                  <li>• Elaborar cotizaciones y propuestas comerciales</li>
                  <li>• Realizar estudios actuariales y valuaciones</li>
                  <li>• Atender solicitudes de información</li>
                  <li>• Cumplir obligaciones legales y regulatorias</li>
                </ul>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-300">
                <h3 className="font-medium text-gray-900 mb-2">Finalidades Secundarias (opcionales)</h3>
                <ul className="text-gray-700 space-y-1">
                  <li>• Envío de información sobre nuevos servicios</li>
                  <li>• Comunicaciones de marketing y promocionales</li>
                  <li>• Invitaciones a eventos y webinars</li>
                  <li>• Estudios de mercado y estadísticos</li>
                  <li>• Mejora de nuestros servicios</li>
                </ul>
                <p className="text-sm text-gray-600 mt-2">
                  <em>Si no desea que sus datos se usan para estas finalidades, puede manifestar su negativa en cualquier momento.</em>
                </p>
              </div>
            </div>
          </section>

          {/* Derechos ARCO */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Sus derechos (ARCO)</h2>
            <p className="text-gray-700 mb-4">Usted tiene derecho a:</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-gray-700 font-bold text-sm">A</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Acceder</p>
                    <p className="text-sm text-gray-600">Conocer qué datos tenemos sobre usted</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-gray-700 font-bold text-sm">R</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Rectificar</p>
                    <p className="text-sm text-gray-600">Corregir datos incorrectos o incompletos</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-gray-700 font-bold text-sm">C</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Cancelar</p>
                    <p className="text-sm text-gray-600">Solicitar la eliminación de sus datos</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-gray-700 font-bold text-sm">O</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Oponerse</p>
                    <p className="text-sm text-gray-600">Negarse al tratamiento de sus datos</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">¿Cómo ejercer sus derechos?</h3>
              <p className="text-gray-700 mb-3">Para ejercer cualquiera de sus derechos ARCO, envíe un correo a:</p>
              <p className="font-medium text-blue-600">
                <a href="mailto:info@dafelconsulting.com.mx" className="hover:text-blue-800">info@dafelconsulting.com.mx</a>
              </p>
              <p className="text-sm text-gray-600 mt-3">
                Su solicitud debe incluir: nombre completo, domicilio, descripción precisa de los datos y 
                documentos que acrediten su identidad.
              </p>
            </div>
          </section>

          {/* Transferencias */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Transferencias de datos</h2>
            <p className="text-gray-700 mb-4">
              Sus datos personales pueden ser compartidos con terceros únicamente en los siguientes casos:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Cuando sea necesario para la prestación del servicio contratado</li>
              <li>Para cumplir con obligaciones legales o regulatorias</li>
              <li>Con su consentimiento expreso</li>
              <li>Cuando exista una orden judicial</li>
            </ul>
          </section>

          {/* Seguridad */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Medidas de seguridad</h2>
            <p className="text-gray-700 mb-4">
              Implementamos medidas de seguridad técnicas, físicas y administrativas para proteger sus datos:
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900">Técnicas</h3>
                <p className="text-sm text-gray-600">Cifrado y protocolos seguros</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900">Físicas</h3>
                <p className="text-sm text-gray-600">Control de acceso a instalaciones</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900">Administrativas</h3>
                <p className="text-sm text-gray-600">Capacitación del personal</p>
              </div>
            </div>
          </section>

          {/* Retención */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Tiempo de retención</h2>
            <p className="text-gray-700">
              Conservaremos sus datos personales durante el tiempo necesario para cumplir con las finalidades 
              descritas, más el periodo adicional requerido por las disposiciones legales aplicables. 
              Una vez que no sean necesarios, procederemos a su eliminación segura.
            </p>
          </section>

          {/* Modificaciones */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Modificaciones al aviso</h2>
            <p className="text-gray-700 mb-4">
              Nos reservamos el derecho de modificar este aviso de privacidad. Las modificaciones se publicarán 
              en nuestro sitio web y, cuando sean sustanciales, se lo notificaremos por los medios de contacto 
              que nos haya proporcionado.
            </p>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 text-sm">
                <strong>Fecha de última actualización:</strong> {new Date().toLocaleDateString('es-MX', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </section>

          {/* Contacto */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contacto</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                Para cualquier consulta sobre este aviso de privacidad o el tratamiento de sus datos personales:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Correo:</strong> <a href="mailto:info@dafelconsulting.com.mx" className="text-blue-600 hover:text-blue-800">info@dafelconsulting.com.mx</a></p>
                <p><strong>Teléfono:</strong> +52(55) 4623-0055</p>
                <p><strong>Horario de atención:</strong> Lunes a viernes de 9:00 a 18:00 hrs</p>
              </div>
            </div>
          </section>

          {/* Jurisdicción */}
          <section className="border-t pt-6">
            <p className="text-sm text-gray-600 leading-relaxed">
              El presente Aviso de Privacidad se rige por la Ley Federal de Protección de Datos Personales 
              en Posesión de los Particulares y demás disposiciones aplicables. Para cualquier controversia 
              derivada del presente aviso, las partes se someten a la jurisdicción de los tribunales 
              competentes de la Ciudad de México.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}