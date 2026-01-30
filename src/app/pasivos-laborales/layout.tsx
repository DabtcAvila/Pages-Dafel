import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pasivos Laborales México - Valuación Actuarial NIF D-3 | DAFEL',
  description: 'DAFEL ofrece valuación actuarial de pasivos laborales en México. Especialistas en prima de antigüedad, indemnizaciones y obligaciones laborales bajo NIF D-3, IAS-19 y US GAAP.',
  keywords: [
    'pasivos laborales',
    'pasivos laborales mexico',
    'valuacion pasivos laborales',
    'pasivos laborales nif d-3',
    'prima de antigüedad',
    'prima antiguedad mexico',
    'indemnizaciones México',
    'indemnizaciones laborales',
    'PTU diferida',
    'obligaciones laborales',
    'obligaciones laborales mexico',
    'beneficios empleados México',
    'valuación actuarial pasivos',
    'valuacion actuarial mexico',
    'estudios actuariales pasivos',
    'DAFEL pasivos laborales',
    'consultoría laboral México',
    'consultoria actuarial pasivos',
    'Ley Federal Trabajo',
    'terminación laboral',
    'provision pasivos laborales',
    'provisiones laborales',
    'pasivos laborales empresa',
    'actuario pasivos laborales',
    'calculo pasivos laborales',
    'valuacion prima antiguedad'
  ],
  authors: [{ name: 'DAFEL - Expertos Pasivos Laborales' }],
  creator: 'DAFEL Technologies',
  publisher: 'DAFEL Technologies',
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
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 } },
  alternates: { canonical: 'https://dafel.com.mx/pasivos-laborales' },
};

export default function PasivosLaboralesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
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
      {children}
    </>
  );
}