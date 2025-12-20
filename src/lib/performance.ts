// Performance monitoring for Core Web Vitals
export interface WebVitalsMetric {
  name: 'CLS' | 'FID' | 'FCP' | 'LCP' | 'TTFB';
  value: number;
  delta: number;
  entries: PerformanceEntry[];
  id: string;
  rating: 'good' | 'needs-improvement' | 'poor';
}

// Thresholds for Core Web Vitals
const VITALS_THRESHOLDS = {
  CLS: { good: 0.1, poor: 0.25 },
  FID: { good: 100, poor: 300 },
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 }
};

// Get rating for a metric
function getRating(name: WebVitalsMetric['name'], value: number): WebVitalsMetric['rating'] {
  const thresholds = VITALS_THRESHOLDS[name];
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.poor) return 'needs-improvement';
  return 'poor';
}

// Web Vitals tracking
export function trackWebVitals(metric: WebVitalsMetric) {
  const { name, value, rating } = metric;
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`Web Vital - ${name}:`, {
      value: Math.round(value),
      rating,
      threshold: VITALS_THRESHOLDS[name]
    });
  }
  
  // Send to analytics in production
  if (process.env.NODE_ENV === 'production') {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', name, {
        custom_map: {
          metric_value: value,
          metric_rating: rating
        },
        value: Math.round(value),
        metric_id: metric.id,
      });
    }
    
    // Send to your analytics service
    sendToAnalytics({
      event: 'web_vital',
      metric: name,
      value: Math.round(value),
      rating,
      url: window.location.pathname
    });
  }
}

// Performance observer for tracking custom metrics
export function observePerformance() {
  if (typeof window === 'undefined') return;
  
  try {
    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as any;
      
      if (lastEntry) {
        trackWebVitals({
          name: 'LCP',
          value: lastEntry.startTime,
          delta: lastEntry.startTime,
          entries,
          id: 'lcp',
          rating: getRating('LCP', lastEntry.startTime)
        });
      }
    });
    
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    
    // First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        trackWebVitals({
          name: 'FID',
          value: entry.processingStart - entry.startTime,
          delta: entry.processingStart - entry.startTime,
          entries: [entry],
          id: 'fid',
          rating: getRating('FID', entry.processingStart - entry.startTime)
        });
      });
    });
    
    fidObserver.observe({ entryTypes: ['first-input'] });
    
    // First Contentful Paint
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          trackWebVitals({
            name: 'FCP',
            value: entry.startTime,
            delta: entry.startTime,
            entries: [entry],
            id: 'fcp',
            rating: getRating('FCP', entry.startTime)
          });
        }
      });
    });
    
    fcpObserver.observe({ entryTypes: ['paint'] });
    
  } catch (error) {
    console.warn('Performance observation failed:', error);
  }
}

// Track Cumulative Layout Shift
export function trackCLS() {
  if (typeof window === 'undefined') return;
  
  let clsValue = 0;
  let clsEntries: PerformanceEntry[] = [];
  
  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as any) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          clsEntries.push(entry);
        }
      }
    });
    
    observer.observe({ entryTypes: ['layout-shift'] });
    
    // Report CLS when the page becomes hidden
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden' && clsValue > 0) {
        trackWebVitals({
          name: 'CLS',
          value: clsValue,
          delta: clsValue,
          entries: clsEntries,
          id: 'cls',
          rating: getRating('CLS', clsValue)
        });
      }
    });
    
  } catch (error) {
    console.warn('CLS tracking failed:', error);
  }
}

// Send data to analytics service
async function sendToAnalytics(data: any) {
  try {
    // Replace with your analytics endpoint
    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        url: window.location.href
      }),
    });
  } catch (error) {
    console.warn('Failed to send analytics:', error);
  }
}

// Resource timing analysis
export function analyzeResourceTiming() {
  if (typeof window === 'undefined' || !window.performance) return;
  
  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  
  const analysis = {
    totalResources: resources.length,
    slowResources: resources.filter(r => r.duration > 1000),
    largeResources: resources.filter(r => r.transferSize && r.transferSize > 100000),
    cachedResources: resources.filter(r => r.transferSize === 0),
    compressionRatio: 0
  };
  
  // Calculate compression ratio
  const totalTransfer = resources.reduce((sum, r) => sum + (r.transferSize || 0), 0);
  const totalDecodedSize = resources.reduce((sum, r) => sum + (r.decodedBodySize || 0), 0);
  
  if (totalDecodedSize > 0) {
    analysis.compressionRatio = (totalDecodedSize - totalTransfer) / totalDecodedSize;
  }
  
  if (process.env.NODE_ENV === 'development') {
    console.log('Resource Analysis:', analysis);
  }
  
  return analysis;
}

// Initialize all performance monitoring
export function initPerformanceMonitoring() {
  if (typeof window === 'undefined') return;
  
  // Wait for page to be interactive
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        observePerformance();
        trackCLS();
        analyzeResourceTiming();
      }, 100);
    });
  } else {
    observePerformance();
    trackCLS();
    analyzeResourceTiming();
  }
}