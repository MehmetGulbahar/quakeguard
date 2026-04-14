const CACHE_VERSION = "quakeguard-v1";
const APP_SHELL_CACHE = `${CACHE_VERSION}-app-shell`;
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const API_CACHE = `${CACHE_VERSION}-api`;
const TILE_CACHE = `${CACHE_VERSION}-tiles`;
const META_CACHE = `${CACHE_VERSION}-meta`;
const META_LATEST_EARTHQUAKE = "/__quakeguard/latest-earthquake";
const APP_SHELL = [
  "/",
  "/list",
  "/map",
  "/info",
  "/offline",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/icons/icon-512x512-maskable.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(APP_SHELL_CACHE).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => ![APP_SHELL_CACHE, STATIC_CACHE, API_CACHE, TILE_CACHE].includes(key))
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const networkPromise = fetch(request)
    .then((response) => {
      if (response && response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => undefined);

  return cached || networkPromise || Response.error();
}

async function networkFirst(request, cacheName, fallbackUrl) {
  const cache = await caches.open(cacheName);

  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }

    if (fallbackUrl) {
      const fallback = await caches.match(fallbackUrl);
      if (fallback) {
        return fallback;
      }
    }

    return Response.error();
  }
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) {
    return cached;
  }

  const response = await fetch(request);
  if (response && response.ok) {
    cache.put(request, response.clone());
  }
  return response;
}

async function readLatestEarthquakeMeta() {
  const cache = await caches.open(META_CACHE);
  const response = await cache.match(META_LATEST_EARTHQUAKE);

  if (!response) {
    return null;
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
}

async function writeLatestEarthquakeMeta(meta) {
  const cache = await caches.open(META_CACHE);
  await cache.put(
    META_LATEST_EARTHQUAKE,
    new Response(JSON.stringify(meta), {
      headers: {
        "Content-Type": "application/json",
      },
    }),
  );
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== "GET") {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request, APP_SHELL_CACHE, "/offline"));
    return;
  }

  if (url.pathname.startsWith("/api/earthquakes")) {
    event.respondWith(staleWhileRevalidate(request, API_CACHE));
    return;
  }

  if (url.hostname.includes("tile.openstreetmap.org")) {
    event.respondWith(staleWhileRevalidate(request, TILE_CACHE));
    return;
  }

  const destination = request.destination;
  if (["style", "script", "font", "image"].includes(destination)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(staleWhileRevalidate(request, APP_SHELL_CACHE));
  }
});

self.addEventListener("push", (event) => {
  const payload = event.data ? event.data.json() : {};
  const title = payload.title || "QuakeGuard Acil Uyari";
  const body = payload.body || "Yeni bir deprem bildirimi var.";

  const options = {
    body,
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-192x192.png",
    data: {
      url: payload.url || "/list",
    },
    tag: payload.tag || "quakeguard-alert",
    renotify: true,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data?.url || "/";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      const existingClient = windowClients.find((client) => client.url.includes(self.location.origin));
      if (existingClient) {
        existingClient.focus();
        existingClient.navigate(url);
        return;
      }

      return clients.openWindow(url);
    })
  );
});

self.addEventListener("sync", (event) => {
  if (event.tag === "sync-earthquakes") {
    event.waitUntil(
      fetch("/api/earthquakes?source=all")
        .then((response) => response.json())
        .then(async (earthquakes) => {
          if (Array.isArray(earthquakes) && earthquakes.length > 0) {
            const latest = earthquakes[0];
            const previous = await readLatestEarthquakeMeta();

            if (previous?.id && previous.id !== latest.id) {
              await self.registration.showNotification("Son 5 dakika icinde deprem kaydedildi", {
                body: `${latest.location || "Turkiye"} ${Number(latest.magnitude || 0).toFixed(1)}`,
                icon: "/icons/icon-192x192.png",
                badge: "/icons/icon-192x192.png",
                tag: "earthquake-sync-alert",
                data: {
                  url: "/list",
                },
              });
            }

            await writeLatestEarthquakeMeta({
              id: latest.id,
              updatedAt: Date.now(),
            });
          }

          return clients.matchAll({ includeUncontrolled: true, type: "window" }).then((clientList) => {
            clientList.forEach((client) => client.postMessage({ type: "EARTHQUAKE_SYNC_COMPLETED" }));
          });
        })
        .catch(() => undefined)
    );
  }
});

self.addEventListener("periodicsync", (event) => {
  if (event.tag === "periodic-earthquake-refresh") {
    event.waitUntil(
      fetch("/api/earthquakes?source=all")
        .then((response) => response.json())
        .then((earthquakes) => {
          if (Array.isArray(earthquakes) && earthquakes.length > 0) {
            return writeLatestEarthquakeMeta({
              id: earthquakes[0].id,
              updatedAt: Date.now(),
            });
          }
          return undefined;
        })
        .catch(() => undefined)
    );
  }
});
