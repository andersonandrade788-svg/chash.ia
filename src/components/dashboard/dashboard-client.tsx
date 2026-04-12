'use client'

import Link from 'next/link'
import {
  BookOpen, GraduationCap, Megaphone, MessageSquare,
  Bot, Zap, TrendingUp, Clock, ChevronRight, Sparkles,
  Activity, Layers, Star,
} from 'lucide-react'
import type { Profile, Project } from '@/types/database'
import { formatDistanceToNow } from '@/lib/utils'

const quickActions = [
  {
    label: 'Criar eBook',
    description: 'Gere um ebook completo com IA em minutos',
    href: '/ebook',
    icon: BookOpen,
    badge: 'POPULAR',
    gradient: 'linear-gradient(135deg, #7c2d91 0%, #9333ea 40%, #c026d3 100%)',
    glow: 'rgba(147,51,234,0.5)',
    accentColor: '#e879f9',
    bgPattern: 'radial-gradient(ellipse 80% 60% at 80% 20%, rgba(232,121,249,0.12) 0%, transparent 70%)',
  },
  {
    label: 'Criar Curso',
    description: 'Estruture módulos, aulas e scripts completos',
    href: '/curso',
    icon: GraduationCap,
    gradient: 'linear-gradient(135deg, #0c4a6e 0%, #0ea5e9 40%, #38bdf8 100%)',
    glow: 'rgba(14,165,233,0.5)',
    accentColor: '#7dd3fc',
    bgPattern: 'radial-gradient(ellipse 80% 60% at 80% 20%, rgba(125,211,252,0.12) 0%, transparent 70%)',
  },
  {
    label: 'Criar Oferta',
    description: 'Copy persuasiva, criativos e funil de vendas',
    href: '/oferta',
    icon: Megaphone,
    gradient: 'linear-gradient(135deg, #78350f 0%, #d97706 40%, #fbbf24 100%)',
    glow: 'rgba(217,119,6,0.5)',
    accentColor: '#fde68a',
    bgPattern: 'radial-gradient(ellipse 80% 60% at 80% 20%, rgba(253,230,138,0.12) 0%, transparent 70%)',
  },
  {
    label: 'Chat IA',
    description: 'GPT-4o, Claude e Gemini num só lugar',
    href: '/chat',
    icon: MessageSquare,
    gradient: 'linear-gradient(135deg, #064e3b 0%, #059669 40%, #34d399 100%)',
    glow: 'rgba(5,150,105,0.5)',
    accentColor: '#6ee7b7',
    bgPattern: 'radial-gradient(ellipse 80% 60% at 80% 20%, rgba(110,231,183,0.12) 0%, transparent 70%)',
  },
  {
    label: 'Agentes IA',
    description: 'Especialistas em copy, tráfego e funis',
    href: '/agentes',
    icon: Bot,
    gradient: 'linear-gradient(135deg, #831843 0%, #db2777 40%, #f472b6 100%)',
    glow: 'rgba(219,39,119,0.5)',
    accentColor: '#fbcfe8',
    bgPattern: 'radial-gradient(ellipse 80% 60% at 80% 20%, rgba(251,207,232,0.12) 0%, transparent 70%)',
  },
]

const productTypeIcons: Record<string, React.ElementType> = {
  ebook: BookOpen, curso: GraduationCap, oferta: Megaphone,
}
const productTypeColors: Record<string, { icon: string; bg: string; border: string }> = {
  ebook:  { icon: '#e879f9', bg: 'rgba(147,51,234,0.1)',  border: 'rgba(147,51,234,0.25)' },
  curso:  { icon: '#7dd3fc', bg: 'rgba(14,165,233,0.1)',  border: 'rgba(14,165,233,0.25)' },
  oferta: { icon: '#fde68a', bg: 'rgba(217,119,6,0.1)',   border: 'rgba(217,119,6,0.25)'  },
}

interface DashboardClientProps {
  profile: Profile | null
  recentProjects: Project[]
}

