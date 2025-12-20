'use client';

import { useEffect } from 'react';
import { initPerformanceMonitoring } from '@/lib/performance';

export default function PerformanceMonitor() {
  useEffect(() => {
    // Initialize performance monitoring
    initPerformanceMonitoring();
    
    // Set up Web Vitals reporting
    if (typeof window !== 'undefined' && 'performance' in window) {
      // Monitor page load performance
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          
          if (perfData) {
            const metrics = {
              dns: perfData.domainLookupEnd - perfData.domainLookupStart,
              tcp: perfData.connectEnd - perfData.connectStart,
              ssl: perfData.secureConnectionStart ? perfData.connectEnd - perfData.secureConnectionStart : 0,
              ttfb: perfData.responseStart - perfData.requestStart,
              download: perfData.responseEnd - perfData.responseStart,
              domParse: perfData.domContentLoadedEventStart - perfData.responseEnd,
              domReady: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
              loadEvent: perfData.loadEventEnd - perfData.loadEventStart,
              total: perfData.loadEventEnd - perfData.navigationStart
            };
            
            // Log performance metrics in development
            if (process.env.NODE_ENV === 'development') {
              console.log('Performance Metrics:', metrics);
              console.log('Page Load Timeline:', {
                'DNS Lookup': `${metrics.dns}ms`,
                'TCP Connection': `${metrics.tcp}ms`,
                'SSL Negotiation': `${metrics.ssl}ms`,
                'Time to First Byte': `${metrics.ttfb}ms`,
                'Download': `${metrics.download}ms`,
                'DOM Parse': `${metrics.domParse}ms`,
                'DOM Ready': `${metrics.domReady}ms`,
                'Load Event': `${metrics.loadEvent}ms`,
                'Total Time': `${metrics.total}ms`
              });
            }
          }
        }, 0);
      });
      
      // Monitor memory usage (if available)
      if ('memory' in performance) {
        const checkMemory = () => {
          const memory = (performance as any).memory;
          if (memory && process.env.NODE_ENV === 'development') {
            console.log('Memory Usage:', {
              used: `${Math.round(memory.usedJSHeapSize / 1048576)}MB`,
              total: `${Math.round(memory.totalJSHeapSize / 1048576)}MB`,
              limit: `${Math.round(memory.jsHeapSizeLimit / 1048576)}MB`
            });
          }
        };
        
        // Check memory periodically
        setInterval(checkMemory, 30000); // Every 30 seconds
      }
    }
  }, []);

  // Only render in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div 
      style={{ 
        position: 'fixed', 
        top: 10, 
        right: 10, 
        background: 'rgba(0,0,0,0.8)', 
        color: 'white', 
        padding: '8px 12px', 
        fontSize: '12px', 
        borderRadius: '4px',
        fontFamily: 'monospace',
        zIndex: 9999,
        display: process.env.NODE_ENV === 'development' ? 'block' : 'none'
      }}
    >
      Performance Monitor Active
    </div>
  );
}