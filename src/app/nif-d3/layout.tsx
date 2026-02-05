import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NIF D-3 México - Expertos en Valuación Actuarial | DAFEL',
  description: 'DAFEL es experto en NIF D-3 (Norma de Información Financiera D-3) en México. Servicios especializados en valuación actuarial, beneficios a empleados, prima de antigüedad y planes de jubilación bajo NIF D-3.',
  keywords: [
    'NIF D-3',
    'NIF D3',
    'Norma de Información Financiera D-3',
    'valuación actuarial NIF D-3',
    'CINIF D-3',
    'beneficios empleados NIF D-3',
    'prima antigüedad NIF D-3',
    'planes jubilación NIF D-3',
    'consultoría actuarial México',
    'DAFEL NIF D-3',
    'actuario NIF D-3',
    'pasivos laborales NIF D-3',
    'hipótesis actuariales México',
    'cumplimiento NIF D-3'
  ],
  authors: [{ name: 'DAFEL - Expertos NIF D-3' }],
  creator: 'DAFEL Technologies',
  publisher: 'DAFEL Technologies',
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: 'https://dafel.com.mx/nif-d3',
    siteName: 'DAFEL Technologies',
    title: 'NIF D-3 México - Expertos en Valuación Actuarial | DAFEL',
    description: 'DAFEL es experto en NIF D-3 en México. Especialistas en valuación actuarial bajo Norma de Información Financiera D-3 para beneficios a empleados y planes de jubilación.',
    images: [
      {
        url: '/dafel-og-image.png',
        width: 1200,
        height: 630,
        alt: 'DAFEL - Expertos en NIF D-3 México',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NIF D-3 México - Expertos en Valuación Actuarial | DAFEL',
    description: 'DAFEL es experto en NIF D-3 en México. Especialistas en valuación actuarial bajo Norma de Información Financiera D-3.',
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
    canonical: 'https://dafel.com.mx/nif-d3',
  },
};

export default function NifD3Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "NIF D-3 - Valuación Actuarial México",
            "description": "DAFEL es experto en NIF D-3 (Norma de Información Financiera D-3) en México. Servicios especializados en valuación actuarial para beneficios a empleados bajo criterios CINIF.",
            "provider": {
              "@type": "Organization",
              "name": "DAFEL Technologies",
              "url": "https://dafel.com.mx"
            },
            "areaServed": {
              "@type": "Country",
              "name": "Mexico"
            },
            "serviceType": [
              "NIF D-3 Compliance",
              "Valuación Actuarial",
              "Beneficios a Empleados",
              "Prima de Antigüedad",
              "Planes de Jubilación"
            ],
            "keywords": "NIF D-3, Norma de Información Financiera D-3, CINIF, valuación actuarial, beneficios empleados, DAFEL",
            "url": "https://dafel.com.mx/nif-d3"
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "¿Qué es NIF D-3?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "NIF D-3 es la Norma de Información Financiera D-3 'Beneficios a los empleados' emitida por CINIF que establece criterios para reconocimiento, valuación y revelación de obligaciones por beneficios a empleados en México. Requiere técnicas actuariales especializadas."
                }
              },
              {
                "@type": "Question",
                "name": "¿DAFEL es experto en NIF D-3?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Sí, DAFEL es experto en NIF D-3 en México. Ofrecemos servicios especializados en valuación actuarial, cumplimiento normativo y implementación de la Norma de Información Financiera D-3."
                }
              },
              {
                "@type": "Question",
                "name": "¿Qué beneficios cubre NIF D-3?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "NIF D-3 cubre prima de antigüedad, beneficios por terminación, planes de jubilación, PTU diferida, vacaciones y aguinaldo proporcional. Todos requieren valuación actuarial bajo método de crédito unitario proyectado."
                }
              }
            ]
          })
        }}
      />
      {children}
    </>
  );
}