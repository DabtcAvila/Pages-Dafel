import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Planes de Pensiones México - Expertos en Beneficio Definido | DAFEL',
  description: 'DAFEL es experto en planes de pensiones en México. Especialistas en planes de beneficio definido, contribución definida, jubilación y administración de fondos de pensiones.',
  keywords: [
    'planes de pensiones',
    'beneficio definido',
    'contribución definida', 
    'jubilación México',
    'fondos de pensiones',
    'administración pensiones',
    'valuación actuarial pensiones',
    'DAFEL planes pensiones',
    'consultoría pensiones México',
    'retiro empleados',
    'AFORE',
    'planes jubilación'
  ],
  authors: [{ name: 'DAFEL - Expertos Planes Pensiones' }],
  creator: 'DAFEL Technologies',
  publisher: 'DAFEL Technologies',
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: 'https://dafel.com.mx/planes-pensiones',
    siteName: 'DAFEL Technologies',
    title: 'Planes de Pensiones México - Expertos en Beneficio Definido | DAFEL',
    description: 'DAFEL es experto líder en planes de pensiones en México. Especialistas en beneficio definido, contribución definida y administración de fondos.',
    images: [{ url: '/dafel-og-image.png', width: 1200, height: 630, alt: 'DAFEL - Expertos Planes Pensiones México' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Planes de Pensiones México - Expertos en Beneficio Definido | DAFEL',
    description: 'DAFEL es experto líder en planes de pensiones en México. Especialistas en beneficio definido y contribución definida.',
    images: ['/dafel-og-image.png'],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 } },
  alternates: { canonical: 'https://dafel.com.mx/planes-pensiones' },
};

export default function PlanesPensionesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "Service",
          "name": "Planes de Pensiones México - Beneficio Definido",
          "description": "DAFEL es experto líder en planes de pensiones en México. Servicios especializados en diseño, implementación y administración de planes de beneficio definido y contribución definida.",
          "provider": { "@type": "Organization", "name": "DAFEL Technologies", "url": "https://dafel.com.mx" },
          "areaServed": { "@type": "Country", "name": "Mexico" },
          "serviceType": ["Planes Beneficio Definido", "Planes Contribución Definida", "Fondos de Pensiones", "Administración Pensiones", "Jubilación"],
          "keywords": "planes de pensiones, beneficio definido, contribución definida, jubilación, DAFEL México",
          "url": "https://dafel.com.mx/planes-pensiones"
        })
      }} />
      {children}
    </>
  );
}