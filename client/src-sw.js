const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { CacheFirst } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const {  } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');
const { ExpirationPlugin } = require('workbox-expiration');
const { NetworkFirst } = require('workbox-strategies');


precacheAndRoute(self.__WB_MANIFEST);

const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});

registerRoute(({ request }) => request.mode === 'navigate', pageCache);

// TODO: Implement asset caching
registerRoute();

const { StaleWhileRevalidate } = require('workbox-strategies');

// Create a cache strategy for images
const imageCache = new CacheFirst({
  cacheName: 'image-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      maxEntries: 50,
    }),
  ],
});

// Create a cache strategy for scripts and styles with StaleWhileRevalidate 
// since they might change more frequently and you want to ensure the user gets the latest version on subsequent visits
const scriptStyleCache = new StaleWhileRevalidate({
  cacheName: 'script-style-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 60 * 60 * 24 * 7, // 7 Days
    }),
  ],
});

// Cache routes for images
registerRoute(
  ({ request }) => request.destination === 'image',
  imageCache
);

// Cache routes for scripts and styles
registerRoute(
  ({ request }) => request.destination === 'script' || request.destination === 'style',
  scriptStyleCache
);



offlineFallback({
  // Use a 'network-first' strategy for navigation requests.
  strategy: new NetworkFirst({
    cacheName: 'pages',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 10,
      }),
    ],
  }),
  // Use precached offline page as fallback.
  fallbackURL: '/offline.html',
});
