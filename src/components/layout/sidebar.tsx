'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, BookOpen, GraduationCap, Megaphone,
  MessageSquare, Bot, Zap, Crown, LogOut, ChevronLeft, X,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const navItems = [
  { label: 'Dashboard',         href: '/dashboard', icon: LayoutDashboard },
  { label: 'Gerador de eBook',  href: '/ebook',     icon: BookOpen,       badge: 'CORE' },
  { label: 'Gerador de Curso',  href: '/curso',      icon: GraduationCap },
  { label: 'Gerador de Oferta', href: '/oferta',     icon: Megaphone },
  { label: 'Chat IA',           href: '/chat',       icon: MessageSquare },
  { label: 'Agentes',           href: '/agentes',    icon: Bot },
]

interface SidebarProps {
  plan?: 'trial' | 'pro'
  userName?: string
  /** mobile: controlled externally by layout */
  mobileOpen?: boolean
  onMobileClose?: () => void
}

export function Sidebar({ plan = 'trial', userName, mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const SidebarInner = (
    <aside
      className={cn(
        'relative flex flex-col h-full transition-all duration-300 shrink-0',
        'border-r border-purple-900/30',
        collapsed ? 'w-16' : 'w-64'
      )}
      style={{
        background: 'linear-gradient(180deg, #05030e 0%, #07050f 50%, #05030e 100%)',
      }}
    >
      {/* Vertical neon line */}
      <div className="absolute top-0 right-0 bottom-0 w-px bg-gradient-to-b from-transparent via-purple-500/40 to-transparent" />

      {/* Logo */}
      <div className="flex items-center justify-center h-28 px-2 shrink-0 border-b border-purple-900/20">
        {!collapsed ? (
          <Link href="/dashboard" className="flex items-center justify-center flex-1 group" onClick={onMobileClose}>
            <div className="relative w-full flex justify-center">
              <div className="absolute inset-0 blur-2xl opacity-50 group-hover:opacity-70 transition-opacity rounded-lg"
                style={{ background: 'radial-gradient(ellipse, rgba(168,85,247,0.8), transparent)' }} />
              <Image
                src="/logo.jpg"
                alt="Cash.IA"
                width={220}
                height={66}
                className="relative object-contain h-20 w-auto"
                priority
              />
            </div>
          </Link>
        ) : (
          <Link href="/dashboard" className="mx-auto group" onClick={onMobileClose}>
            <div className="relative w-9 h-9">
              <div className="absolute inset-0 rounded-xl bg-purple-600 blur-md opacity-50 group-hover:opacity-80 transition-opacity" />
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
            </div>
          </Link>
        )}

        {/* Mobile close button */}
        {onMobileClose && (
          <button
            onClick={onMobileClose}
            className="ml-auto p-1.5 rounded-lg text-purple-400/60 hover:text-purple-300 hover:bg-purple-900/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Desktop collapse toggle */}
      {!onMobileClose && (
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-[108px] z-20 w-6 h-6 rounded-full border border-purple-500/30 bg-[#07050f] flex items-center justify-center hover:border-purple-400/60 hover:bg-purple-900/20 transition-all"
        >
          <ChevronLeft className={cn('w-3 h-3 text-purple-400 transition-transform', collapsed && 'rotate-180')} />
        </button>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {!collapsed && (
          <p className="cyber-text px-3 mb-3">NAVEGAÇÃO</p>
        )}

        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link key={item.href} href={item.href} onClick={onMobileClose}>
              <div
                className={cn(
                  'relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group cursor-pointer',
                  isActive
                    ? 'text-white'
                    : 'text-purple-300/50 hover:text-purple-200'
                )}
              >
                {/* Active background */}
                {isActive && (
                  <>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600/20 to-blue-600/10 border border-purple-500/25" />
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-gradient-to-b from-purple-400 to-blue-400 rounded-full" />
                  </>
                )}

                {/* Hover bg */}
                {!isActive && (
                  <div className="absolute inset-0 rounded-xl bg-purple-900/0 group-hover:bg-purple-900/15 transition-colors" />
                )}

                <item.icon className={cn(
                  'w-4.5 h-4.5 shrink-0 relative z-10 transition-colors',
                  isActive ? 'text-purple-400' : 'text-purple-500/50 group-hover:text-purple-300'
                )} />

                {!collapsed && (
                  <>
                    <span className="flex-1 relative z-10">{item.label}</span>
                    {item.badge && (
                      <span className="relative z-10 text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 tracking-wider">
                        {item.badge}
                      </span>
                    )}
                    {isActive && (
                      <div className="relative z-10 w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse-neon" />
                    )}
                  </>
                )}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-2 pb-4 space-y-2 shrink-0 border-t border-purple-900/20 pt-3">
        {/* Plan badge */}
        {!collapsed && (
          <div className={cn(
            'mx-1 p-3 rounded-xl border relative overflow-hidden',
            plan === 'pro'
              ? 'border-yellow-500/25 bg-yellow-500/5'
              : 'border-purple-500/20 bg-purple-500/5'
          )}>
            <div className="absolute inset-0 animate-shimmer opacity-50" />
            <div className="flex items-center gap-2 relative z-10">
              <Crown className={cn('w-4 h-4 shrink-0', plan === 'pro' ? 'text-yellow-400' : 'text-purple-400')} />
              <div>
                <p className="text-xs font-semibold text-white">
                  {plan === 'pro' ? 'Plano Pro' : 'Trial — 30 dias'}
                </p>
                <p className="text-[10px] text-purple-300/50">
                  {plan === 'pro' ? 'Acesso ilimitado ativo' : 'Upgrade para ilimitado'}
                </p>
              </div>
            </div>
            {plan === 'trial' && (
              <Link
                href="/planos"
                onClick={onMobileClose}
                className="mt-2.5 flex items-center justify-center gap-1.5 w-full text-xs font-semibold py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 transition-opacity relative z-10"
              >
                <Zap className="w-3 h-3" />
                Fazer upgrade
              </Link>
            )}
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={cn(
            'flex items-center gap-3 w-full px-3 py-2 rounded-xl text-xs text-purple-400/50 hover:text-red-400 hover:bg-red-500/8 transition-all group',
            collapsed && 'justify-center'
          )}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Sair da plataforma</span>}
        </button>
      </div>
    </aside>
  )

  return SidebarInner
}
