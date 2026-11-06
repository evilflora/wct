/* Service worker: offline support. Strategy "network first, cache fallback", so users get the newest files whenever they are online. */

const CACHE_PREFIX = "wct-cache-";

self.WF = self.WF || {};
try {
  importScripts("js/version.js");
} catch (error) {
  console.error("[SW] Unable to load js/version.js:", error);
}

const CACHE_VERSION = String(self.WF.version || "0");
const CACHE_NAME = `${CACHE_PREFIX}${CACHE_VERSION}`;

const NETWORK_TIMEOUT_MS = 4000;

const PRECACHE_URLS = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "img/icon-192.png",
  "img/icon-512.png",
  "css/min/style.min.css",
  "img/favicon.ico",
  "js/min/version.min.js",
  "js/data/min/data_generated.min.js",
  "js/min/constants.min.js",
  "js/min/logs.min.js",
  "js/min/toast.min.js",
  "js/min/update-check.min.js",
  "js/min/patchnotes.min.js",
  "js/min/storage.min.js",
  "js/min/options.min.js",
  "js/min/theme.min.js",
  "js/min/mastery.min.js",
  "js/min/ui-state.min.js",
  "js/min/export-import.min.js",
  "js/min/render.min.js",
  "js/min/main.min.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(PRECACHE_URLS.map((url) => new Request(url, { cache: "reload" })));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter((name) => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME).map((name) => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  if (new URL(request.url).origin !== self.location.origin) return;

  event.respondWith(networkFirst(event));
});

function fetchWithTimeout(request, timeoutMs) {
  const networkPromise = fetch(request);
  if (!timeoutMs) return networkPromise;

  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error("Network timeout")), timeoutMs);
  });
  return Promise.race([networkPromise, timeout]).finally(() => clearTimeout(timer));
}

async function findCached(cache, request) {
  if (request.mode !== "navigate") return cache.match(request);
  return (await cache.match(request, { ignoreSearch: true })) ?? cache.match("index.html");
}

async function networkFirst(event) {
  const { request } = event;
  const cache = await caches.open(CACHE_NAME);
  const cached = await findCached(cache, request);

  try {
    const response = await fetchWithTimeout(request, cached ? NETWORK_TIMEOUT_MS : 0);

    if (!response.ok && response.status >= 500 && cached) return cached;

    if (response.ok && response.type === "basic" && !response.redirected) {
      event.waitUntil(cache.put(request, response.clone()).catch((err) => console.warn("[SW] Cache write failed:", err)));
    }
    return response;
  } catch (err) {
    if (cached) return cached;
    throw err;
  }
}