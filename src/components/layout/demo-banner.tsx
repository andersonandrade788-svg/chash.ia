import { Zap } from 'lucide-react'

export function DemoBanner() {
  return (
    <div
      className="w-full px-4 py-1.5 flex items-center justify-center gap-2 text-xs shrink-0"
      style={{
        background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.12), rgba(251,146,60,0.1), rgba(251,191,36,0.12), transparent)',
        borderBottom: '1px solid rgba(251,191,36,0.2)',
      }}
    >
      <div className="w-1 h-1 rounded-full bg-yellow-400 animate-pulse" />
      <Zap className="w-3 h-3 text-yellow-400 shrink-0" />
      <span style={{ color: '#9b8cc0' }}>
        <span className="font-bold tracking-wider" style={{ color: '#fbbf24' }}>MODO DEMO</span>
        {' '}— Dados simulados. Configure suas APIs para usar a IA real.
      </span>
    </div>
  )
}