export function DashboardClient({ profile, recentProjects }: DashboardClientProps) {
  const generationsUsed = profile?.generations_used ?? 0
  const generationsLimit = profile?.generations_limit ?? 10
  const usagePercent = Math.round((generationsUsed / generationsLimit) * 100)
  const completedProjects = recentProjects.filter((p) => p.status === 'completed').length
  const firstName = profile?.name?.split(' ')[0] ?? 'Empreendedor'

  return (
    <div className="space-y-8 max-w-7xl mx-auto">

      {/* Hero */}
      <div
        className="relative overflow-hidden rounded-2xl p-6 md:p-8"
        style={{
          background: 'rgba(5,3,14,0.92)',
          border: '1px solid rgba(168,85,247,0.2)',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 0 60px rgba(168,85,247,0.06)',
        }}
      >
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'rgba(168,85,247,0.08)' }} />
        <div className="absolute -bottom-8 left-1/3 w-48 h-48 rounded-full blur-2xl pointer-events-none"
          style={{ background: 'rgba(56,189,248,0.06)' }} />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.35)' }}>
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                <span className="text-[10px] font-bold tracking-widest text-purple-300">SISTEMA ONLINE</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(56,189,248,0.10)', border: '1px solid rgba(56,189,248,0.25)' }}>
                <Activity className="w-2.5 h-2.5 text-sky-400" />
                <span className="text-[10px] font-bold tracking-widest text-sky-400">MOTOR IA ATIVO</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-2">
              Bem-vindo de volta, <span className="gradient-cash-text">{firstName}!</span>
            </h1>
            <p className="text-sm leading-relaxed max-w-lg" style={{ color: '#a094c0' }}>
              Transforme qualquer nicho em produto digital pronto para vender com IA de última geração.
            </p>
            <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4" style={{ color: '#c084fc' }} />
                <span className="text-sm" style={{ color: '#a094c0' }}>
                  <span className="font-bold text-white">{recentProjects.length}</span> produtos
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-sm" style={{ color: '#a094c0' }}>
                  <span className="font-bold text-white">{completedProjects}</span> concluídos
                </span>
              </div>
            </div>
          </div>

          <Link
            href="/ebook?mode=full"
            className="group relative flex-shrink-0 flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-white font-bold text-base transition-all duration-300 hover:scale-105 hover:brightness-110"
            style={{
              background: 'linear-gradient(135deg, #7c2d12, #c2410c, #f97316, #fbbf24)',
              boxShadow: '0 0 40px rgba(249,115,22,0.4), 0 8px 32px rgba(0,0,0,0.4)',
            }}
          >
            <Sparkles className="w-5 h-5" />
            Gerar Tudo!
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="cyber-text">FERRAMENTAS</p>
            <h2 className="text-base font-semibold text-white mt-0.5">Criar novo produto</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <div
                className="group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'rgba(5,3,14,0.92)',
                  border: '1px solid rgba(168,85,247,0.1)',
                  backdropFilter: 'blur(20px)',
                  minHeight: '148px',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.boxShadow = `0 0 40px ${action.glow}, 0 12px 40px rgba(0,0,0,0.4)`
                  el.style.borderColor = action.accentColor + '50'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.boxShadow = 'none'
                  el.style.borderColor = 'rgba(168,85,247,0.1)'
                }}
              >
                <div className="absolute inset-0 pointer-events-none" style={{ background: action.bgPattern }} />
                <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{ background: action.gradient }} />
                <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full opacity-8 group-hover:opacity-15 transition-opacity pointer-events-none"
                  style={{ background: action.gradient }} />

                <div className="relative z-10 p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                      style={{ background: action.gradient, boxShadow: `0 0 20px ${action.glow}` }}
                    >
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    {action.badge && (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full tracking-widest"
                        style={{ background: `${action.accentColor}20`, color: action.accentColor, border: `1px solid ${action.accentColor}50` }}>
                        {action.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-sm text-white mb-1">{action.label}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: '#a094c0' }}>{action.description}</p>
                  <div className="flex items-center gap-1.5 mt-3 opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <span className="text-[11px] font-semibold" style={{ color: action.accentColor }}>Acessar agora</span>
                    <ChevronRight className="w-3 h-3" style={{ color: action.accentColor }} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <p className="cyber-text">SEU PROGRESSO</p>
          <div className="rounded-2xl p-5 space-y-5"
            style={{ background: 'rgba(5,3,14,0.92)', border: '1px solid rgba(168,85,247,0.15)', backdropFilter: 'blur(20px)' }}>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium" style={{ color: '#a094c0' }}>Gerações usadas</span>
                <span className="text-xs font-bold text-white">
                  {generationsUsed}<span style={{ color: '#a094c0' }}>/{generationsLimit}</span>
                </span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(168,85,247,0.1)' }}>
                <div className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${usagePercent}%`,
                    background: usagePercent > 75 ? 'linear-gradient(90deg,#f59e0b,#ef4444)' : 'linear-gradient(90deg,#9333ea,#38bdf8)',
                    boxShadow: '0 0 8px rgba(168,85,247,0.6)',
                  }} />
              </div>
              {usagePercent >= 80 && profile?.plan === 'trial' && (
                <p className="text-[10px] text-yellow-400 mt-1.5 flex items-center gap-1">
                  <Zap className="w-2.5 h-2.5" /> Quase no limite
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: recentProjects.length, label: 'Projetos', color: '#c084fc' },
                { value: completedProjects, label: 'Concluídos', color: '#38bdf8' },
              ].map((s) => (
                <div key={s.label} className="rounded-xl p-4 text-center"
                  style={{ background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.12)' }}>
                  <p className="text-3xl font-bold" style={{ color: s.color, textShadow: `0 0 24px ${s.color}60` }}>{s.value}</p>
                  <p className="text-[11px] mt-0.5 font-medium" style={{ color: '#a094c0' }}>{s.label}</p>
                </div>
              ))}
            </div>
            {profile?.plan === 'trial' && (
              <Link href="/planos"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm text-white hover:opacity-90 hover:scale-[1.02] transition-all"
                style={{ background: 'linear-gradient(135deg,#9333ea,#6366f1,#38bdf8)', boxShadow: '0 0 24px rgba(147,51,234,0.3)' }}>
                <TrendingUp className="w-4 h-4" />
                Upgrade para Pro
              </Link>
            )}
          </div>
          <div className="rounded-2xl p-4"
            style={{ background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.2)', backdropFilter: 'blur(20px)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              <span className="text-xs font-bold text-yellow-400">Dica do dia</span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: '#a094c0' }}>
              Nichos de saúde, relacionamento e finanças convertem até{' '}
              <span className="text-yellow-400 font-bold">3x mais</span>.
              Use o Gerador de Oferta para criar copy persuasiva automaticamente.
            </p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="cyber-text">HISTÓRICO</p>
              <h2 className="text-base font-semibold text-white mt-0.5">Projetos recentes</h2>
            </div>
            <Link href="/projetos" className="flex items-center gap-1 text-xs hover:text-purple-300 transition-colors" style={{ color: '#a855f7' }}>
              Ver todos <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {recentProjects.length === 0 ? (
            <div className="rounded-2xl flex flex-col items-center justify-center py-16 text-center"
              style={{ background: 'rgba(5,3,14,0.92)', border: '1px dashed rgba(168,85,247,0.2)', backdropFilter: 'blur(20px)' }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: 'linear-gradient(135deg,#9333ea,#38bdf8)', boxShadow: '0 0 30px rgba(147,51,234,0.4)' }}>
                <Zap className="w-8 h-8 text-white" />
              </div>
              <p className="font-bold text-white mb-1">Nenhum projeto ainda</p>
              <p className="text-sm mb-5" style={{ color: '#a094c0' }}>Crie seu primeiro produto digital com IA agora</p>
              <Link href="/ebook"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white hover:opacity-90 hover:scale-105 transition-all"
                style={{ background: 'linear-gradient(135deg,#9333ea,#6366f1,#38bdf8)', boxShadow: '0 0 24px rgba(147,51,234,0.3)' }}>
                <BookOpen className="w-4 h-4" /> Criar meu primeiro eBook
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {recentProjects.map((project) => {
                const Icon = productTypeIcons[project.type] ?? BookOpen
                const colors = productTypeColors[project.type] ?? productTypeColors.ebook
                return (
                  <div key={project.id}
                    className="group rounded-xl p-4 flex items-center gap-4 cursor-pointer transition-all duration-200"
                    style={{ background: 'rgba(5,3,14,0.92)', border: '1px solid rgba(168,85,247,0.1)', backdropFilter: 'blur(20px)' }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLDivElement
                      el.style.borderColor = colors.border
                      el.style.boxShadow = `0 0 20px ${colors.bg}`
                      el.style.transform = 'translateX(-2px)'
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLDivElement
                      el.style.borderColor = 'rgba(168,85,247,0.1)'
                      el.style.boxShadow = 'none'
                      el.style.transform = 'none'
                    }}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: colors.bg, border: `1px solid ${colors.border}` }}>
                      <Icon className="w-5 h-5" style={{ color: colors.icon }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-white truncate">{project.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wider"
                          style={{ background: colors.bg, color: colors.icon, border: `1px solid ${colors.border}` }}>
                          {project.type.toUpperCase()}
                        </span>
                        {project.niche && <span className="text-xs truncate" style={{ color: '#a094c0' }}>{project.niche}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[10px] flex items-center gap-1" style={{ color: '#a094c0' }}>
                        <Clock className="w-3 h-3" />{formatDistanceToNow(project.created_at)}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={project.status === 'completed'
                          ? { background: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.3)' }
                          : { background: 'rgba(251,191,36,0.1)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)' }}>
                        {project.status === 'completed' ? 'PRONTO' : 'RASCUNHO'}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
