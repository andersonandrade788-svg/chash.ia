const CACHE = 'cashia-v2'

// Só cacheia assets estáticos — NUNCA páginas autenticadas
const STATIC_ASSETS = ['/logo.jpg', '/offline']

self.addEventListener('install', (e) => {
  e.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', (e) => {
  // Limpa caches antigos
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (e) => {
  const { request } = e
  const url = new URL(request.url)

  // Deixa passar: APIs, autenticação, páginas do app (requerem auth)
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/dashboard') ||
    url.pathname.startsWith('/ebook') ||
    url.pathname.startsWith('/curso') ||
    url.pathname.startsWith('/chat') ||
    url.pathname.startsWith('/oferta') ||
    url.pathname.startsWith('/agentes') ||
    url.pathname.startsWith('/planos') ||
    url.pathname.startsWith('/callback') ||
    url.origin !== self.location.origin
  ) {
    return // Não intercepta — deixa o browser lidar normalmente
  }

  // Para assets estáticos: cache first
  e.respondWith(
    caches.match(request).then((cached) => cached ?? fetch(request))
  )
})
