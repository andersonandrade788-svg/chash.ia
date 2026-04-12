'use client'

import { useEffect, useState } from 'react'
import { Download, X, Smartphone } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function PWAInit() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showBanner, setShowBanner] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Registra o service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {/* silencia erros em dev */})
    }

    // Verifica se já foi instalado ou dispensado antes
    const wasDismissed = localStorage.getItem('pwa-dismissed')
    if (wasDismissed) return

    // Detecta iOS (Safari não suporta beforeinstallprompt)
    const ios = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase())
    const standalone = window.matchMedia('(display-mode: standalone)').matches
    if (ios && !standalone) {
      setIsIOS(true)
      setTimeout(() => setShowBanner(true), 3000)
      return
    }

    // Android / Chrome — captura evento de instalação
    const handler = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)
      setTimeout(() => setShowBanner(true), 2000)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  function dismiss() {
    setShowBanner(false)
    setDismissed(true)
    localStorage.setItem('pwa-dismissed', '1')
  }

  async function install() {
    if (!installPrompt) return
    await installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') setShowBanner(false)
    setInstallPrompt(null)
  }

  if (!showBanner || dismissed) return null

  return (
    <div
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:w-80 z-50 rounded-2xl p-4 shadow-2xl"
      style={{
        background: 'rgba(13,11,26,0.95)',
        border: '1px solid rgba(168,85,247,0.3)',
        backdropFilter: 'blur(24px)',
        boxShadow: '0 0 40px rgba(168,85,247,0.2), 0 20px 60px rgba(0,0,0,0.5)',
      }}
    >
      {/* Close */}
      <button
        onClick={dismiss}
        className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
        style={{ color: '#a094c0' }}
      >
        <X className="w-3.5 h-3.5" />
      </button>

      <div className="flex items-start gap-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg,#9333ea,#38bdf8)', boxShadow: '0 0 20px rgba(168,85,247,0.4)' }}
        >
          <Smartphone className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 pr-4">
          <p className="text-sm font-semibold text-white">Instalar Cash.IA</p>
          <p className="text-xs mt-0.5 leading-relaxed" style={{ color: '#9b8cc0' }}>
            {isIOS
              ? 'Toque em  ⬆  e depois "Adicionar à Tela de Início" para instalar.'
              : 'Instale o app para acesso rápido, mesmo sem abrir o navegador.'}
          </p>
        </div>
      </div>

      {!isIOS && installPrompt && (
        <button
          onClick={install}
          className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: 'linear-gradient(135deg,#9333ea,#6366f1,#38bdf8)' }}
        >
          <Download className="w-4 h-4" />
          Instalar agora
        </button>
      )}
    </div>
  )
}
