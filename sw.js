
const CACHE_NAME = 'programming-tutorials-v2';
const OFFLINE_CACHE = 'tutorials-offline-v2';
const DYNAMIC_CACHE = 'tutorials-dynamic-v2';

const urlsToCache = [
  '/tutorial/',
  '/tutorial/index.html',
  '/tutorial/styles.css',
  '/tutorial/app.js',
  '/tutorial/manifest.json',
  '/tutorial/offline.html',
  '/tutorial/404.html',
  '/tutorial/500.html',
  '/tutorial/403.html',
  '/tutorial/README.md',
  '/tutorial/SECURITY.md',
  '/tutorial/assets/icon-192.png',
  '/tutorial/assets/icon-512.png',
  '/tutorial/assets/logo.svg',
  '/tutorial/assets/favicon.ico',
  '/tutorial/assets/favicon.svg',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap'
];

const criticalRoutes = [
  '/tutorial/github/',
  '/tutorial/python/',
  '/tutorial/java/',
  '/tutorial/cpp/',
  '/tutorial/csharp/',
  '/tutorial/c/',
  '/tutorial/android/'
];

// Install service worker and cache resources
self.addEventListener('install', function(event) {
  console.log('Service Worker installing');
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then(function(cache) {
        console.log('Opened main cache');
        return cache.addAll(urlsToCache);
      }),
      caches.open(OFFLINE_CACHE).then(function(cache) {
        console.log('Opened offline cache');
        return cache.addAll([
          '/tutorial/offline.html',
          '/tutorial/404.html',
          '/tutorial/500.html',
          '/tutorial/403.html'
        ]);
      })
    ])
  );
  self.skipWaiting();
});

// Activate service worker and clean up old caches
self.addEventListener('activate', function(event) {
  console.log('Service Worker activating');
  const cacheWhitelist = [CACHE_NAME, OFFLINE_CACHE, DYNAMIC_CACHE];
  
  event.waitUntil(
    Promise.all([
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Immediately claim all clients
      self.clients.claim()
    ])
  );
});

// Enhanced fetch strategy with multiple caching approaches
self.addEventListener('fetch', function(event) {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!event.request.url.startsWith('http')) {
    return;
  }

  // Skip analytics and tracking requests
  if (event.request.url.includes('analytics') || 
      event.request.url.includes('tracking') ||
      event.request.url.includes('gtag')) {
    return;
  }

  const requestUrl = new URL(event.request.url);
  const isNavigationRequest = event.request.mode === 'navigate';
  const isCriticalResource = urlsToCache.some(url => event.request.url.includes(url));
  const isSameOrigin = requestUrl.origin === location.origin;

  if (isNavigationRequest) {
    // Network first for navigation requests with fallback
    event.respondWith(handleNavigationRequest(event.request));
  } else if (isCriticalResource) {
    // Cache first for critical resources
    event.respondWith(handleCriticalResource(event.request));
  } else if (requestUrl.hostname === 'fonts.googleapis.com' || 
             requestUrl.hostname === 'fonts.gstatic.com') {
    // Cache first for fonts
    event.respondWith(handleFontRequest(event.request));
  } else if (isSameOrigin) {
    // Stale while revalidate for same-origin resources
    event.respondWith(handleSameOriginRequest(event.request));
  } else {
    // Network first for external resources
    event.respondWith(handleExternalRequest(event.request));
  }
});

async function handleNavigationRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Network failed for navigation, trying cache');
    
    // Try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Try index.html for SPA routing
    const indexResponse = await caches.match('/tutorial/index.html');
    if (indexResponse) {
      return indexResponse;
    }
    
    // Fallback to offline page
    return caches.match('/tutorial/offline.html');
  }
}

async function handleCriticalResource(request) {
  // Cache first strategy
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    // Update cache in background
    updateCacheInBackground(request);
    return cachedResponse;
  }
  
  // Not in cache, fetch from network
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Return offline fallback if available
    return getOfflineFallback(request);
  }
}

async function handleFontRequest(request) {
  // Cache first for fonts (they rarely change)
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Font loading failed:', error);
    return new Response('', { status: 200 });
  }
}

async function handleSameOriginRequest(request) {
  // Stale while revalidate
  const cachedResponse = await caches.match(request);
  
  const networkPromise = fetch(request).then(response => {
    if (response.ok) {
      const cache = caches.open(DYNAMIC_CACHE);
      cache.then(c => c.put(request, response.clone()));
    }
    return response;
  }).catch(() => null);
  
  return cachedResponse || networkPromise || getOfflineFallback(request);
}

