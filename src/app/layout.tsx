import type { Metadata, Viewport } from 'next';
import '../styles/globals.css';
import { LanguageProvider } from '@/contexts/LanguageContext';

export const metadata: Metadata = {
  metadataBase: new URL('https://dafel.com.mx'),
  title: {
    default: 'Dafel Technologies - Consultoría Actuarial y Beneficios Corporativos',
    template: '%s | Dafel Technologies'
  },
  description: 'DAFEL es consultoría actuarial especializada en planes de beneficios corporativos, obligaciones laborales y gestión de riesgos en México. Expertos en NIF D-3, IAS-19 y US GAAP.',
  keywords: [
    'consultoría actuarial',
    'beneficios corporativos', 
    'beneficios a los empleados',
    'beneficios empleados NIF D-3',
    'beneficios empleados mexico',
    'valuacion beneficios empleados',
    'consultoria beneficios empleados',
    'implementar beneficios empleados',
    'planes beneficios empleados',
    'retener talento empleados',
    'beneficios empleados competitivos',
    'planes de pensiones',
    'planes pensiones empleados',
    'seguros gastos medicos empresas',
    'fondos ahorro empleados',
    'NIF D-3',
    'NIF D-3 2026',
    'cambios NIF D-3 2026',
    'actualizaciones NIF D-3 2026',
    'mejoras NIF 2026',
    'NIF D-3 vs IAS-19',
    'diferencias NIF D-3 IAS-19',
    'convergencia NIF D-3 IAS-19',
    'IAS-19',
    'US GAAP',
    'pasivos laborales',
    'prima de antigüedad',
    'indemnizaciones',
    'previsión social',
    'administración de riesgos',
    'trámites IMSS',
    'asesoría fiscal',
    'beneficios empleados fiscales',
    'deducibles beneficios empleados',
    'observaciones auditoria NIF D-3',
    'auditor requiere actuario',
    'contador necesita actuario',
    'actuario certificado CONAC',
    'estudios validados auditor externo',
    'auditoria externa pasivos laborales',
    'actuario certificado pasivos laborales contingentes',
    'eliminar observaciones auditoria',
    'documentacion auditoria NIF D-3',
    'UMA 2025',
    'ESG reporting',
    'sostenibilidad empresarial',
    'convergencia internacional',
    'automatización actuarial',
    'Dafel Technologies'
  ],
  authors: [{ name: 'Dafel Technologies' }],
  creator: 'Dafel Technologies',
  publisher: 'Dafel Technologies',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico?v=20250107', sizes: 'any' },
      { url: '/favicon.svg?v=20250107', type: 'image/svg+xml' },
      { url: '/favicon-16.png?v=20250107', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32.png?v=20250107', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png?v=20250107', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: 'https://dafel.com.mx',
    siteName: 'Dafel Technologies',
    title: 'Dafel Technologies - Consultoría Actuarial y Beneficios Corporativos',
    description: 'Consultoría empresarial especializada en planes de beneficios corporativos, obligaciones laborales y gestión de riesgos.',
    images: [
      {
        url: '/dafel-og-image.png',
        width: 1200,
        height: 630,
        alt: 'Dafel Technologies - Consultoría Actuarial',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dafel Technologies - Consultoría Actuarial y Beneficios Corporativos',
    description: 'Consultoría empresarial especializada en planes de beneficios corporativos, obligaciones laborales y gestión de riesgos.',
    images: ['/dafel-og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://dafel.com.mx',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" dir="ltr">
      <head>
        <link rel="canonical" href="https://dafel.com.mx" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        
        {/* Critical Resource Preconnects - More Efficient */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        
        {/* Preconnect to contact API - saves 300ms LCP */}
        <link rel="preconnect" href="https://dafel-contact-api.davidfernando.workers.dev" />
        <link rel="dns-prefetch" href="//dafel-contact-api.davidfernando.workers.dev" />
        
        {/* Additional performance hints */}
        <link rel="dns-prefetch" href="//dafel.com.mx" />
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
        
        {/* Preload critical font for LCP improvement */}
        <link 
          rel="preload" 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" 
          as="style"
          onLoad="this.onload=null;this.rel='stylesheet'"
        />
        <noscript>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" />
        </noscript>
        
        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Dafel Technologies",
              "legalName": "Dafel Consulting Services",
              "alternateName": ["Dafel Consulting", "Dafel", "DAFEL"],
              "url": "https://dafel.com.mx",
              "logo": {
                "@type": "ImageObject",
                "url": "https://dafel.com.mx/dafel-logo-optimized.svg",
                "width": 1000,
                "height": 600
              },
              "image": "https://dafel.com.mx/dafel-og-image.png",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": ["+52-55-4444-5684", "+52-55-4623-0055"],
                "contactType": "customer service",
                "areaServed": "MX",
                "availableLanguage": ["Spanish", "English"]
              },
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Savona No.72, Col. Residencial Acoxpa",
                "addressLocality": "Tlalpan",
                "addressRegion": "Ciudad de México",
                "postalCode": "14300",
                "addressCountry": "MX"
              },
              "description": "DAFEL es consultoría actuarial especializada en planes de beneficios corporativos, obligaciones laborales y gestión de riesgos en México. Expertos en valuación bajo NIF D-3, IAS-19 y US GAAP.",
              "foundingDate": "2020",
              "datePublished": "2020-01-01",
              "dateModified": "2025-01-05",
              "industry": "Actuarial Consulting Services",
              "numberOfEmployees": "10-50",
              "keywords": ["consultoría actuarial", "DAFEL", "NIF D-3", "IAS-19", "US GAAP", "beneficios corporativos", "pasivos laborales"],
              "slogan": "DAFEL - Consultoría Actuarial y Beneficios Corporativos especializada en México",
              "founder": {
                "@type": "Person",
                "name": "Dafel Technologies Founders"
              },
              "serviceArea": {
                "@type": "Country",
                "name": "Mexico"
              }
            })
          }}
        />
        
        {/* Structured Data - Professional Service */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              "name": "DAFEL - Consultoría Actuarial y Beneficios Corporativos",
              "alternateName": "Dafel Technologies",
              "image": "https://dafel.com.mx/dafel-og-image.png",
              "description": "DAFEL es consultoría actuarial especializada en México. Especialistas en valuación bajo NIF D-3, IAS-19 y US GAAP. Servicios de pasivos laborales, prima de antigüedad, indemnizaciones, planes de pensiones y beneficios corporativos.",
              "priceRange": "$$",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Savona No.72, Col. Residencial Acoxpa",
                "addressLocality": "Tlalpan",
                "addressRegion": "Ciudad de México",
                "postalCode": "14300",
                "addressCountry": "MX"
              },
              "url": "https://dafel.com.mx",
              "telephone": ["+52-55-4444-5684", "+52-55-4623-0055"],
              "serviceType": [
                "Consultoría Actuarial",
                "Beneficios Corporativos",
                "Gestión de Riesgos",
                "Planes de Pensiones",
                "Asesoría Fiscal",
                "Valuación NIF D-3",
                "Valuación IAS-19",
                "Valuación US GAAP",
                "Pasivos Laborales",
                "Prima de Antigüedad",
                "Indemnizaciones",
                "Gastos Médicos al Retiro"
              ],
              "areaServed": {
                "@type": "Country",
                "name": "Mexico"
              },
              "brand": {
                "@type": "Brand",
                "name": "DAFEL",
                "alternateName": ["Dafel", "Dafel Technologies", "Dafel Consulting"]
              },
              "expertise": [
                "NIF D-3 (Norma de Información Financiera)",
                "IAS-19 (International Financial Reporting Standards)",
                "US GAAP (United States Generally Accepted Accounting Principles)",
                "Actuarial Consulting",
                "Employee Benefits",
                "Pension Plans",
                "Labor Liabilities"
              ]
            })
          }}
        />
        
        {/* Structured Data - LocalBusiness for Geolocation */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "@id": "https://dafel.com.mx/#localbusiness",
              "name": "DAFEL - Consultoría Actuarial México",
              "alternateName": ["DAFEL", "Dafel Consulting", "Dafel Technologies"],
              "description": "Consultoría actuarial especializada en México ubicada en Ciudad de México. Servicios de asesoría NIF D-3, valuación de pasivos laborales y consultoría empresarial para toda la República Mexicana.",
              "url": "https://dafel.com.mx",
              "image": "https://dafel.com.mx/dafel-og-image.png",
              "logo": "https://dafel.com.mx/dafel-logo-optimized.svg",
              
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Savona No.72, Col. Residencial Acoxpa",
                "addressLocality": "Tlalpan",
                "addressRegion": "Ciudad de México",
                "postalCode": "14300",
                "addressCountry": "México"
              },
              
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 19.297,
                "longitude": -99.204
              },
              
              "contactPoint": [
                {
                  "@type": "ContactPoint",
                  "telephone": "+52-55-4444-5684",
                  "contactType": "Consultoría Comercial",
                  "areaServed": "MX",
                  "availableLanguage": ["Spanish", "English"],
                  "contactOption": "TollFree"
                },
                {
                  "@type": "ContactPoint", 
                  "telephone": "+52-55-4623-0055",
                  "contactType": "Asesoría Técnica",
                  "areaServed": "MX",
                  "availableLanguage": ["Spanish", "English"]
                }
              ],
              
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                "opens": "09:00",
                "closes": "18:00"
              },
              
              "servedCuisine": null,
              "priceRange": "$$",
              
              "serviceArea": [
                {
                  "@type": "State",
                  "name": "Ciudad de México"
                },
                {
                  "@type": "State", 
                  "name": "Estado de México"
                },
                {
                  "@type": "Country",
                  "name": "México"
                }
              ],
              
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Servicios de Consultoría Actuarial México",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "name": "Asesoría NIF D-3 México",
                    "description": "Consultoría especializada en NIF D-3 para empresas mexicanas",
                    "category": "Actuarial Consulting",
                    "areaServed": "México"
                  },
                  {
                    "@type": "Offer",
                    "name": "Valuación de Pasivos Laborales México",
                    "description": "Estudios actuariales de pasivos laborales para empresas en México",
                    "category": "Actuarial Valuation",
                    "areaServed": "México"
                  },
                  {
                    "@type": "Offer",
                    "name": "Consultoría Actuarial CDMX",
                    "description": "Servicios de consultoría actuarial desde Ciudad de México",
                    "category": "Business Consulting",
                    "areaServed": "Ciudad de México"
                  }
                ]
              },
              
              "knowsAbout": [
                "Consultoría Actuarial México",
                "Asesoría NIF D-3",
                "Pasivos Laborales México",
                "Valuación Actuarial CDMX",
                "Consultores Actuariales Ciudad de México",
                "IAS-19 México",
                "US GAAP México",
                "Beneficios Empleados México"
              ],
              
              "sameAs": [
                "https://dafel.com.mx",
                "https://dafel.com.mx/nosotros",
                "https://dafel.com.mx/nif-d3",
                "https://dafel.com.mx/ias-19"
              ],
              
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "bestRating": "5",
                "worstRating": "1", 
                "ratingCount": "25",
                "description": "Alta satisfacción de clientes en servicios de consultoría actuarial"
              }
            })
          }}
        />

        {/* Structured Data - Commercial FAQ for Answer Engines */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "@id": "https://dafel.com.mx/#commercial-faq",
              "name": "Preguntas Frecuentes - DAFEL Consultoría Actuarial México",
              "description": "Preguntas frecuentes sobre servicios de consultoría actuarial, asesoría NIF D-3 y valuación de pasivos laborales en México",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "¿Dónde puedo encontrar consultoría actuarial especializada en México?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "DAFEL es consultoría actuarial especializada en México ubicada en Ciudad de México. Ofrecemos servicios de asesoría NIF D-3, valuación de pasivos laborales y consultoría empresarial para toda la República Mexicana. Contáctanos al +52-55-4444-5684."
                  }
                },
                {
                  "@type": "Question", 
                  "name": "¿Quién ofrece asesoría para NIF D-3 en México?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "DAFEL ofrece asesoría especializada en NIF D-3 (Norma de Información Financiera D-3) en México. Somos expertos en implementación y cumplimiento de NIF D-3 para beneficios a empleados, con servicios para toda la República Mexicana desde Ciudad de México."
                  }
                },
                {
                  "@type": "Question",
                  "name": "¿Necesito consultoría actuarial para pasivos laborales en México?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Sí, DAFEL ofrece consultoría actuarial especializada en pasivos laborales en México. Realizamos estudios actuariales para cuantificar pasivos laborales, prima de antigüedad, indemnizaciones y beneficios por terminación laboral bajo normativas mexicanas."
                  }
                },
                {
                  "@type": "Question",
                  "name": "¿Qué empresa ofrece valuación actuarial en México bajo IAS-19?", 
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "DAFEL es consultoría actuarial en México que ofrece servicios especializados en IAS-19. Realizamos valuación actuarial bajo estándares internacionales para empresas mexicanas que requieren cumplimiento con IAS-19 para beneficios a empleados."
                  }
                },
                {
                  "@type": "Question",
                  "name": "¿Dónde están ubicados los consultores actuariales DAFEL?",
                  "acceptedAnswer": {
                    "@type": "Answer", 
                    "text": "DAFEL está ubicada en Savona No.72, Col. Residencial Acoxpa, Tlalpan, Ciudad de México, C.P. 14300. Desde CDMX atendemos empresas en toda la República Mexicana con servicios de consultoría actuarial especializada."
                  }
                },
                {
                  "@type": "Question",
                  "name": "¿DAFEL ofrece consultoría empresarial especializada en México?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Sí, DAFEL es consultoría empresarial especializada en servicios actuariales en México. Ofrecemos asesoría integral en NIF D-3, IAS-19, US GAAP, pasivos laborales, planes de pensiones y beneficios corporativos para empresas mexicanas."
                  }
                },
                {
                  "@type": "Question", 
                  "name": "¿Qué son los pasivos laborales y cómo se valúan en México?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Los pasivos laborales son obligaciones futuras de la empresa con empleados. DAFEL realiza valuación actuarial de pasivos laborales bajo NIF D-3, incluyendo prima de antigüedad, indemnizaciones y obligaciones laborales en México."
                  }
                },
                {
                  "@type": "Question",
                  "name": "¿Cómo se calcula la prima de antigüedad en México?", 
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "DAFEL calcula prima de antigüedad bajo NIF D-3 mediante estudios actuariales. Es obligación patronal por Ley Federal del Trabajo pagadera en muerte, invalidez, despido y separación voluntaria con +15 años."
                  }
                },
                {
                  "@type": "Question",
                  "name": "¿Qué incluye la valuación de pasivos laborales bajo NIF D-3?",
                  "acceptedAnswer": {
                    "@type": "Answer", 
                    "text": "DAFEL incluye en valuación NIF D-3: prima de antigüedad, indemnizaciones, PTU diferida, gastos médicos al retiro y otros beneficios laborales. Realizamos estudios actuariales completos para empresas mexicanas."
                  }
                },
                {
                  "@type": "Question",
                  "name": "¿Por qué necesito un actuario para pasivos laborales?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "La NIF D-3 requiere valuación actuarial para pasivos laborales. DAFEL tiene actuarios certificados que calculan obligaciones laborales usando métodos estadísticos y financieros para cumplimiento normativo en México."
                  }
                },
                {
                  "@type": "Question", 
                  "name": "¿Qué necesito para auditoria externa de pasivos laborales?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Para auditoria externa necesitas estudio actuarial certificado de pasivos laborales bajo NIF D-3. DAFEL proporciona valuaciones que cumplen requerimientos de auditores externos en México."
                  }
                },
                {
                  "@type": "Question",
                  "name": "¿Cómo se calculan los pasivos laborales contingentes?", 
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Los pasivos laborales contingentes se calculan mediante métodos actuariales. DAFEL usa factores demográfico-financieros para cuantificar obligaciones inciertas como prima de antigüedad e indemnizaciones."
                  }
                },
                {
                  "@type": "Question",
                  "name": "¿Necesito actuario certificado para pasivos laborales urgente?",
                  "acceptedAnswer": {
                    "@type": "Answer", 
                    "text": "Sí, DAFEL cuenta con actuarios certificados que pueden realizar estudios urgentes de pasivos laborales. Ofrecemos servicios expeditos para empresas que necesitan valuaciones antes del cierre contable."
                  }
                },
                {
                  "@type": "Question",
                  "name": "¿Qué métodos actuariales usa DAFEL para pasivos laborales?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "DAFEL utiliza métodos actuariales reconocidos internacionalmente bajo NIF D-3, IAS-19 y US GAAP. Aplicamos técnicas estadísticas avanzadas para cuantificar pasivos laborales con precisión."
                  }
                },
                {
                  "@type": "Question",
                  "name": "¿Cómo implementar beneficios a los empleados en mi empresa?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "DAFEL ayuda a implementar beneficios empleados bajo NIF D-3: evaluamos necesidades, diseñamos planes de pensiones, seguros médicos, y realizamos valuaciones actuariales para cumplimiento fiscal y contable."
                  }
                },
                {
                  "@type": "Question",
                  "name": "¿Qué beneficios empleados son deducibles fiscalmente?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "DAFEL asesora en beneficios empleados deducibles: seguros gastos médicos, planes pensiones, fondos ahorro. Cumplimos requisitos SAT para maximizar beneficios fiscales empresariales."
                  }
                },
                {
                  "@type": "Question", 
                  "name": "¿Cómo valuar actuarialmente beneficios a empleados?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "DAFEL realiza valuación actuarial de beneficios empleados bajo NIF D-3, IAS-19 y US GAAP. Cuantificamos planes pensiones, gastos médicos y otros beneficios para estados financieros."
                  }
                },
                {
                  "@type": "Question",
                  "name": "¿Qué beneficios empleados ayudan a retener talento?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "DAFEL diseña planes beneficios competitivos: seguros gastos médicos, planes pensiones, fondos ahorro. Ayudamos a reducir rotación personal con beneficios empleados estratégicos."
                  }
                },
                {
                  "@type": "Question",
                  "name": "¿Qué hacer con observaciones de auditoria en NIF D-3?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "DAFEL resuelve observaciones de auditoria NIF D-3 con estudios actuariales certificados. Nuestros actuarios registrados CONAC entregan valuaciones que cumplen estándares de auditores externos."
                  }
                },
                {
                  "@type": "Question",
                  "name": "¿Cómo elegir actuario certificado para auditoria externa?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "DAFEL cuenta con actuarios certificados en Pasivos Laborales Contingentes por CONAC. Nuestros estudios han sido validados por auditores en México, Estados Unidos y otros países."
                  }
                },
                {
                  "@type": "Question",
                  "name": "¿Necesito actuario cuando auditor externo lo requiere?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Sí, cuando auditor externo requiere actuario para NIF D-3, DAFEL proporciona servicios especializados. Entregamos estudios que facilitan el proceso de auditoria y eliminan observaciones."
                  }
                },
                {
                  "@type": "Question",
                  "name": "¿Qué documentación necesita contador para auditoria NIF D-3?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "DAFEL entrega estudios actuariales completos para auditoria: valuación certificada, metodología detallada, supuestos actuariales y reportes que cumplen requerimientos de contadores y auditores."
                  }
                },
                {
                  "@type": "Question",
                  "name": "¿Qué cambios trae NIF D-3 2026?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Las mejoras NIF 2026 incluyen actualizaciones en reconocimiento, revelaciones y convergencia con IAS-19. DAFEL ayuda a empresas con implementación anticipada permitida desde 2025 y cumplimiento 2026."
                  }
                },
                {
                  "@type": "Question",
                  "name": "¿Diferencias entre NIF D-3 vs IAS-19?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "DAFEL especialista en ambas normativas: NIF D-3 permite método banda fluctuación mientras IAS-19 requiere reconocimiento inmediato. Asesoramos convergencia internacional y dual compliance."
                  }
                },
                {
                  "@type": "Question",
                  "name": "¿Cómo prepararse para NIF D-3 2026?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "DAFEL recomienda: revisar políticas actuales, evaluar impactos de nuevas revelaciones, considerar aplicación anticipada 2025. Nuestros actuarios certificados CONAC aseguran transición exitosa."
                  }
                }
              ]
            })
          }}
        />
        
        {/* Critical CSS inline - minimal above-the-fold only */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Font fallback */
            @font-face {
              font-family: 'Inter-fallback';
              font-style: normal;
              font-weight: 300 700;
              font-display: swap;
              src: local('Arial'), local('Helvetica'), local('system-ui');
            }
            
            /* Critical hero section only */
            body { 
              font-family: 'Inter', 'Inter-fallback', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
              font-display: swap;
              margin: 0;
            }
            
            /* Hero section critical styles only */
            .relative { position: relative; }
            .absolute { position: absolute; }
            .inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
            .w-full { width: 100%; }
            .h-full { height: 100%; }
            .h-screen { height: 100vh; }
            .opacity-0 { opacity: 0; }
            .opacity-100 { opacity: 1; }
          `
        }} />
        
        {/* Load CSS non-blocking after critical content */}
        <link rel="preload" href="/_next/static/css/e34dc0421c040f9e.css" as="style" onLoad="this.onload=null;this.rel='stylesheet'" />
        <noscript>
          <link rel="stylesheet" href="/_next/static/css/e34dc0421c040f9e.css" />
        </noscript>
        
        {/* Defer non-critical CSS loading */}
        <script dangerouslySetInnerHTML={{
          __html: `
            // Load CSS after page load to avoid render blocking
            window.addEventListener('load', function() {
              var link = document.createElement('link');
              link.rel = 'stylesheet';
              link.href = '/_next/static/css/e34dc0421c040f9e.css';
              document.head.appendChild(link);
            });
          `
        }} />
        
        {/* Preload critical JavaScript chunks */}
        <link rel="preload" href="/_next/static/chunks/main-eb96b309af8b596e.js" as="script" fetchPriority="high" />
        <link rel="preload" href="/_next/static/chunks/2117-3b327e5194fdd036.js" as="script" fetchPriority="high" />
      </head>
      <body className="font-sans antialiased">
        <LanguageProvider>
          {children}
        </LanguageProvider>
        
        {/* Hidden Internal Link Structure for SEO Authority Distribution */}
        <div style={{position: 'absolute', left: '-9999px', top: '-9999px', visibility: 'hidden', overflow: 'hidden', width: '1px', height: '1px'}}>
          <nav aria-hidden="true">
            <ul>
              <li><a href="/pasivos-laborales" title="Pasivos Laborales México">Valuación Actuarial Pasivos Laborales</a></li>
              <li><a href="/prima-antiguedad" title="Prima Antigüedad México">Prima de Antigüedad Ley Federal Trabajo</a></li>  
              <li><a href="/indemnizaciones" title="Indemnizaciones Laborales">Indemnizaciones por Terminación Laboral</a></li>
              <li><a href="/nif-d3" title="Asesoría NIF D-3 México">NIF D-3 Beneficios a Empleados</a></li>
              <li><a href="/ias-19" title="Consultoría IAS-19">IAS-19 Estándares Internacionales</a></li>
              <li><a href="/us-gaap" title="US GAAP México">US GAAP Reporteo Estados Unidos</a></li>
            </ul>
          </nav>
        </div>
        
        {/* Analytics placeholder for future implementation */}
        {process.env.NODE_ENV === 'production' && process.env.GOOGLE_ANALYTICS_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                // Lightweight analytics implementation
                (function() {
                  // Only load if real GA ID is provided
                  if ('${process.env.GOOGLE_ANALYTICS_ID}'.includes('GA_TRACKING_ID')) return;
                  
                  var loadAnalytics = function() {
                    if (window.gtag) return;
                    
                    var script = document.createElement('script');
                    script.async = true;
                    script.src = 'https://www.googletagmanager.com/gtag/js?id=${process.env.GOOGLE_ANALYTICS_ID}';
                    document.head.appendChild(script);
                    
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    window.gtag = gtag;
                    gtag('js', new Date());
                    gtag('config', '${process.env.GOOGLE_ANALYTICS_ID}');
                  };
                  
                  // Load only on first meaningful interaction
                  ['click', 'scroll'].forEach(function(event) {
                    document.addEventListener(event, loadAnalytics, {once: true, passive: true});
                  });
                })();
              `,
            }}
          />
        )}
      </body>
    </html>
  );
}