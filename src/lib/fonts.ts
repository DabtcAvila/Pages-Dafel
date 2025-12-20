import { DM_Sans, DM_Mono } from 'next/font/google';

// Optimized DM Sans font loading with preload and fallback
export const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  weight: ['300', '400', '500', '600', '700'],
  fallback: [
    'system-ui',
    '-apple-system', 
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Helvetica Neue',
    'Arial',
    'sans-serif'
  ],
  adjustFontFallback: true,
  variable: '--font-sans',
});

export const dmMono = DM_Mono({
  subsets: ['latin'],
  display: 'swap',
  preload: false, // Only load when needed for code/mono text
  weight: ['300', '400', '500'],
  fallback: [
    'Menlo',
    'Monaco',
    'Consolas',
    'Liberation Mono',
    'Courier New',
    'monospace'
  ],
  adjustFontFallback: true,
  variable: '--font-mono',
});

// Legacy exports for backwards compatibility
export const inter = dmSans;
export const jetbrainsMono = dmMono;

// Font preload helpers for critical above-the-fold content
export const fontPreloadLinks = [
  {
    rel: 'preload',
    href: '/_next/static/media/dm-sans-latin-400-normal.woff2',
    as: 'font',
    type: 'font/woff2',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'preload', 
    href: '/_next/static/media/dm-sans-latin-600-normal.woff2',
    as: 'font',
    type: 'font/woff2',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'preload', 
    href: '/_next/static/media/dm-sans-latin-700-normal.woff2',
    as: 'font',
    type: 'font/woff2',
    crossOrigin: 'anonymous',
  },
];

// Font display optimization
export const fontOptimizationCSS = `
  /* DM Sans font loading optimization */
  @font-face {
    font-family: 'DM Sans';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url('/_next/static/media/dm-sans-latin-400-normal.woff2') format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }
  
  @font-face {
    font-family: 'DM Sans';
    font-style: normal;
    font-weight: 600;
    font-display: swap;
    src: url('/_next/static/media/dm-sans-latin-600-normal.woff2') format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }
  
  /* Optimized fallback font metrics matching for DM Sans */
  @font-face {
    font-family: 'DM Sans Fallback';
    font-style: normal;
    font-weight: 400;
    src: local('Arial'), local('Helvetica Neue');
    ascent-override: 92.78%;
    descent-override: 24.49%;
    line-gap-override: 0.00%;
    size-adjust: 105.20%;
  }
`;