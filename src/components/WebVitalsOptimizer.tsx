'use client';

import { useEffect, useRef, useState } from 'react';
import { trackWebVitals } from '@/lib/performance';

interface WebVitalsOptimizerProps {
  children: React.ReactNode;
  enableCLSPrevention?: boolean;
  enableLCPOptimization?: boolean;
  enableFIDOptimization?: boolean;
}

export default function WebVitalsOptimizer({
  children,
  enableCLSPrevention = true,
  enableLCPOptimization = true,
  enableFIDOptimization = true
}: WebVitalsOptimizerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOptimized, setIsOptimized] = useState(false);

  useEffect(() => {
    // LCP Optimization
    if (enableLCPOptimization) {
      // Preload LCP candidate elements
      const images = document.querySelectorAll('img[data-priority="high"]');
      images.forEach((img) => {
        if (img instanceof HTMLImageElement && img.src) {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = img.src;
          document.head.appendChild(link);
        }
      });
    }

    // CLS Prevention
    if (enableCLSPrevention) {
      // Reserve space for dynamic content
      const dynamicElements = document.querySelectorAll('[data-dynamic]');
      dynamicElements.forEach((element) => {
        if (element instanceof HTMLElement) {
          const minHeight = element.dataset.minHeight;
          if (minHeight) {
            element.style.minHeight = minHeight;
          }
        }
      });

      // Prevent layout shifts from fonts
      document.fonts.ready.then(() => {
        document.body.classList.add('fonts-loaded');
      });
    }

    // FID Optimization
    if (enableFIDOptimization) {
      // Defer non-critical JavaScript
      const deferScripts = () => {
        const scripts = document.querySelectorAll('script[data-defer]');
        scripts.forEach((script) => {
          if (script instanceof HTMLScriptElement) {
            script.defer = true;
          }
        });
      };

      // Use requestIdleCallback for non-critical work
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(deferScripts);
      } else {
        setTimeout(deferScripts, 1);
      }
    }

    setIsOptimized(true);
  }, [enableCLSPrevention, enableLCPOptimization, enableFIDOptimization]);

  useEffect(() => {
    // Monitor and report Web Vitals
    if (isOptimized) {
      // Use the Web Vitals library or custom implementation
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            trackWebVitals({
              name: 'LCP',
              value: entry.startTime,
              delta: entry.startTime,
              entries: [entry],
              id: 'lcp-optimizer',
              rating: entry.startTime <= 2500 ? 'good' : entry.startTime <= 4000 ? 'needs-improvement' : 'poor'
            });
          }
        }
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });

      return () => observer.disconnect();
    }
  }, [isOptimized]);

  return (
    <div ref={containerRef} className="web-vitals-optimized">
      {/* Critical CSS inlined for faster rendering */}
      <style jsx>{`
        .web-vitals-optimized {
          /* Prevent CLS by setting consistent container properties */
          contain: layout style paint;
        }
        
        /* Font loading optimization */
        .fonts-loaded {
          visibility: visible;
        }
        
        /* Prevent FOIT (Flash of Invisible Text) */
        @font-face {
          font-display: swap;
        }
        
        /* Image loading optimization */
        img {
          content-visibility: auto;
          contain-intrinsic-size: 200px 150px;
        }
        
        /* Lazy loading improvements */
        [loading="lazy"] {
          content-visibility: auto;
        }
      `}</style>
      
      {children}
      
      {/* Performance monitoring in development */}
      {process.env.NODE_ENV === 'development' && (
        <div
          style={{
            position: 'fixed',
            bottom: '10px',
            right: '10px',
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '8px',
            fontSize: '12px',
            borderRadius: '4px',
            fontFamily: 'monospace',
            zIndex: 9999,
          }}
        >
          Web Vitals Optimizer: {isOptimized ? 'Active' : 'Loading...'}
        </div>
      )}
    </div>
  );
}

// HOC for automatic Web Vitals optimization
export function withWebVitalsOptimization<P extends object>(
  Component: React.ComponentType<P>
) {
  return function OptimizedComponent(props: P) {
    return (
      <WebVitalsOptimizer>
        <Component {...props} />
      </WebVitalsOptimizer>
    );
  };
}