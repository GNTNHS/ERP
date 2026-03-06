// My TNS — Service Worker v1.0
const CACHE_NAME = 'mytns-v1';

// Files to cache for offline use
const CACHE_FILES = [
  "/ERP/login.html",
  "/ERP/dashboard.html",
  "/ERP/students.html",
  "/ERP/attendance.html",
  "/ERP/faculty.html",
  "/ERP/faculty-attendance.html",
  "/ERP/timetable.html",
  "/ERP/labs.html",
  "/ERP/library.html",
  "/ERP/bookbank.html",
  "/ERP/movement.html",
  "/ERP/finance.html",
  "/ERP/sports.html",
  "/ERP/media.html",
  "/ERP/examination.html",
  "/ERP/manifest.json",
  "/ERP/icon-192x192.png",
  "/ERP/icon-512x512.png"
];

// Install — cache all files
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(CACHE_FILES);
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

// Activate — clean old caches
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) { return key !== CACHE_NAME; })
            .map(function(key) { return caches.delete(key); })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// Fetch — serve from cache first, then network
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      if (cached) return cached;
      return fetch(e.request).then(function(response) {
        // Cache new requests dynamically
        if (response && response.status === 200) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(e.request, clone);
          });
        }
        return response;
      }).catch(function() {
        // Offline fallback
        return caches.match("/ERP/login.html");
      });
    })
  );
});
