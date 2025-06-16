
const CACHE_NAME = 'programming-tutorials-v1';
const OFFLINE_CACHE = 'tutorials-offline-v1';

const urlsToCache = [
  '/tutorial/',
  '/tutorial/index.html',
  '/tutorial/styles.css',
  '/tutorial/app.js',
  '/tutorial/manifest.json',
  '/tutorial/github/',
  '/tutorial/python/',
  '/tutorial/java/',
  '/tutorial/cpp/',
  '/tutorial/csharp/',
  '/tutorial/c/',
  '/tutorial/android/',
  '/tutorial/assets/icon-192.png',
  '/tutorial/assets/icon-512.png',
  '/tutorial/assets/logo.svg',
  '/tutorial/assets/favicon.ico'
];

// Install service worker and cache resources
self.addEventListener('install', function(event) {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      }),
      caches.open(OFFLINE_CACHE).then(function(cache) {
        return cache.add('/tutorial/offline.html');
      })
    ])
  );
  self.skipWaiting();
});

// Fetch from cache when offline
self.addEventListener('fetch', function(event) {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(function(response) {
        // Check if valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        caches.open(CACHE_NAME)
          .then(function(cache) {
            cache.put(event.request, responseToCache);
          });

        return response;
      })
      .catch(function() {
        // Return cached version or offline page
        return caches.match(event.request)
          .then(function(response) {
            if (response) {
              return response;
            }
            
            // For navigation requests, return offline page
            if (event.request.mode === 'navigate') {
              return caches.match('/tutorial/offline.html');
            }
            
            // For other requests, return a basic response
            return new Response('Content not available offline', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// Update service worker
self.addEventListener('activate', function(event) {
  const cacheWhitelist = [CACHE_NAME, OFFLINE_CACHE];
  
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for when back online
self.addEventListener('sync', function(event) {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Sync any pending data when back online
  return Promise.resolve();
}

// Push notification support
self.addEventListener('push', function(event) {
  const options = {
    body: event.data ? event.data.text() : 'New programming content available!',
    icon: '/tutorial/assets/icon-192.png',
    badge: '/tutorial/assets/icon-72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore', 
        title: 'View Tutorials',
        icon: '/tutorial/assets/icon-72.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/tutorial/assets/icon-72.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Programming Tutorials Pro', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/tutorial/')
    );
  }
});

// Handle errors
self.addEventListener('error', function(event) {
  console.log('Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', function(event) {
  console.log('Service Worker unhandled promise rejection:', event.reason);
});
