'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Megaphone,
  Sparkles,
  Loader2,
  Copy,
  Share2,
  MessageCircle,
  TrendingUp,
  Zap,
  Target,
} from 'lucide-react'
import { toast } from 'sonner'

interface AdCreative {
  platform: string
  hook: string
  body: string
  cta: string
}

interface OfferData {
  headline: string
  subheadline: string
  salesLetter: string
  bullets: string[]
  cta: string
  urgency: string
  whatsappScript: string
  adCreatives: AdCreative[]
  funnelStructure: {
    top: string
    middle: string
    bottom: string
  }
}

export function OfferGenerator() {
  const [loading, setLoading] = useState(false)
  const [offer, setOffer] = useState<OfferData | null>(null)
  const [model, setModel] = useState('claude')

  const [form, setForm] = useState({
    productName: '',
    niche: '',
    price: '',
    audience: '',
  })

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
    toast.success('Copiado!')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/ai/oferta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, model }),
      })

      const { data, error } = await res.json()
      if (error) { toast.error(error); return }

      setOffer(data)
      toast.success('Oferta gerada com sucesso!')
    } catch {
      toast.error('Erro ao gerar oferta.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    background: 'rgba(251,191,36,0.05)',
    border: '1px solid rgba(251,191,36,0.15)',
    color: '#f0eeff',
    borderRadius: '12px',
  }

  const platformIcon: Record<string, React.ElementType> = {
    Instagram: Share2,
    Facebook: Share2,
    TikTok: Zap,
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* ── Header ────────────────────────────────── */}
      <div className="flex items-center gap-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: 'rgba(251,191,36,0.12)',
            border: '1px solid rgba(251,191,36,0.35)',
            boxShadow: '0 0 20px rgba(251,191,36,0.15)',
          }}
        >
          <Megaphone className="w-5 h-5" style={{ color: '#fbbf24' }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Gerador de Oferta</h1>
          <p className="cyber-text mt-0.5">COPY, CRIATIVOS, FUNIL E SCRIPTS PRONTOS PARA VENDER</p>
        </div>
      </div>

      {/* ── Form ──────────────────────────────────── */}
      {!offer && (
        <div
          className="rounded-2xl p-6"
          style={{
            background: 'rgba(5,3,14,0.92)',
            border: '1px solid rgba(251,191,36,0.12)',
            backdropFilter: 'blur(24px)',
          }}
        >
          <div className="mb-5">
            <h2 className="text-base font-semibold text-white">Seu produto</h2>
            <p className="text-xs mt-0.5" style={{ color: '#a094c0' }}>
              Preencha os dados e a IA cria a oferta completa
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold tracking-wide" style={{ color: '#9b8cc0' }}>
                  NOME DO PRODUTO *
                </Label>
                <Input
                  placeholder="Ex: Método Renda Livre"
                  style={inputStyle}
                  value={form.productName}
                  onChange={(e) => setForm({ ...form, productName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold tracking-wide" style={{ color: '#9b8cc0' }}>
                  NICHO *
                </Label>
                <Input
                  placeholder="Ex: Finanças, Emagrecimento, Relacionamento"
                  style={inputStyle}
                  value={form.niche}
                  onChange={(e) => setForm({ ...form, niche: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold tracking-wide" style={{ color: '#9b8cc0' }}>
                  PREÇO *
                </Label>
                <Input
                  placeholder="Ex: R$ 197"
                  style={inputStyle}
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold tracking-wide" style={{ color: '#9b8cc0' }}>
                  PÚBLICO-ALVO *
                </Label>
                <Input
                  placeholder="Ex: Adultos que querem sair das dívidas"
                  style={inputStyle}
                  value={form.audience}
                  onChange={(e) => setForm({ ...form, audience: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold tracking-wide" style={{ color: '#9b8cc0' }}>
                MODELO DE IA
              </Label>
              <Select value={model} onValueChange={(v) => v && setModel(v)}>
                <SelectTrigger className="rounded-xl w-56" style={inputStyle}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="claude">Claude (Recomendado)</SelectItem>
                  <SelectItem value="gpt">GPT-4o</SelectItem>
                  <SelectItem value="gemini">Gemini</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl font-semibold gap-2 text-white border-0 hover:opacity-90 transition-opacity btn-glow"
              style={{ background: 'linear-gradient(135deg,#d97706,#f59e0b,#fbbf24)', height: '44px' }}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {loading ? 'Criando oferta...' : 'Gerar Oferta Completa'}
            </Button>
          </form>
        </div>
      )}

      {/* ── Offer result ──────────────────────────── */}
      {offer && (
        <div className="space-y-4">
          <Tabs defaultValue="copy">
            <TabsList
              className="w-full"
              style={{ background: 'rgba(5,3,14,0.92)', border: '1px solid rgba(251,191,36,0.1)' }}
            >
              <TabsTrigger value="copy">Página de Vendas</TabsTrigger>
              <TabsTrigger value="ads">Criativos</TabsTrigger>
              <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
              <TabsTrigger value="funnel">Funil</TabsTrigger>
            </TabsList>

            {/* ── Sales Page ────────────────────── */}
            <TabsContent value="copy" className="space-y-4 mt-4">
              <div
                className="rounded-2xl p-6 space-y-5"
                style={{
                  background: 'rgba(251,191,36,0.04)',
                  border: '1px solid rgba(251,191,36,0.15)',
                  backdropFilter: 'blur(24px)',
                }}
              >
                {/* Headline */}
                <div>
                  <p className="text-[10px] font-bold tracking-widest mb-2" style={{ color: '#fbbf24' }}>
                    HEADLINE
                  </p>
                  <h2 className="text-2xl font-bold text-white leading-tight">{offer.headline}</h2>
                  <p className="mt-1 text-sm" style={{ color: '#9b8cc0' }}>{offer.subheadline}</p>
                </div>

                {/* Bullets */}
                <div>
                  <p className="text-[10px] font-bold tracking-widest mb-3" style={{ color: '#fbbf24' }}>
                    BENEFÍCIOS
                  </p>
                  <div className="space-y-2">
                    {offer.bullets.map((b, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <Zap
                          className="w-3.5 h-3.5 mt-0.5 shrink-0"
                          style={{ color: '#fbbf24' }}
                        />
                        <p className="text-sm text-white">{b}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Urgency */}
                <div
                  className="flex items-start gap-3 p-3 rounded-xl"
                  style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' }}
                >
                  <TrendingUp className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#fbbf24' }} />
                  <p className="text-sm text-yellow-100">{offer.urgency}</p>
                </div>

                {/* CTA */}
                <div className="text-center">
                  <Button
                    className="rounded-xl px-8 py-3 text-lg font-bold text-white border-0 btn-glow"
                    style={{ background: 'linear-gradient(135deg,#d97706,#f59e0b,#fbbf24)' }}
                  >
                    {offer.cta}
                  </Button>
                </div>

                {/* Sales letter */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-bold tracking-widest" style={{ color: '#a094c0' }}>
                      CARTA DE VENDAS COMPLETA
                    </p>
                    <button
                      className="flex items-center gap-1.5 text-xs transition-colors hover:text-white"
                      style={{ color: '#a094c0' }}
                      onClick={() => copyToClipboard(offer.salesLetter)}
                    >
                      <Copy className="w-3 h-3" />
                      Copiar
                    </button>
                  </div>
                  <div
                    className="p-4 rounded-xl text-sm whitespace-pre-wrap max-h-64 overflow-y-auto leading-relaxed"
                    style={{
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid rgba(251,191,36,0.1)',
                      color: '#9b8cc0',
                    }}
                  >
                    {offer.salesLetter}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* ── Ad Creatives ──────────────────── */}
            <TabsContent value="ads" className="space-y-3 mt-4">
              {offer.adCreatives.map((ad, i) => {
                const Icon = platformIcon[ad.platform] ?? Megaphone
                return (
                  <div
                    key={i}
                    className="rounded-xl p-4 space-y-3"
                    style={{
                      background: 'rgba(5,3,14,0.92)',
                      border: '1px solid rgba(168,85,247,0.12)',
                      backdropFilter: 'blur(20px)',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" style={{ color: '#a855f7' }} />
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded tracking-wider"
                          style={{ background: 'rgba(168,85,247,0.12)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.2)' }}
                        >
                          {ad.platform.toUpperCase()}
                        </span>
                      </div>
                      <button
                        className="flex items-center gap-1.5 text-xs transition-colors hover:text-white"
                        style={{ color: '#a094c0' }}
                        onClick={() => copyToClipboard(`${ad.hook}\n\n${ad.body}\n\n${ad.cta}`)}
                      >
                        <Copy className="w-3 h-3" />
                        Copiar
                      </button>
                    </div>
                    <div className="space-y-2">
                      <div
                        className="p-3 rounded-lg"
                        style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.15)' }}
                      >
                        <p className="text-[9px] font-bold tracking-widest mb-1" style={{ color: '#c084fc' }}>HOOK</p>
                        <p className="text-sm font-medium text-white">{ad.hook}</p>
                      </div>
                      <p className="text-sm px-1 leading-relaxed" style={{ color: '#9b8cc0' }}>{ad.body}</p>
                      <div
                        className="p-3 rounded-lg"
                        style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' }}
                      >
                        <p className="text-[9px] font-bold tracking-widest mb-1" style={{ color: '#fbbf24' }}>CTA</p>
                        <p className="text-sm font-medium text-yellow-100">{ad.cta}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </TabsContent>

            {/* ── WhatsApp ──────────────────────── */}
            <TabsContent value="whatsapp" className="mt-4">
              <div
                className="rounded-xl p-5"
                style={{
                  background: 'rgba(34,197,94,0.05)',
                  border: '1px solid rgba(34,197,94,0.2)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" style={{ color: '#4ade80' }} />
                    <span className="text-sm font-semibold text-white">Script de WhatsApp</span>
                  </div>
                  <button
                    className="flex items-center gap-1.5 text-xs transition-colors hover:text-white"
                    style={{ color: '#a094c0' }}
                    onClick={() => copyToClipboard(offer.whatsappScript)}
                  >
                    <Copy className="w-3 h-3" />
                    Copiar
                  </button>
                </div>
                <div
                  className="p-4 rounded-xl text-sm whitespace-pre-wrap max-h-96 overflow-y-auto leading-relaxed"
                  style={{
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(34,197,94,0.15)',
                    color: '#9b8cc0',
                  }}
                >
                  {offer.whatsappScript}
                </div>
              </div>
            </TabsContent>

            {/* ── Funnel ────────────────────────── */}
            <TabsContent value="funnel" className="mt-4">
              <div className="space-y-3">
                {[
                  {
                    key: 'top',
                    label: 'Topo do Funil',
                    desc: 'Consciência',
                    color: '#38bdf8',
                    bg: 'rgba(56,189,248,0.06)',
                    border: 'rgba(56,189,248,0.2)',
                  },
                  {
                    key: 'middle',
                    label: 'Meio do Funil',
                    desc: 'Consideração',
                    color: '#c084fc',
                    bg: 'rgba(168,85,247,0.06)',
                    border: 'rgba(168,85,247,0.2)',
                  },
                  {
                    key: 'bottom',
                    label: 'Fundo do Funil',
                    desc: 'Decisão',
                    color: '#fbbf24',
                    bg: 'rgba(251,191,36,0.06)',
                    border: 'rgba(251,191,36,0.2)',
                  },
                ].map((stage) => (
                  <div
                    key={stage.key}
                    className="rounded-xl p-4"
                    style={{ background: stage.bg, border: `1px solid ${stage.border}`, backdropFilter: 'blur(20px)' }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4" style={{ color: stage.color }} />
                      <span className="text-sm font-semibold" style={{ color: stage.color }}>
                        {stage.label}
                      </span>
                      <span
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wider"
                        style={{ background: `${stage.color}20`, color: stage.color, border: `1px solid ${stage.color}40` }}
                      >
                        {stage.desc.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: '#9b8cc0' }}>
                      {offer.funnelStructure[stage.key as keyof typeof offer.funnelStructure]}
                    </p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <Button
            variant="outline"
            className="rounded-xl"
            style={{ borderColor: 'rgba(251,191,36,0.2)', color: '#9b8cc0', background: 'transparent' }}
            onClick={() => setOffer(null)}
          >
            Gerar nova oferta
          </Button>
        </div>
      )}
    </div>
  )
}