async function handleExternalRequest(request) {
  // Network first for external resources
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || getOfflineFallback(request);
  }
}

async function updateCacheInBackground(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse);
    }
  } catch (error) {
    console.log('Background cache update failed:', error);
  }
}

async function getOfflineFallback(request) {
  const url = new URL(request.url);
  
  // Return appropriate offline page based on request
  if (request.mode === 'navigate') {
    return caches.match('/tutorial/offline.html');
  }
  
  // For other requests, return a basic response
  return new Response(
    JSON.stringify({ error: 'Content not available offline' }),
    {
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    }
  );
}

// Background sync for when back online
self.addEventListener('sync', function(event) {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Sync any pending data when back online
    console.log('Background sync triggered');
    
    // Update critical caches
    const cache = await caches.open(CACHE_NAME);
    const promises = urlsToCache.map(url => {
      return fetch(url).then(response => {
        if (response.ok) {
          return cache.put(url, response);
        }
      }).catch(error => {
        console.log('Failed to update cache for:', url, error);
      });
    });
    
    await Promise.all(promises);
    console.log('Background sync completed');
  } catch (error) {
    console.log('Background sync failed:', error);
  }
}

// Enhanced push notification support
self.addEventListener('push', function(event) {
  const options = {
    body: event.data ? event.data.text() : 'New programming content available!',
    icon: '/tutorial/assets/icon-192.png',
    badge: '/tutorial/assets/icon-72.png',
    image: '/tutorial/assets/notification-image.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
      url: '/tutorial/'
    },
    actions: [
      {
        action: 'explore', 
        title: 'View Tutorials',
        icon: '/tutorial/assets/action-explore.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/tutorial/assets/action-close.png'
      }
    ],
    tag: 'programming-tutorials',
    requireInteraction: false,
    silent: false
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
  } else if (event.action === 'close') {
    // Just close the notification
    return;
  } else {
    // Default click action
    event.waitUntil(
      clients.openWindow('/tutorial/')
    );
  }
});

// Handle notification close
self.addEventListener('notificationclose', function(event) {
  console.log('Notification closed:', event.notification.tag);
});

// Message handling for communication with main thread
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      cacheUrls(event.data.urls)
    );
  }
});

async function cacheUrls(urls) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const promises = urls.map(url => {
    return fetch(url).then(response => {
      if (response.ok) {
        return cache.put(url, response);
      }
    }).catch(error => {
      console.log('Failed to cache URL:', url, error);
    });
  });
  
  return Promise.all(promises);
}

// Handle errors
self.addEventListener('error', function(event) {
  console.log('Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', function(event) {
  console.log('Service Worker unhandled promise rejection:', event.reason);
});

// Periodic background sync (if supported)
self.addEventListener('periodicsync', function(event) {
  if (event.tag === 'content-sync') {
    event.waitUntil(doPeriodicSync());
  }
});

async function doPeriodicSync() {
  try {
    console.log('Periodic sync triggered');
    // Update content periodically
    await doBackgroundSync();
  } catch (error) {
    console.log('Periodic sync failed:', error);
  }
}

// Advanced cache management
async function cleanupOldCaches() {
  const cacheNames = await caches.keys();
  const oldCaches = cacheNames.filter(name => 
    name.startsWith('programming-tutorials-') && 
    name !== CACHE_NAME &&
    name !== OFFLINE_CACHE &&
    name !== DYNAMIC_CACHE
  );
  
  return Promise.all(
    oldCaches.map(name => caches.delete(name))
  );
}

// Performance monitoring
function logPerformance(eventType, startTime) {
  const duration = performance.now() - startTime;
  console.log(`SW ${eventType} took ${duration.toFixed(2)}ms`);
}

// Cache size management
async function manageCacheSize(cacheName, maxSize = 50) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  if (keys.length > maxSize) {
    // Remove oldest entries
    const entriesToDelete = keys.slice(0, keys.length - maxSize);
    await Promise.all(
      entriesToDelete.map(key => cache.delete(key))
    );
  }
}

// Cleanup dynamic cache periodically
setInterval(() => {
  manageCacheSize(DYNAMIC_CACHE, 100);
}, 1000 * 60 * 60); // Every hour
