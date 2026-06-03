const CACHE_NAME = "tnvs-cache-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/favicon.png",
  "/manifest.webmanifest"
];

// Install Event - Pre-cache offline core shells
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event - Clean up stale caches
self.addEventListener("activate", (e) => {
  e.waitUntil(
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
  self.clients.claim();
});

// Fetch Event - Hybrid Network-First & Cache-First Strategies
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);

  // HTML Page Navigation -> Network-First (stay fresh, fallback to offline shell)
  if (e.request.mode === "navigate") {
    e.respondWith(
      fetch(e.request).catch(() => {
        return caches.match("/");
      })
    );
    return;
  }

  // Static Assets -> Cache-First with Network Fallback (speed & offline utility)
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(e.request).then((networkResponse) => {
        // Skip caching dynamic non-GET/API requests or huge video streams safely
        if (
          !networkResponse || 
          networkResponse.status !== 200 || 
          networkResponse.type !== "basic" || 
          e.request.method !== "GET" || 
          url.pathname.endsWith(".mp4")
        ) {
          return networkResponse;
        }
        
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, responseToCache);
        });

        return networkResponse;
      });
    })
  );
});
