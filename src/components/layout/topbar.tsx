'use client'

import Image from 'next/image'
import { Bell, Zap, Menu } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { Profile } from '@/types/database'

interface TopbarProps {
  profile: Profile | null
  onMenuClick?: () => void
}

export function Topbar({ profile, onMenuClick }: TopbarProps) {
  const initials = profile?.name
    ? profile.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : profile?.email?.[0]?.toUpperCase() ?? 'U'

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'
  const firstName = profile?.name?.split(' ')[0] ?? 'Empreendedor'

  const usedPct = profile
    ? Math.round((profile.generations_used / profile.generations_limit) * 100)
    : 0

  return (
    <header
      className="h-14 flex items-center justify-between px-4 md:px-6 shrink-0 relative"
      style={{
        background: 'rgba(5,3,14,0.92)',
        backdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(168,85,247,0.1)',
      }}
    >
      {/* Horizontal neon line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

      {/* Left — mobile menu + greeting */}
      <div className="flex items-center gap-3">
        {/* Hamburger + logo mobile */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={onMenuClick}
            className="w-8 h-8 rounded-lg border border-purple-500/20 bg-purple-500/5 flex items-center justify-center hover:border-purple-400/40 hover:bg-purple-500/10 transition-all"
          >
            <Menu className="w-4 h-4 text-purple-400" />
          </button>
          <Image src="/logo.jpg" alt="Cash.IA" width={90} height={28} className="object-contain h-7 w-auto" />
        </div>

        <div>
          <p className="text-sm font-medium text-white/90">
            {greeting}, <span className="gradient-cash-text font-bold">{firstName}</span>
            <span className="ml-1.5 text-yellow-400">⚡</span>
          </p>
          <p className="text-[10px] cyber-text mt-0.5 hidden sm:block">CASH.IA — PLATAFORMA DE PRODUTOS DIGITAIS</p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 md:gap-3">

        {/* Generations meter — trial only, hidden on very small screens */}
        {profile?.plan === 'trial' && (
          <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-purple-500/20 bg-purple-500/5">
            <Zap className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <div>
              <div className="flex items-center justify-between gap-4 mb-0.5">
                <span className="text-[10px] text-purple-300/60">Gerações</span>
                <span className="text-[10px] font-bold text-purple-300">
                  {profile.generations_used}/{profile.generations_limit}
                </span>
              </div>
              <div className="w-24 h-1 bg-purple-900/50 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${usedPct}%`,
                    background: usedPct > 75
                      ? 'linear-gradient(90deg,#f59e0b,#ef4444)'
                      : 'linear-gradient(90deg,#9333ea,#38bdf8)',
                    boxShadow: '0 0 6px rgba(168,85,247,0.6)',
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Pro badge */}
        {profile?.plan === 'pro' && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-yellow-500/30 bg-yellow-500/8">
            <span className="text-yellow-400 text-xs font-bold">✦ PRO</span>
            <span className="text-[10px] text-yellow-400/60">ILIMITADO</span>
          </div>
        )}

        {/* Notification bell */}
        <button className="relative w-8 h-8 rounded-lg border border-purple-500/15 bg-purple-500/5 flex items-center justify-center hover:border-purple-400/30 hover:bg-purple-500/10 transition-all group">
          <Bell className="w-3.5 h-3.5 text-purple-400/60 group-hover:text-purple-300 transition-colors" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-purple-500" style={{ boxShadow: '0 0 6px #a855f7' }} />
        </button>

        {/* Avatar */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-purple-500/30 blur-md animate-pulse-neon" />
          <Avatar className="w-8 h-8 border border-purple-500/40 relative">
            <AvatarImage src={profile?.avatar_url ?? undefined} />
            <AvatarFallback
              className="text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg,#9333ea,#38bdf8)' }}
            >
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
