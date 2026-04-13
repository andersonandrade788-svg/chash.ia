'use client'

export function VideoBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">

      {/* Fundo base escuro */}
      <div className="absolute inset-0" style={{ background: '#03010a' }} />

      {/* Estrelas animadas — camada 1 (pequenas) */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(1px 1px at 10% 15%, rgba(255,255,255,0.6) 0%, transparent 100%), radial-gradient(1px 1px at 25% 40%, rgba(255,255,255,0.4) 0%, transparent 100%), radial-gradient(1px 1px at 40% 10%, rgba(255,255,255,0.5) 0%, transparent 100%), radial-gradient(1px 1px at 55% 60%, rgba(255,255,255,0.3) 0%, transparent 100%), radial-gradient(1px 1px at 70% 25%, rgba(255,255,255,0.6) 0%, transparent 100%), radial-gradient(1px 1px at 85% 75%, rgba(255,255,255,0.4) 0%, transparent 100%), radial-gradient(1px 1px at 15% 80%, rgba(255,255,255,0.5) 0%, transparent 100%), radial-gradient(1px 1px at 60% 90%, rgba(255,255,255,0.3) 0%, transparent 100%), radial-gradient(1px 1px at 90% 45%, rgba(255,255,255,0.5) 0%, transparent 100%), radial-gradient(1px 1px at 35% 70%, rgba(255,255,255,0.4) 0%, transparent 100%), radial-gradient(1px 1px at 78% 12%, rgba(255,255,255,0.6) 0%, transparent 100%), radial-gradient(1px 1px at 5% 55%, rgba(255,255,255,0.3) 0%, transparent 100%), radial-gradient(1px 1px at 50% 35%, rgba(255,255,255,0.5) 0%, transparent 100%), radial-gradient(1px 1px at 95% 88%, rgba(255,255,255,0.4) 0%, transparent 100%), radial-gradient(1px 1px at 20% 95%, rgba(255,255,255,0.3) 0%, transparent 100%)',
        animation: 'twinkle1 6s ease-in-out infinite alternate',
      }} />

      {/* Estrelas — camada 2 (médias, outro ritmo) */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(1.5px 1.5px at 8% 30%, rgba(255,255,255,0.5) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 45% 55%, rgba(255,255,255,0.4) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 72% 8%, rgba(255,255,255,0.6) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 88% 60%, rgba(255,255,255,0.3) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 30% 20%, rgba(255,255,255,0.5) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 65% 85%, rgba(255,255,255,0.4) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 12% 65%, rgba(255,255,255,0.6) 0%, transparent 100%), radial-gradient(2px 2px at 55% 15%, rgba(168,85,247,0.7) 0%, transparent 100%), radial-gradient(2px 2px at 80% 40%, rgba(56,189,248,0.6) 0%, transparent 100%), radial-gradient(2px 2px at 22% 50%, rgba(168,85,247,0.5) 0%, transparent 100%)',
        animation: 'twinkle2 8s ease-in-out infinite alternate',
      }} />

      {/* Nebulosa roxa — canto superior esquerdo */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 70% 60% at 15% 20%, rgba(120,40,200,0.18) 0%, transparent 70%)',
        animation: 'nebula 12s ease-in-out infinite alternate',
      }} />

      {/* Nebulosa azul — canto inferior direito */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 60% 50% at 85% 80%, rgba(30,90,220,0.12) 0%, transparent 70%)',
        animation: 'nebula 15s ease-in-out infinite alternate-reverse',
      }} />

      {/* Nebulosa rosa — centro */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 40% 30% at 50% 50%, rgba(168,85,247,0.06) 0%, transparent 70%)',
        animation: 'nebula 10s ease-in-out infinite alternate',
      }} />

      {/* Vinheta nas bordas */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 130% 110% at 50% 50%, transparent 35%, rgba(3,1,10,0.7) 100%)',
      }} />

      {/* Grid sutil */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'linear-gradient(rgba(168,85,247,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.025) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

    </div>
  )
}
