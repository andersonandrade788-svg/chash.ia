'use client'

import { useEffect, useRef, useState } from 'react'

export function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    // Tenta iniciar após interação do usuário (política de autoplay)
    const play = () => v.play().catch(() => {})
    play()
    document.addEventListener('click', play, { once: true })
    return () => document.removeEventListener('click', play, play as EventListenerOptions)
  }, [])

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Vídeo de fundo */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
        style={{ opacity: loaded ? 1 : 0 }}
        src="/fundo%20espaco.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onCanPlay={() => setLoaded(true)}
      />

      {/* Fallback: cosmic-bg fica visível enquanto vídeo carrega */}
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{ opacity: loaded ? 0 : 1, background: '#03010a' }}
      />

      {/* Overlay principal — escurece o vídeo sem sufocar */}
      <div
        className="absolute inset-0"
        style={{
          background: 'rgba(3,1,10,0.78)',
        }}
      />

      {/* Overlay de vinheta nas bordas — foca o olhar no centro */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 120% 100% at 50% 50%, transparent 40%, rgba(3,1,10,0.55) 100%)',
        }}
      />

      {/* Overlay de cor roxa para identidade da marca */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 20% 20%, rgba(168,85,247,0.07) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 70%, rgba(56,189,248,0.05) 0%, transparent 55%)',
        }}
      />

      {/* Grid sutil por cima do vídeo */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(168,85,247,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  )
}
