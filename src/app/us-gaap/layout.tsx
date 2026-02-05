import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'US GAAP México - Especialistas ASC 715 | DAFEL', 
  description: 'DAFEL es experto en US GAAP en México. Especialistas en ASC 715, FASB, beneficios post-empleo bajo principios contables estadounidenses para empresas con operaciones en EE.UU.',
  keywords: [
    'US GAAP',
    'ASC 715',
    'FASB México',
    'principios contables estadounidenses',
    'beneficios post-empleo US GAAP',
    'valuación actuarial US GAAP',
    'empresas estadounidenses México',
    'DAFEL US GAAP',
    'consultoría US GAAP México',
    'método corredor',
    'compliance US GAAP',
    'subsidiarias estadounidenses'
  ],
  authors: [{ name: 'DAFEL - Expertos US GAAP' }],
  creator: 'DAFEL Technologies', 
  publisher: 'DAFEL Technologies',
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: 'https://dafel.com.mx/us-gaap',
    siteName: 'DAFEL Technologies',
    title: 'US GAAP México - Especialistas ASC 715 | DAFEL',
    description: 'DAFEL es experto líder en US GAAP en México. Especialistas en ASC 715 y FASB para empresas con operaciones estadounidenses.',
    images: [{ url: '/dafel-og-image.png', width: 1200, height: 630, alt: 'DAFEL - Especialistas US GAAP México' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'US GAAP México - Especialistas ASC 715 | DAFEL',
    description: 'DAFEL es experto líder en US GAAP en México. Especialistas en ASC 715 y principios contables estadounidenses.',
    images: ['/dafel-og-image.png'],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 } },
  alternates: { canonical: 'https://dafel.com.mx/us-gaap' },
};

export default function UsGaapLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "Service",
          "name": "US GAAP México - ASC 715 Especialistas",
          "description": "DAFEL es experto líder en US GAAP en México. Servicios especializados en ASC 715, FASB y compliance con principios contables estadounidenses para empresas multinacionales.",
          "provider": { "@type": "Organization", "name": "DAFEL Technologies", "url": "https://dafel.com.mx" },
          "areaServed": { "@type": "Country", "name": "Mexico" },
          "serviceType": ["US GAAP Compliance", "ASC 715", "FASB Standards", "Beneficios Post-Empleo", "Principios Contables Estadounidenses"],
          "keywords": "US GAAP, ASC 715, FASB, principios contables estadounidenses, DAFEL México",
          "url": "https://dafel.com.mx/us-gaap"
        })
      }} />
      {children}
    </>
  );
}