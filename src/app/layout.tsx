import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { PWAInit } from '@/components/pwa/pwa-init'

const fontSans = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
})

const fontMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Cash.IA — Crie produtos digitais que geram dinheiro',
  description:
    'Plataforma SaaS que permite criar ebooks, cursos e ofertas prontos para vender usando inteligência artificial.',
  keywords: ['IA', 'produtos digitais', 'ebook', 'curso online', 'infoproduto', 'SaaS'],
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Cash.IA',
  },
  openGraph: {
    title: 'Cash.IA',
    description: 'Crie produtos digitais que geram dinheiro com IA',
    type: 'website',
  },
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
}

export const viewport: Viewport = {
  themeColor: '#a855f7',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <body className={`${fontSans.variable} ${fontMono.variable} antialiased`}>
        {children}
        <Toaster position="bottom-right" theme="dark" richColors />
        <PWAInit />
      </body>
    </html>
  )
}
