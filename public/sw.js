// GIRI-PRAHARI Service Worker — Offline & Disaster Blackout Engine
const CACHE_NAME = 'giri-prahari-offline-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
];

// 1. Install Event: Cache Core App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching core offline shell assets');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[Service Worker] Asset pre-cache notice:', err);
      });
    })
  );
  self.skipWaiting();
});

// 2. Activate Event: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Fetch Event: Network-First with Cache Fallback (Ensures full Airplane Mode operation)
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Ignore POST requests, Supabase auth, or external non-GET requests
  if (request.method !== 'GET') return;

  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        // If response is valid, update local cache
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(async () => {
        // NETWORK FAILED (AIRPLANE MODE / OFFLINE)
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }

        // If navigating to a page offline, serve the cached root index.html
        if (request.mode === 'navigate') {
          const rootCached = await caches.match('/');
          if (rootCached) return rootCached;
          const indexCached = await caches.match('/index.html');
          if (indexCached) return indexCached;
        }

        return new Response('Offline — GIRI-PRAHARI Mesh Cache Active', {
          status: 200,
          headers: { 'Content-Type': 'text/plain' },
        });
      })
  );
});
