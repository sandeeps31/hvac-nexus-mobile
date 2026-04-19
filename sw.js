/* ============================================================
   HVAC NEXUS MOBILE — sw.js
   Service Worker: offline caching + background sync
   ============================================================ */

var CACHE_NAME = 'hvacnexus-mobile-v26';

// Files to cache for offline use
var PRECACHE = [
  '/',
  '/index.html',
  '/app.css',
  '/app.js',
  '/db.js',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap'
];

// ── Install: pre-cache shell ───────────────────────────────
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(PRECACHE);
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

// ── Activate: clean old caches ─────────────────────────────
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) { return key !== CACHE_NAME; })
            .map(function(key)   { return caches.delete(key); })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// ── Fetch: cache-first for shell, network-first for API ───
self.addEventListener('fetch', function(event) {
  var url = event.request.url;

  // Don't intercept Supabase API calls — always go to network
  if (url.indexOf('supabase.co') !== -1 || url.indexOf('supabase.io') !== -1) {
    event.respondWith(
      fetch(event.request).catch(function() {
        // Return empty JSON on failure so pages can handle gracefully
        return new Response(JSON.stringify({ data: null, error: { message: 'Offline' } }), {
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }

  // Don't intercept POST/PUT/DELETE — these go through the sync queue
  if (event.request.method !== 'GET') return;

  // Cache-first for app shell assets
  event.respondWith(
    caches.match(event.request).then(function(cached) {
      if (cached) return cached;
      return fetch(event.request).then(function(response) {
        // Cache new GET requests for app assets
        if (response && response.status === 200 && response.type === 'basic') {
          var cloned = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, cloned);
          });
        }
        return response;
      }).catch(function() {
        // If offline and not cached, return the cached index as fallback
        return caches.match('/index.html');
      });
    })
  );
});

// ── Background Sync (when supported) ──────────────────────
self.addEventListener('sync', function(event) {
  if (event.tag === 'hvacnexus-sync') {
    event.waitUntil(
      self.clients.matchAll().then(function(clients) {
        clients.forEach(function(client) {
          client.postMessage({ type: 'SYNC_REQUESTED' });
        });
      })
    );
  }
});

