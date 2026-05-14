const CACHE_NAME = 'madventure-cache-v1';
const OFFLINE_URL = '/emergency';

const APP_SHELL = [
  '/',
  '/index.html',
  '/emergency',
  '/explore',
  '/smart-planner',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // You would list your bundled CSS/JS here in a real PWA framework like Vite
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Don't fail the whole install if one file fails. Map and catch them.
      return Promise.all(
        APP_SHELL.map((url) => 
            cache.add(url).catch(err => console.log('Failed to cache:', url, err))
        )
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request).then((networkResponse) => {
        // Cache dynamically on the fly based on user browsing
        return caches.open(CACHE_NAME).then((cache) => {
            // Only cache valid standard http/https responses
            if (event.request.url.startsWith('http') && networkResponse.ok) {
                cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
        });
      }).catch(() => {
        // If fetch fails (offline) and not in cache, fallback to offline URL for HTML requests
        if (event.request.mode === 'navigate') {
          return caches.match(OFFLINE_URL);
        }
      });
    })
  );
});
