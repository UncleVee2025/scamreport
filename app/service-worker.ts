/// <reference lib="webworker" />

// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules, or add any other
// code you'd like.

declare const self: ServiceWorkerGlobalScope

const CACHE_NAME = "scamreport-namibia-v1"
const OFFLINE_URL = "/offline"

// Add an event listener to install the service worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME)
      // Cache the offline page
      await cache.add(new Request(OFFLINE_URL, { cache: "reload" }))
      // Cache essential assets
      await cache.addAll(["/", "/images/logo.png", "/dashboard", "/login", "/register", "/emergency"])
    })(),
  )
  // Force the waiting service worker to become the active service worker
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Enable navigation preload if it's supported
      if ("navigationPreload" in self.registration) {
        await self.registration.navigationPreload.enable()
      }

      // Clean up old caches
      const cacheNames = await caches.keys()
      await Promise.all(
        cacheNames.filter((cacheName) => cacheName !== CACHE_NAME).map((cacheName) => caches.delete(cacheName)),
      )
    })(),
  )
  // Tell the active service worker to take control of the page immediately
  self.clients.claim()
})

self.addEventListener("fetch", (event) => {
  // Only handle GET requests
  if (event.request.method !== "GET") return

  // For API requests, use network-first strategy
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(JSON.stringify({ error: "You are offline" }), {
          status: 503,
          headers: { "Content-Type": "application/json" },
        })
      }),
    )
    return
  }

  // For page navigations, use a cache-first strategy
  if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          // First, try to use the navigation preload response if it's supported
          const preloadResponse = await event.preloadResponse
          if (preloadResponse) {
            return preloadResponse
          }

          // Always try the network first
          return await fetch(event.request)
        } catch (error) {
          // If the network is unavailable, get from the cache
          const cache = await caches.open(CACHE_NAME)
          const cachedResponse = await cache.match(event.request)
          if (cachedResponse) {
            return cachedResponse
          }

          // If we can't get from the cache, return the offline page
          return await cache.match(OFFLINE_URL)
        }
      })(),
    )
    return
  }

  // For all other requests, use a stale-while-revalidate strategy
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME)
      const cachedResponse = await cache.match(event.request)

      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          cache.put(event.request, networkResponse.clone())
          return networkResponse
        })
        .catch(() => {
          // If fetch fails and we don't have a cached response, return a simple offline message
          if (!cachedResponse) {
            if (event.request.headers.get("Accept")?.includes("text/html")) {
              return cache.match(OFFLINE_URL)
            }
            return new Response("Offline", { status: 503 })
          }
          return cachedResponse
        })

      return cachedResponse || fetchPromise
    })(),
  )
})
