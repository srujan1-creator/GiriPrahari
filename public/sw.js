// GIRI-PRAHARI Service Worker — Offline & Disaster Blackout Engine (v2)
const CACHE_NAME = 'giri-prahari-v2';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// 1. Install Event: Cache Core App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker v2] Pre-caching core offline shell assets');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[Service Worker v2] Asset pre-cache notice:', err);
      });
    })
  );
  self.skipWaiting();
});

// 2. Activate Event: Wipe old caches immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker v2] Deleting obsolete cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Fetch Event: Only intercept same-origin app shell requests
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Only intercept GET requests
  if (request.method !== 'GET') return;

  // CRITICAL FIX: NEVER intercept external domains (map tiles from Esri/OSM, Supabase, APIs)
  // Let the browser fetch map tiles natively without any Service Worker tampering!
  if (!request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
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

        if (request.mode === 'navigate') {
          const rootCached = await caches.match('/');
          if (rootCached) return rootCached;
          const indexCached = await caches.match('/index.html');
          if (indexCached) return indexCached;
        }

        return new Response('Offline — GIRI-PRAHARI Cache Active', {
          status: 200,
          headers: { 'Content-Type': 'text/plain' },
        });
      })
  );
});
