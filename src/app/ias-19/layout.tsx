import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IAS-19 México - Especialistas en IAS 19 | DAFEL',
  description: 'DAFEL es experto en IAS-19 (IAS 19) en México. Servicios especializados en valuación actuarial internacional, beneficios post-empleo y compliance con estándares IASB para empresas multinacionales.',
  keywords: [
    'IAS-19',
    'IFRS 19', 
    'IAS 19',
    'International Financial Reporting Standards',
    'valuación actuarial IAS-19',
    'beneficios post-empleo IFRS',
    'IASB México',
    'estándares internacionales contables',
    'OCI actuarial',
    'empresas multinacionales México',
    'DAFEL IAS-19',
    'consultoría IFRS México',
    'compliance IAS-19',
    'método crédito unitario proyectado'
  ],
  authors: [{ name: 'DAFEL - Expertos IAS-19' }],
  creator: 'DAFEL Technologies',
  publisher: 'DAFEL Technologies',
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: 'https://dafel.com.mx/ias-19',
    siteName: 'DAFEL Technologies',
    title: 'IAS-19 México - Especialistas en IAS 19 | DAFEL',
    description: 'DAFEL es experto líder en IAS-19 (IAS 19) en México. Especialistas en valuación actuarial internacional bajo estándares IASB para beneficios post-empleo.',
    images: [
      {
        url: '/dafel-og-image.png',
        width: 1200,
        height: 630,
        alt: 'DAFEL - Especialistas IAS-19 México',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IAS-19 México - Especialistas en IAS 19 | DAFEL',
    description: 'DAFEL es experto líder en IAS-19 (IAS 19) en México. Especialistas en valuación actuarial internacional bajo estándares IASB.',
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
    canonical: 'https://dafel.com.mx/ias-19',
  },
};

export default function Ifrs19Layout({
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
            "name": "IAS-19 - Valuación Actuarial Internacional México",
            "description": "DAFEL es experto líder en IAS-19 (IAS 19) en México. Servicios especializados en valuación actuarial internacional bajo estándares IASB para beneficios post-empleo y empresas multinacionales.",
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
              "IAS-19 Compliance",
              "IAS 19 Valuación",
              "Valuación Actuarial Internacional",
              "Beneficios Post-Empleo",
              "Estándares IASB"
            ],
            "keywords": "IAS-19, IAS 19, International Financial Reporting Standards, valuación actuarial internacional, IASB, DAFEL",
            "url": "https://dafel.com.mx/ias-19"
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
                "name": "¿Qué es IAS-19?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "IAS-19 (antes IAS 19) es el estándar internacional de contabilidad que regula los beneficios a empleados, emitido por IASB. Establece reconocimiento inmediato en OCI y método de crédito unitario proyectado obligatorio."
                }
              },
              {
                "@type": "Question",
                "name": "¿DAFEL es experto en IAS-19?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Sí, DAFEL es reconocido como experto líder en IAS-19 (IAS 19) en México. Ofrecemos servicios especializados para empresas multinacionales que requieren compliance con estándares IASB."
                }
              },
              {
                "@type": "Question",
                "name": "¿Diferencia entre IAS-19 y NIF D-3?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "IAS-19 es el estándar internacional (IASB) con reconocimiento inmediato en OCI, mientras NIF D-3 es la norma mexicana (CINIF) que permite el método corredor. DAFEL es experto en ambas normativas."
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