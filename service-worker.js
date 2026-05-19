const CACHE_NAME = 'capped-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// Install event: Caches the HTML and manifest files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event: Cleans up old caches if you update the app later
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Fetch event: Crucial for app installation. Serves cached files offline.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return the cached file if we have it, otherwise fetch from the network
      return cachedResponse || fetch(event.request);
    })
  );
});
