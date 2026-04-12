'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BookOpen,
  Sparkles,
  Loader2,
  Download,
  Save,
  TrendingUp,
  ChevronRight,
  Zap,
  FileText,
  Star,
  Check,
  Palette,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import { EBOOK_THEMES, type EbookTheme } from '@/lib/pdf/ebook-themes'

interface EbookOutline {
  title: string
  subtitle: string
  tagline: string
  chapters: Array<{
    number: number
    title: string
    description: string
    keyPoints: string[]
  }>
  targetAudience: string
  mainBenefit: string
  potentialScore: number
}

type Step = 'form' | 'outline' | 'content'

const stepConfig = [
  { id: 'form',    label: 'Configurar', icon: Sparkles },
  { id: 'outline', label: 'Sumário',    icon: FileText  },
  { id: 'content', label: 'Conteúdo',   icon: BookOpen  },
] as const

export function EbookGenerator() {
  const [step, setStep] = useState<Step>('form')
  const [loading, setLoading] = useState(false)
  const [model, setModel] = useState('claude')
  const [outline, setOutline] = useState<EbookOutline | null>(null)
  const [content, setContent] = useState('')
  const [generating, setGenerating] = useState(false)

  const [selectedTheme, setSelectedTheme] = useState<EbookTheme>(EBOOK_THEMES[0])
  const [downloadingPDF, setDownloadingPDF] = useState(false)

  const [form, setForm] = useState({
    niche: '',
    audience: '',
    promise: '',
    level: 'iniciante',
  })

  async function handleGenerateOutline(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/ai/ebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, mode: 'outline', model }),
      })

      const { data, error } = await res.json()

      if (error) {
        toast.error(error)
        return
      }

      setOutline(data)
      setStep('outline')
      toast.success('Sumário gerado com sucesso!')
    } catch {
      toast.error('Erro ao gerar sumário. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  async function handleGenerateContent() {
    setGenerating(true)
    setContent('')
    setStep('content')

    try {
      const res = await fetch('/api/ai/ebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, mode: 'full', model }),
      })

      const { data, error } = await res.json()

      if (error) {
        toast.error(error)
        return
      }

      if (!data) {
        toast.error('A IA não retornou conteúdo. Tente novamente.')
        setStep('outline')
        return
      }

      setContent(data)
      toast.success('eBook gerado com sucesso!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao gerar conteúdo.')
      setStep('outline')
    } finally {
      setGenerating(false)
    }
  }

  function handleDownloadMarkdown() {
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${outline?.title ?? 'ebook'}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleDownloadPDF() {
    if (!content || !outline) return
    setDownloadingPDF(true)
    try {
      const { generateEbookPDF } = await import('@/lib/pdf/ebook-pdf')
      await generateEbookPDF({
        title: outline.title,
        subtitle: outline.subtitle,
        content,
        theme: selectedTheme,
      })
      toast.success('PDF gerado com sucesso!')
    } catch {
      toast.error('Erro ao gerar PDF.')
    } finally {
      setDownloadingPDF(false)
    }
  }

  const currentStepIndex = stepConfig.findIndex((s) => s.id === step)

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* ── Header ────────────────────────────────── */}
      <div className="flex items-center gap-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: 'rgba(168,85,247,0.12)',
            border: '1px solid rgba(168,85,247,0.3)',
            boxShadow: '0 0 20px rgba(168,85,247,0.15)',
          }}
        >
          <BookOpen className="w-5 h-5" style={{ color: '#c084fc' }} />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">Gerador de eBook</h1>
          <p className="cyber-text mt-0.5">CRIE UM EBOOK COMPLETO PRONTO PARA VENDER COM IA</p>
        </div>
        <span
          className="text-[10px] font-bold px-2.5 py-1 rounded-lg tracking-widest"
          style={{
            background: 'linear-gradient(135deg,rgba(147,51,234,0.3),rgba(56,189,248,0.3))',
            border: '1px solid rgba(168,85,247,0.4)',
            color: '#c084fc',
          }}
        >
          CORE FEATURE
        </span>
      </div>

      {/* ── Steps indicator ───────────────────────── */}
      <div
        className="flex items-center p-1.5 rounded-xl gap-1"
        style={{ background: 'rgba(5,3,14,0.92)', border: '1px solid rgba(168,85,247,0.1)' }}
      >
        {stepConfig.map((s, i) => {
          const isDone = i < currentStepIndex
          const isActive = s.id === step
          const Icon = s.icon

          return (
            <div key={s.id} className="flex items-center gap-1 flex-1">
              <div
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 flex-1 justify-center',
                )}
                style={
                  isActive
                    ? {
                        background: 'linear-gradient(135deg,rgba(147,51,234,0.3),rgba(99,102,241,0.2))',
                        border: '1px solid rgba(168,85,247,0.4)',
                        color: '#c084fc',
                        boxShadow: '0 0 20px rgba(168,85,247,0.2)',
                      }
                    : isDone
                    ? {
                        background: 'rgba(52,211,153,0.08)',
                        border: '1px solid rgba(52,211,153,0.2)',
                        color: '#34d399',
                      }
                    : {
                        background: 'transparent',
                        border: '1px solid transparent',
                        color: '#7a6fa0',
                      }
                }
              >
                {isDone ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
                {s.label}
              </div>
              {i < stepConfig.length - 1 && (
                <ChevronRight className="w-3 h-3 shrink-0" style={{ color: '#7a6fa0' }} />
              )}
            </div>
          )
        })}
      </div>

      {/* ── Step 1: Form ──────────────────────────── */}
      {step === 'form' && (
        <div
          className="rounded-2xl p-6"
          style={{
            background: 'rgba(5,3,14,0.92)',
            border: '1px solid rgba(168,85,247,0.12)',
            backdropFilter: 'blur(24px)',
          }}
        >
          <div className="mb-5">
            <h2 className="text-base font-semibold text-white">Defina seu eBook</h2>
            <p className="text-xs mt-0.5" style={{ color: '#a094c0' }}>Quanto mais detalhado, melhor o resultado da IA</p>
          </div>

          <form onSubmit={handleGenerateOutline} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="niche" className="text-xs font-semibold tracking-wide" style={{ color: '#9b8cc0' }}>
                  NICHO *
                </Label>
                <Input
                  id="niche"
                  placeholder="Ex: Finanças pessoais, Emagrecimento..."
                  className="rounded-xl text-sm"
                  style={{ background: 'rgba(168,85,247,0.05)', border: '1px solid rgba(168,85,247,0.15)', color: '#f0eeff' }}
                  value={form.niche}
                  onChange={(e) => setForm({ ...form, niche: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="audience" className="text-xs font-semibold tracking-wide" style={{ color: '#9b8cc0' }}>
                  PÚBLICO-ALVO *
                </Label>
                <Input
                  id="audience"
                  placeholder="Ex: Mães de 25-40 anos que querem..."
                  className="rounded-xl text-sm"
                  style={{ background: 'rgba(168,85,247,0.05)', border: '1px solid rgba(168,85,247,0.15)', color: '#f0eeff' }}
                  value={form.audience}
                  onChange={(e) => setForm({ ...form, audience: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="promise" className="text-xs font-semibold tracking-wide" style={{ color: '#9b8cc0' }}>
                PROMESSA PRINCIPAL *
              </Label>
              <Textarea
                id="promise"
                placeholder="Ex: Aprenda a sair das dívidas e construir reserva de emergência em 90 dias sem cortar o que você ama"
                className="rounded-xl text-sm min-h-[80px]"
                style={{ background: 'rgba(168,85,247,0.05)', border: '1px solid rgba(168,85,247,0.15)', color: '#f0eeff' }}
                value={form.promise}
                onChange={(e) => setForm({ ...form, promise: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold tracking-wide" style={{ color: '#9b8cc0' }}>NÍVEL DO PÚBLICO</Label>
                <Select value={form.level} onValueChange={(v) => v && setForm({ ...form, level: v })}>
                  <SelectTrigger
                    className="rounded-xl text-sm"
                    style={{ background: 'rgba(168,85,247,0.05)', border: '1px solid rgba(168,85,247,0.15)' }}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="iniciante">Iniciante</SelectItem>
                    <SelectItem value="intermediário">Intermediário</SelectItem>
                    <SelectItem value="avançado">Avançado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold tracking-wide" style={{ color: '#9b8cc0' }}>MODELO DE IA</Label>
                <Select value={model} onValueChange={(v) => v && setModel(v)}>
                  <SelectTrigger
                    className="rounded-xl text-sm"
                    style={{ background: 'rgba(168,85,247,0.05)', border: '1px solid rgba(168,85,247,0.15)' }}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="claude">Claude (Recomendado)</SelectItem>
                    <SelectItem value="gpt">GPT-4o</SelectItem>
                    <SelectItem value="gemini">Gemini 1.5 Pro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Seletor de tema de cor */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Palette className="w-3.5 h-3.5" style={{ color: '#9b8cc0' }} />
                <span className="text-xs font-semibold tracking-wide" style={{ color: '#9b8cc0' }}>COR DO EBOOK (PDF)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {EBOOK_THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setSelectedTheme(theme)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{
                      background: selectedTheme.id === theme.id
                        ? `rgba(${theme.primary.join(',')},0.15)`
                        : 'rgba(168,85,247,0.05)',
                      border: selectedTheme.id === theme.id
                        ? `1px solid rgb(${theme.primary.join(',')})`
                        : '1px solid rgba(168,85,247,0.15)',
                      color: selectedTheme.id === theme.id ? '#fff' : '#9b8cc0',
                    }}
                  >
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ background: `rgb(${theme.primary.join(',')})` }}
                    />
                    {theme.name}
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl font-semibold gap-2 text-white border-0 hover:opacity-90 transition-opacity btn-glow"
              style={{ background: 'linear-gradient(135deg,#9333ea,#6366f1,#38bdf8)', height: '44px' }}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {loading ? 'Gerando sumário com IA...' : 'Gerar Sumário com IA'}
            </Button>
          </form>
        </div>
      )}

      {/* ── Step 2: Outline ───────────────────────── */}
      {step === 'outline' && outline && (
        <div className="space-y-4">
          {/* Potential Score */}
          <div
            className="rounded-xl p-5 flex items-center gap-5"
            style={{
              background: 'rgba(52,211,153,0.06)',
              border: '1px solid rgba(52,211,153,0.2)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
              style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)' }}
            >
              <TrendingUp className="w-6 h-6" style={{ color: '#34d399' }} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold tracking-wider mb-2" style={{ color: '#34d399' }}>
                ANÁLISE DE POTENCIAL DE VENDA
              </p>
              <div className="flex items-center gap-3 mb-1">
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(52,211,153,0.1)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${outline.potentialScore}%`,
                      background: 'linear-gradient(90deg,#10b981,#34d399)',
                      boxShadow: '0 0 8px rgba(52,211,153,0.6)',
                    }}
                  />
                </div>
                <span className="text-xl font-bold" style={{ color: '#34d399', textShadow: '0 0 20px rgba(52,211,153,0.5)' }}>
                  {outline.potentialScore}%
                </span>
              </div>
              <p className="text-xs" style={{ color: '#a094c0' }}>{outline.mainBenefit}</p>
            </div>
          </div>

          {/* Book info */}
          <div
            className="rounded-xl p-6"
            style={{
              background: 'rgba(5,3,14,0.92)',
              border: '1px solid rgba(168,85,247,0.15)',
              backdropFilter: 'blur(24px)',
            }}
          >
            <div className="flex items-start gap-5">
              <div
                className="w-20 h-28 rounded-xl flex items-center justify-center shrink-0 relative"
                style={{
                  background: 'linear-gradient(135deg,#9333ea,#6366f1,#38bdf8)',
                  boxShadow: '0 0 30px rgba(168,85,247,0.4), 0 8px 24px rgba(0,0,0,0.4)',
                }}
              >
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white">{outline.title}</h2>
                <p className="mt-1 text-sm" style={{ color: '#9b8cc0' }}>{outline.subtitle}</p>
                <p className="mt-2 text-sm font-medium italic" style={{ color: '#c084fc' }}>
                  &ldquo;{outline.tagline}&rdquo;
                </p>
                <div className="flex items-center gap-1.5 mt-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-xs ml-1" style={{ color: '#a094c0' }}>
                    Público: {outline.targetAudience}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Chapters */}
          <div
            className="rounded-xl p-5"
            style={{
              background: 'rgba(5,3,14,0.92)',
              border: '1px solid rgba(168,85,247,0.12)',
              backdropFilter: 'blur(24px)',
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4" style={{ color: '#a855f7' }} />
              <h3 className="text-sm font-semibold text-white">Sumário — {outline.chapters.length} Capítulos</h3>
            </div>
            <div className="space-y-2">
              {outline.chapters.map((ch) => (
                <div
                  key={ch.number}
                  className="p-3 rounded-xl transition-all duration-200 group"
                  style={{ background: 'rgba(168,85,247,0.04)', border: '1px solid rgba(168,85,247,0.1)' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(168,85,247,0.25)'
                    ;(e.currentTarget as HTMLDivElement).style.background = 'rgba(168,85,247,0.08)'
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(168,85,247,0.1)'
                    ;(e.currentTarget as HTMLDivElement).style.background = 'rgba(168,85,247,0.04)'
                  }}
                >
                  <div className="flex items-center gap-3 mb-1.5">
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                      style={{ background: 'rgba(168,85,247,0.2)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.35)' }}
                    >
                      {ch.number}
                    </span>
                    <h4 className="font-medium text-sm text-white">{ch.title}</h4>
                  </div>
                  <p className="text-xs ml-9 mb-2" style={{ color: '#a094c0' }}>{ch.description}</p>
                  <div className="ml-9 flex flex-wrap gap-1">
                    {ch.keyPoints.map((kp, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(168,85,247,0.12)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.2)' }}
                      >
                        {kp}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="rounded-xl"
              style={{ borderColor: 'rgba(168,85,247,0.2)', color: '#9b8cc0', background: 'transparent' }}
              onClick={() => setStep('form')}
            >
              Refazer
            </Button>
            <Button
              className="flex-1 rounded-xl font-semibold gap-2 text-white border-0 hover:opacity-90 btn-glow"
              style={{ background: 'linear-gradient(135deg,#9333ea,#6366f1,#38bdf8)' }}
              onClick={handleGenerateContent}
            >
              <Zap className="w-4 h-4" />
              Gerar eBook Completo
            </Button>
          </div>
        </div>
      )}

      {/* ── Step 3: Content ───────────────────────── */}
      {step === 'content' && (
        <div className="space-y-4">
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(5,3,14,0.92)',
              border: '1px solid rgba(168,85,247,0.12)',
              backdropFilter: 'blur(24px)',
            }}
          >
            {/* Content header */}
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: '1px solid rgba(168,85,247,0.1)' }}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" style={{ color: '#c084fc' }} />
                <span className="text-sm font-semibold text-white">{outline?.title ?? 'eBook Gerado'}</span>
              </div>
              {!generating && content && (
                <div className="flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    className="gap-1.5 text-xs rounded-lg text-white border-0"
                    style={{ background: `rgb(${selectedTheme.primary.join(',')})` }}
                    onClick={handleDownloadPDF}
                    disabled={downloadingPDF}
                  >
                    {downloadingPDF ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                    {downloadingPDF ? 'Gerando PDF...' : 'Baixar PDF'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-xs rounded-lg"
                    style={{ borderColor: 'rgba(168,85,247,0.2)', color: '#9b8cc0', background: 'transparent' }}
                    onClick={handleDownloadMarkdown}
                  >
                    <Download className="w-3.5 h-3.5" />
                    Baixar .md
                  </Button>
                  <Button
                    size="sm"
                    className="gap-1.5 text-xs rounded-lg text-white border-0"
                    style={{ background: 'linear-gradient(135deg,#9333ea,#38bdf8)' }}
                  >
                    <Save className="w-3.5 h-3.5" />
                    Salvar
                  </Button>
                </div>
              )}
            </div>

            <div className="p-5">
              {generating ? (
                <div className="flex flex-col items-center justify-center py-16 gap-5">
                  <div className="relative">
                    <div
                      className="w-20 h-20 rounded-full border-2 border-t-purple-500 border-r-sky-400 border-b-purple-500/20 border-l-sky-400/20 animate-spin"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Zap className="w-6 h-6" style={{ color: '#a855f7' }} />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-white">Gerando seu eBook...</p>
                    <p className="text-xs mt-1" style={{ color: '#a094c0' }}>
                      A IA está escrevendo capítulo por capítulo
                    </p>
                  </div>
                </div>
              ) : (
                <Tabs defaultValue="preview">
                  <TabsList
                    className="mb-4"
                    style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.12)' }}
                  >
                    <TabsTrigger value="preview">Visualizar</TabsTrigger>
                    <TabsTrigger value="raw">Markdown</TabsTrigger>
                  </TabsList>
                  <TabsContent value="preview">
                    <div className="prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown>{content}</ReactMarkdown>
                    </div>
                  </TabsContent>
                  <TabsContent value="raw">
                    <pre
                      className="text-xs whitespace-pre-wrap font-mono p-4 rounded-xl overflow-auto max-h-[600px]"
                      style={{ background: 'rgba(0,0,0,0.3)', color: '#9b8cc0' }}
                    >
                      {content}
                    </pre>
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </div>

          {!generating && (
            <Button
              variant="outline"
              className="rounded-xl"
              style={{ borderColor: 'rgba(168,85,247,0.2)', color: '#9b8cc0', background: 'transparent' }}
              onClick={() => setStep('outline')}
            >
              Voltar ao Sumário
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
