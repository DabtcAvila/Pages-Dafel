import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Términos y Condiciones | Dafel Technologies',
  description: 'Términos y condiciones de uso de los servicios de Dafel Technologies - Consultoría actuarial empresarial.',
}

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Términos y Condiciones</h1>
          <p className="mt-2 text-gray-600">Condiciones de uso de los servicios de Dafel Consulting Services</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          
          {/* Aceptación */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Aceptación de términos</h2>
            <p className="text-gray-700 leading-relaxed">
              Al acceder y utilizar los servicios de <strong>Dafel Consulting Services, S.C.</strong> (en adelante "Dafel" o "la Empresa"), 
              usted acepta estar sujeto a estos términos y condiciones de uso. Si no está de acuerdo con alguno de estos términos, 
              le rogamos que no utilice nuestros servicios.
            </p>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800 text-sm">
                <strong>Fecha de vigencia:</strong> {new Date().toLocaleDateString('es-MX', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </section>

          {/* Servicios */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Servicios ofrecidos</h2>
            <p className="text-gray-700 mb-4">Dafel Consulting Services ofrece los siguientes servicios profesionales:</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Consultoría Actuarial</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Valuaciones actuariales</li>
                  <li>• Cálculo de pasivos laborales</li>
                  <li>• Prima de antigüedad</li>
                  <li>• Indemnizaciones</li>
                  <li>• Gastos médicos al retiro</li>
                </ul>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Normativas Contables</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• NIF D-3 (Normatividad Mexicana)</li>
                  <li>• IAS-19 (Normatividad Internacional)</li>
                  <li>• US GAAP (Normatividad Estadounidense)</li>
                  <li>• Planes de pensiones y jubilación</li>
                  <li>• Reportes regulatorios</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Obligaciones del cliente */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Obligaciones del cliente</h2>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-300">
                <h3 className="font-medium text-gray-900 mb-2">Información y documentación</h3>
                <ul className="text-gray-700 space-y-1">
                  <li>• Proporcionar información veraz, completa y actualizada</li>
                  <li>• Entregar la documentación requerida en tiempo y forma</li>
                  <li>• Notificar cambios relevantes que puedan afectar los servicios</li>
                  <li>• Facilitar el acceso a registros y sistemas necesarios</li>
                </ul>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-300">
                <h3 className="font-medium text-gray-900 mb-2">Pago y facturación</h3>
                <ul className="text-gray-700 space-y-1">
                  <li>• Realizar los pagos en las fechas acordadas</li>
                  <li>• Proporcionar datos fiscales correctos</li>
                  <li>• Cubrir gastos adicionales previamente autorizados</li>
                  <li>• Informar cambios en la situación fiscal</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Obligaciones de Dafel */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Nuestras obligaciones</h2>
            <p className="text-gray-700 mb-4">Dafel Consulting Services se compromete a:</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-green-600 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Calidad profesional</p>
                    <p className="text-sm text-gray-600">Servicios con los más altos estándares técnicos</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-blue-600 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Confidencialidad</p>
                    <p className="text-sm text-gray-600">Protección absoluta de la información</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-purple-600 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Cumplimiento</p>
                    <p className="text-sm text-gray-600">Entrega oportuna según cronogramas acordados</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-red-600 font-bold text-sm">4</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Soporte</p>
                    <p className="text-sm text-gray-600">Asesoría y aclaraciones post-entrega</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Propiedad intelectual */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Propiedad intelectual</h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                Los derechos de propiedad intelectual sobre los trabajos y entregables se distribuyen de la siguiente manera:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Metodología y herramientas</h3>
                  <p className="text-sm text-gray-600">
                    Las metodologías, modelos actuariales, software y herramientas utilizadas 
                    permanecen como propiedad exclusiva de Dafel Consulting Services.
                  </p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Resultados y reportes</h3>
                  <p className="text-sm text-gray-600">
                    Los reportes finales, valuaciones y análisis específicos del cliente 
                    son propiedad del cliente una vez liquidados los honorarios correspondientes.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Limitación de responsabilidad */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Limitación de responsabilidad</h2>
            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-300">
              <p className="text-gray-700 mb-4">
                <strong>Importante:</strong> La responsabilidad de Dafel Consulting Services se limita a:
              </p>
              <ul className="text-gray-600 space-y-2 list-disc list-inside">
                <li>El correcto desarrollo de los servicios contratados según metodologías estándar</li>
                <li>La precisión de cálculos basados en la información proporcionada por el cliente</li>
                <li>El cumplimiento de las normativas aplicables vigentes al momento del servicio</li>
              </ul>
              <p className="text-gray-700 mt-4 text-sm">
                <strong>Exclusiones:</strong> Dafel no será responsable por decisiones empresariales tomadas 
                con base en los estudios, cambios regulatorios posteriores, o información incorrecta 
                proporcionada por el cliente.
              </p>
            </div>
          </section>

          {/* Confidencialidad */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Confidencialidad</h2>
            <p className="text-gray-700 mb-4">
              Dafel Consulting Services se compromete a mantener estricta confidencialidad sobre:
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900">Información financiera</h3>
                <p className="text-sm text-gray-600">Estados financieros y datos contables</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900">Datos de empleados</h3>
                <p className="text-sm text-gray-600">Nóminas y censo poblacional</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z"></path>
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900">Estrategia empresarial</h3>
                <p className="text-sm text-gray-600">Planes y decisiones corporativas</p>
              </div>
            </div>
          </section>

          {/* Terminación del servicio */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Terminación del servicio</h2>
            <p className="text-gray-700 mb-4">
              El servicio puede terminarse en los siguientes casos:
            </p>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-300">
                <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-white font-bold text-xs">!</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Por incumplimiento</p>
                  <p className="text-sm text-gray-600">Falta de pago, información incorrecta o violación de términos</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-300">
                <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-white font-bold text-xs">✓</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Por mutuo acuerdo</p>
                  <p className="text-sm text-gray-600">Conclusión del proyecto o decisión conjunta de las partes</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-300">
                <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-white font-bold text-xs">→</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Con aviso previo</p>
                  <p className="text-sm text-gray-600">Cualquiera de las partes con 30 días de anticipación</p>
                </div>
              </div>
            </div>
          </section>

          {/* Modificaciones */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Modificaciones</h2>
            <p className="text-gray-700 mb-4">
              Dafel Consulting Services se reserva el derecho de modificar estos términos y condiciones. 
              Las modificaciones entrarán en vigor una vez publicadas en nuestro sitio web oficial.
            </p>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 text-sm">
                <strong>Notificación:</strong> Los clientes activos serán notificados de cambios sustanciales 
                por correo electrónico con al menos 15 días de anticipación.
              </p>
            </div>
          </section>

          {/* Contacto y soporte */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contacto y soporte</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                Para consultas sobre estos términos y condiciones o soporte técnico:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Información general</h4>
                  <div className="space-y-1 text-sm text-gray-700">
                    <p><strong>Correo:</strong> <a href="mailto:info@dafelconsulting.com.mx" className="text-blue-600 hover:text-blue-800">info@dafelconsulting.com.mx</a></p>
                    <p><strong>Teléfono:</strong> +52(55) 4623-0055</p>
                    <p><strong>Cel:</strong> +52(55) 4444-5684</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Dirección física</h4>
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
                  <strong>Horario de atención:</strong> Lunes a viernes de 9:00 a 18:00 hrs (Tiempo del Centro de México)
                </p>
              </div>
            </div>
          </section>

          {/* Jurisdicción */}
          <section className="border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Ley aplicable y jurisdicción</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Estos términos y condiciones se rigen por las leyes mexicanas. Cualquier controversia 
              derivada del cumplimiento, interpretación o ejecución de estos términos será resuelta 
              por los tribunales competentes de la Ciudad de México, México. Las partes renuncian 
              expresamente a cualquier otro fuero que pudiera corresponderles por razón de sus 
              domicilios presentes o futuros.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}