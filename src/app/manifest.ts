import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Cash.IA — Produtos Digitais com IA',
    short_name: 'Cash.IA',
    description: 'Crie ebooks, cursos e ofertas prontos para vender com inteligência artificial.',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#03010a',
    theme_color: '#a855f7',
    orientation: 'portrait',
    categories: ['business', 'productivity'],
    lang: 'pt-BR',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: 'Criar eBook',
        url: '/ebook',
        description: 'Gere um ebook completo com IA',
      },
      {
        name: 'Chat IA',
        url: '/chat',
        description: 'Converse com Claude, GPT e Gemini',
      },
      {
        name: 'Criar Oferta',
        url: '/oferta',
        description: 'Gere copy e criativos para vender',
      },
    ],
    screenshots: [],
  }
}
