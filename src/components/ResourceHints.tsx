'use client';

import Head from 'next/head';
import { useEffect } from 'react';

interface ResourceHintsProps {
  // Critical resources to preload
  preloadResources?: Array<{
    href: string;
    as: 'script' | 'style' | 'font' | 'image' | 'fetch';
    type?: string;
    crossOrigin?: 'anonymous' | 'use-credentials';
  }>;
  // DNS prefetching for external domains
  dnsPrefetch?: string[];
  // Resource prefetching for likely navigation
  prefetchResources?: string[];
  // Preconnect to external origins
  preconnect?: Array<{
    href: string;
    crossOrigin?: 'anonymous' | 'use-credentials';
  }>;
}

export default function ResourceHints({
  preloadResources = [],
  dnsPrefetch = [],
  prefetchResources = [],
  preconnect = []
}: ResourceHintsProps) {
  useEffect(() => {
    // Dynamic resource preloading based on user interaction
    const handleUserInteraction = () => {
      // Preload likely-to-be-needed resources after user interaction
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = '/studio'; // Likely next page
      document.head.appendChild(link);
      
      // Remove event listeners after first interaction
      document.removeEventListener('mouseenter', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };

    document.addEventListener('mouseenter', handleUserInteraction, { once: true });
    document.addEventListener('touchstart', handleUserInteraction, { once: true });

    return () => {
      document.removeEventListener('mouseenter', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, []);

  // Default optimizations for Dafel Technologies
  const defaultPreconnect = [
    { href: 'https://fonts.googleapis.com', crossOrigin: 'anonymous' as const },
    { href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' as const },
    { href: 'https://api.dafel-technologies.com' },
    ...preconnect
  ];

  const defaultDnsPrefetch = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://api.dafel-technologies.com',
    ...dnsPrefetch
  ];

  const defaultPreload = [
    {
      href: '/_next/static/media/inter-latin-400-normal.woff2',
      as: 'font' as const,
      type: 'font/woff2',
      crossOrigin: 'anonymous' as const,
    },
    {
      href: '/favicon.svg',
      as: 'image' as const,
    },
    ...preloadResources
  ];

  return (
    <Head>
      {/* DNS prefetch hints */}
      {defaultDnsPrefetch.map((href) => (
        <link key={href} rel="dns-prefetch" href={href} />
      ))}

      {/* Preconnect hints */}
      {defaultPreconnect.map((resource) => (
        <link
          key={resource.href}
          rel="preconnect"
          href={resource.href}
          crossOrigin={resource.crossOrigin}
        />
      ))}

      {/* Critical resource preloads */}
      {defaultPreload.map((resource) => (
        <link
          key={resource.href}
          rel="preload"
          href={resource.href}
          as={resource.as}
          type={resource.type}
          crossOrigin={resource.crossOrigin}
        />
      ))}

      {/* Resource prefetching */}
      {prefetchResources.map((href) => (
        <link key={href} rel="prefetch" href={href} />
      ))}

      {/* Module preload for modern browsers */}
      <link
        rel="modulepreload"
        href="/_next/static/chunks/main.js"
      />
      
      {/* Viewport meta for mobile optimization */}
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, viewport-fit=cover"
      />
      
      {/* Theme color for browser UI */}
      <meta name="theme-color" content="#3B82F6" />
      
      {/* Optimized favicon */}
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      <link rel="icon" href="/favicon.ico" sizes="32x32" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      
      {/* Web app manifest */}
      <link rel="manifest" href="/manifest.json" />
    </Head>
  );
}