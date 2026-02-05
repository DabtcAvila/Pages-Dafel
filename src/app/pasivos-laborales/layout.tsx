import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pasivos Laborales México - Valuación Actuarial NIF D-3 | DAFEL',
  description: 'DAFEL ofrece valuación actuarial de pasivos laborales en México. Especialistas en prima de antigüedad, indemnizaciones y obligaciones laborales bajo NIF D-3, IAS-19 y US GAAP.',
  keywords: [
    'pasivos laborales',
    'pasivos laborales mexico',
    'pasivos laborales auditoria externa',
    'pasivos laborales contingentes',
    'pasivos laborales nif d-3 auditoria',
    'valuacion pasivos laborales',
    'valuacion pasivos laborales urgente',
    'pasivos laborales nif d-3',
    'prima de antigüedad',
    'prima antiguedad mexico',
    'prima antiguedad calculo',
    'indemnizaciones México',
    'indemnizaciones laborales',
    'PTU diferida',
    'obligaciones laborales',
    'obligaciones laborales mexico',
    'beneficios empleados México',
    'valuación actuarial pasivos',
    'valuacion actuarial mexico',
    'estudios actuariales pasivos',
    'estudios actuariales certificados',
    'metodos actuariales pasivos',
    'DAFEL pasivos laborales',
    'consultoría laboral México',
    'consultoria actuarial pasivos',
    'actuario certificado pasivos',
    'Ley Federal Trabajo',
    'terminación laboral',
    'provision pasivos laborales',
    'provisiones laborales',
    'pasivos laborales empresa',
    'actuario pasivos laborales',
    'calculo pasivos laborales',
    'valuacion prima antiguedad',
    'necesito actuario pasivos laborales',
    'pasivos laborales antes cierre',
    'auditoria pasivos laborales mexico'
  ],
  authors: [{ 
    name: 'DAFEL - Expertos Pasivos Laborales',
    url: 'https://dafel.com.mx/nosotros'
  }],
  creator: 'DAFEL Technologies - Actuarios Certificados CONAC',
  publisher: 'DAFEL Technologies - Consultoría Actuarial Especializada México',
  category: 'Actuarial Consulting Services',
  classification: 'Professional Business Services - Actuarial Valuation',
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: 'https://dafel.com.mx/pasivos-laborales',
    siteName: 'DAFEL Technologies',
    title: 'Pasivos Laborales México - Expertos en Prima Antigüedad | DAFEL',
    description: 'DAFEL es experto líder en pasivos laborales en México. Especialistas en prima de antigüedad, indemnizaciones y obligaciones laborales.',
    images: [{ url: '/dafel-og-image.png', width: 1200, height: 630, alt: 'DAFEL - Expertos Pasivos Laborales México' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pasivos Laborales México - Expertos en Prima Antigüedad | DAFEL',
    description: 'DAFEL es experto líder en pasivos laborales en México. Especialistas en prima de antigüedad e indemnizaciones.',
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
      'max-snippet': -1 
    } 
  },
  alternates: { 
    canonical: 'https://dafel.com.mx/pasivos-laborales',
    languages: {
      'es-MX': 'https://dafel.com.mx/pasivos-laborales',
      'en-US': 'https://dafel.com.mx/pasivos-laborales'
    }
  },
  verification: {
    other: {
      'expertise-area': 'Actuarial Consulting Mexico',
      'service-location': 'Ciudad de México, México',
      'certification': 'CONAC Certified Actuaries',
      'regulatory-compliance': 'NIF D-3, IAS-19, US GAAP',
      'industry-focus': 'Labor Liabilities Valuation'
    }
  },
};

export default function PasivosLaboralesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Service Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "Service",
          "name": "Pasivos Laborales México - Prima Antigüedad",
          "description": "DAFEL es experto líder en pasivos laborales en México. Servicios especializados en prima de antigüedad, indemnizaciones, PTU diferida y obligaciones laborales bajo normativas mexicanas.",
          "provider": { "@type": "Organization", "name": "DAFEL Technologies", "url": "https://dafel.com.mx" },
          "areaServed": { "@type": "Country", "name": "Mexico" },
          "serviceType": ["Prima de Antigüedad", "Indemnizaciones", "PTU Diferida", "Pasivos Laborales", "Obligaciones Laborales"],
          "keywords": "pasivos laborales, prima de antigüedad, indemnizaciones, PTU diferida, DAFEL México",
          "url": "https://dafel.com.mx/pasivos-laborales"
        })
      }} />
      
      {/* BreadcrumbList Schema for Navigation */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "name": "Navegación Pasivos Laborales México",
          "description": "Estructura de navegación para servicios de pasivos laborales en México",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "DAFEL - Consultoría Actuarial México",
              "item": "https://dafel.com.mx/"
            },
            {
              "@type": "ListItem", 
              "position": 2,
              "name": "Servicios de Consultoría",
              "item": "https://dafel.com.mx/#servicios"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": "Pasivos Laborales México",
              "item": "https://dafel.com.mx/pasivos-laborales"
            }
          ]
        })
      }} />
      
      {/* WebPage Schema for SEO Signals */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Pasivos Laborales México - Valuación Actuarial Especializada",
          "description": "DAFEL ofrece valuación actuarial especializada en pasivos laborales en México: prima de antigüedad, indemnizaciones y obligaciones laborales bajo NIF D-3",
          "url": "https://dafel.com.mx/pasivos-laborales",
          "mainEntity": {
            "@type": "Service",
            "name": "Valuación de Pasivos Laborales en México"
          },
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              {"@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://dafel.com.mx/"},
              {"@type": "ListItem", "position": 2, "name": "Servicios", "item": "https://dafel.com.mx/#servicios"},
              {"@type": "ListItem", "position": 3, "name": "Pasivos Laborales", "item": "https://dafel.com.mx/pasivos-laborales"}
            ]
          },
          "about": [
            "Pasivos Laborales México",
            "Prima de Antigüedad", 
            "Indemnizaciones Laborales",
            "Valuación Actuarial NIF D-3"
          ],
          "keywords": "pasivos laborales mexico, valuacion actuarial, prima antiguedad, indemnizaciones, NIF D-3, auditoria externa"
        })
      }} />
      {children}
    </>
  );
}