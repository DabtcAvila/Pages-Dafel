import type { Metadata, Viewport } from 'next';
import '../styles/globals.css';
import { LanguageProvider } from '@/contexts/LanguageContext';

export const metadata: Metadata = {
  metadataBase: new URL('https://dafel.com.mx'),
  title: {
    default: 'Dafel Technologies - Consultoría Actuarial y Beneficios Corporativos',
    template: '%s | Dafel Technologies'
  },
  description: 'Consultoría empresarial especializada en planes de beneficios corporativos, obligaciones laborales y gestión de riesgos. Expertos en NIF D-3, IFRS-19 y US GAAP.',
  keywords: [
    'consultoría actuarial',
    'beneficios corporativos', 
    'planes de pensiones',
    'NIF D-3',
    'IFRS-19',
    'US GAAP',
    'pasivos laborales',
    'prima de antigüedad',
    'indemnizaciones',
    'previsión social',
    'administración de riesgos',
    'trámites IMSS',
    'asesoría fiscal',
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
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
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
        url: '/dafel-logo-optimized.svg',
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
    images: ['/dafel-logo-optimized.svg'],
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
        
        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Dafel Technologies",
              "alternateName": "Dafel Consulting",
              "url": "https://dafel.com.mx",
              "logo": "https://dafel.com.mx/dafel-logo-optimized.svg",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+52-55-1234-5678",
                "contactType": "customer service",
                "areaServed": "MX",
                "availableLanguage": "Spanish"
              },
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "MX"
              },
              "description": "Consultoría empresarial especializada en planes de beneficios corporativos, obligaciones laborales y gestión de riesgos.",
              "foundingDate": "2020",
              "industry": "Consulting Services",
              "numberOfEmployees": "10-50"
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
              "name": "Dafel Technologies - Consultoría Actuarial",
              "image": "https://dafel.com.mx/dafel-logo-optimized.svg",
              "description": "Consultoría especializada en valuación bajo NIF D-3, IFRS-19 y USGAAP. Servicios de pasivos laborales, prima de antigüedad, indemnizaciones y planes de jubilación.",
              "priceRange": "$$",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "MX"
              },
              "url": "https://dafel.com.mx",
              "telephone": "+52-55-1234-5678",
              "serviceType": [
                "Consultoría Actuarial",
                "Beneficios Corporativos", 
                "Gestión de Riesgos",
                "Planes de Pensiones",
                "Asesoría Fiscal"
              ],
              "areaServed": {
                "@type": "Country",
                "name": "Mexico"
              }
            })
          }}
        />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/dafel-logo-optimized.svg" as="image" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased">
        <LanguageProvider>
          {children}
        </LanguageProvider>
        
        {/* Analytics Script Placeholder */}
        {process.env.NODE_ENV === 'production' && (
          <>
            {/* Google Analytics */}
            <script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID" />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', 'GA_TRACKING_ID', {
                    page_title: document.title,
                    page_location: window.location.href,
                  });
                `,
              }}
            />
          </>
        )}
      </body>
    </html>
  );
}