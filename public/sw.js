const CACHE = 'cashia-v1'

// Recursos que ficam em cache para funcionar offline
const STATIC = [
  '/',
  '/dashboard',
  '/offline',
]

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(STATIC)).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (e) => {
  const { request } = e
  const url = new URL(request.url)

  // Ignora requisições de API e externas
  if (url.pathname.startsWith('/api/') || url.origin !== self.location.origin) return

  // Estratégia: Network first → fallback cache → offline page
  e.respondWith(
    fetch(request)
      .then((res) => {
        // Armazena páginas HTML no cache
        if (request.destination === 'document' && res.ok) {
          const clone = res.clone()
          caches.open(CACHE).then((c) => c.put(request, clone))
        }
        return res
      })
      .catch(() =>
        caches.match(request).then((cached) => cached ?? caches.match('/offline'))
      )
  )
})
