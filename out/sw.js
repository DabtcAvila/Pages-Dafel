// Dafel Technologies Service Worker - Ultra Performance Caching
// Version: 2.0.0 - Enterprise Optimized

const CACHE_VERSION = '2.0.0';
const CACHE_NAME = `dafel-v${CACHE_VERSION}`;
const STATIC_CACHE = `dafel-static-v${CACHE_VERSION}`;
const RUNTIME_CACHE = `dafel-runtime-v${CACHE_VERSION}`;
const IMAGE_CACHE = `dafel-images-v${CACHE_VERSION}`;
const API_CACHE = `dafel-api-v${CACHE_VERSION}`;

// Cache size limits (in bytes)
const CACHE_LIMITS = {
  static: 50 * 1024 * 1024, // 50MB
  runtime: 30 * 1024 * 1024, // 30MB
  images: 100 * 1024 * 1024, // 100MB
  api: 10 * 1024 * 1024 // 10MB
};

// Resources to cache immediately
const PRECACHE_URLS = [
  '/',
  '/login',
  '/favicon.svg',
  '/favicon.ico',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Critical resources that must be cached
const CRITICAL_RESOURCES = [
  '/_next/static/css/',
  '/_next/static/chunks/framework',
  '/_next/static/chunks/main',
  '/_next/static/chunks/pages'
];

// Cache strategies configuration
const CACHE_STRATEGIES = {
  '/': 'networkFirst',
  '/login': 'networkFirst', 
  '/studio': 'networkFirst',
  '/_next/static/': 'cacheFirst',
  '/api/': 'networkOnly',
  '/favicon': 'cacheFirst',
  '/icon': 'cacheFirst',
  '/manifest.json': 'cacheFirst'
};

// Install event - precache critical resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Service Worker: Precaching static resources');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE && cacheName !== RUNTIME_CACHE) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - intelligent caching strategy
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Determine caching strategy based on request type
  let strategy = 'staleWhileRevalidate'; // default
  
  for (const [pattern, strategyName] of Object.entries(CACHE_STRATEGIES)) {
    if (url.pathname.startsWith(pattern)) {
      strategy = strategyName;
      break;
    }
  }

  // Handle different types of requests with optimized strategies
  if (request.destination === 'document') {
    // Network first for HTML pages
    event.respondWith(networkFirst(request));
  } else if (request.destination === 'image') {
    // Advanced image caching
    event.respondWith(cacheImage(request));
  } else if (request.url.includes('/_next/static/')) {
    // Cache first for static assets (they're immutable)
    event.respondWith(cacheFirst(request));
  } else if (request.url.includes('/api/')) {
    // Intelligent API caching
    event.respondWith(cacheAPI(request));
  } else if (request.destination === 'font') {
    // Long-term cache for fonts
    event.respondWith(cacheFirst(request));
  } else if (request.destination === 'style' || request.destination === 'script') {
    // Cache first for CSS/JS with fallback
    event.respondWith(cacheFirst(request));
  } else {
    // Stale while revalidate for other resources
    event.respondWith(staleWhileRevalidate(request));
  }
});

// Network first strategy (for HTML pages)
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache:', error);
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Offline', { status: 503 });
  }
}

// Cache first strategy (for static assets)
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Failed to fetch:', request.url, error);
    return new Response('Resource not available', { status: 404 });
  }
}

// Stale while revalidate strategy
async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);
  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.ok) {
      const cache = caches.open(RUNTIME_CACHE);
      cache.then(c => c.put(request, networkResponse.clone()));
    }
    return networkResponse;
  }).catch(() => cachedResponse);

  return cachedResponse || fetchPromise;
}

// Advanced image caching with compression detection
async function cacheImage(request) {
  const cache = await caches.open(IMAGE_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok && networkResponse.headers.get('content-type')?.includes('image')) {
      // Check cache size before storing
      await manageCacheSize(IMAGE_CACHE, CACHE_LIMITS.images);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Return offline placeholder for images
    return new Response(
      '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f3f4f6"/><text x="100" y="100" text-anchor="middle" fill="#9ca3af">Offline</text></svg>',
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  }
}

// Cache size management
async function manageCacheSize(cacheName, maxSize) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  let totalSize = 0;
  
  // Calculate current cache size
  for (const key of keys) {
    const response = await cache.match(key);
    if (response) {
      const size = parseInt(response.headers.get('content-length') || '0');
      totalSize += size;
    }
  }
  
  // Remove oldest entries if over limit
  if (totalSize > maxSize) {
    const entriesToRemove = Math.ceil(keys.length * 0.1); // Remove 10% oldest
    for (let i = 0; i < entriesToRemove; i++) {
      await cache.delete(keys[i]);
    }
  }
}

// Intelligent API caching
async function cacheAPI(request) {
  const url = new URL(request.url);
  const isGET = request.method === 'GET';
  const isPublicAPI = url.pathname.includes('/api/public/');
  
  if (!isGET || !isPublicAPI) {
    return fetch(request);
  }
  
  const cache = await caches.open(API_CACHE);
  const cachedResponse = await cache.match(request);
  
  // Check if cached response is still fresh (5 minutes)
  if (cachedResponse) {
    const cachedDate = new Date(cachedResponse.headers.get('date') || 0);
    const now = new Date();
    const age = (now.getTime() - cachedDate.getTime()) / 1000;
    
    if (age < 300) { // 5 minutes
      return cachedResponse;
    }
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      await manageCacheSize(API_CACHE, CACHE_LIMITS.api);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return cachedResponse || new Response('{"error": "Offline"}', {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Background sync for critical actions
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Handle background sync tasks
  console.log('Background sync triggered');
}

// Push notifications support
self.addEventListener('push', event => {
  if (!event.data) return;

  const options = {
    body: event.data.text(),
    icon: '/icon-192.png',
    badge: '/favicon-32.png',
    tag: 'dafel-notification',
    requireInteraction: true
  };

  event.waitUntil(
    self.registration.showNotification('Dafel Technologies', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});