'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Bot,
  Send,
  Loader2,
  User,
  Sparkles,
  ArrowLeft,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const agents = [
  {
    id: 'copywriter',
    name: 'Maya',
    role: 'Copywriter de Elite',
    description: 'Especialista em textos que vendem. Cria headlines, emails, pages de vendas e scripts.',
    emoji: '✍️',
    color: '#f472b6',
    glow: 'rgba(244,114,182,0.35)',
    bg: 'rgba(244,114,182,0.06)',
    border: 'rgba(244,114,182,0.2)',
    gradFrom: '#ec4899',
    gradTo: '#f472b6',
    quickPrompts: [
      'Crie uma headline para um curso de emagrecimento',
      'Escreva um email de lançamento para um ebook de finanças',
      'Crie 5 bullets irresistíveis para um produto digital',
    ],
  },
  {
    id: 'traffic',
    name: 'Rex',
    role: 'Especialista em Tráfego',
    description: 'Expert em Google Ads, Meta Ads e TikTok Ads. Foco em ROI e escala.',
    emoji: '📊',
    color: '#38bdf8',
    glow: 'rgba(56,189,248,0.35)',
    bg: 'rgba(56,189,248,0.06)',
    border: 'rgba(56,189,248,0.2)',
    gradFrom: '#0ea5e9',
    gradTo: '#38bdf8',
    quickPrompts: [
      'Qual o melhor público para anunciar um curso de culinária?',
      'Como criar campanhas de tráfego frio no Meta Ads?',
      'Me dê uma estratégia de remarketing para infoprodutos',
    ],
  },
  {
    id: 'funnel',
    name: 'Atlas',
    role: 'Estrategista de Funil',
    description: 'Constrói funis de venda completos que convertem. Da captura ao upsell.',
    emoji: '🔄',
    color: '#c084fc',
    glow: 'rgba(168,85,247,0.35)',
    bg: 'rgba(168,85,247,0.06)',
    border: 'rgba(168,85,247,0.2)',
    gradFrom: '#9333ea',
    gradTo: '#c084fc',
    quickPrompts: [
      'Monte um funil de vendas para um ebook de R$97',
      'Quais emails enviar após a captura do lead?',
      'Como estruturar um webinário de lançamento?',
    ],
  },
  {
    id: 'social',
    name: 'Nova',
    role: 'Social Media Expert',
    description: 'Especialista em crescimento no Instagram, TikTok e YouTube. Conteúdo viral.',
    emoji: '🚀',
    color: '#fb923c',
    glow: 'rgba(251,146,60,0.35)',
    bg: 'rgba(251,146,60,0.06)',
    border: 'rgba(251,146,60,0.2)',
    gradFrom: '#f97316',
    gradTo: '#fb923c',
    quickPrompts: [
      'Crie uma estratégia de conteúdo para o Instagram',
      'Quais tipos de Reels geram mais engajamento para infoprodutos?',
      'Como crescer no TikTok vendendo produtos digitais?',
    ],
  },
]

export function AgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState<typeof agents[0] | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  function selectAgent(agent: typeof agents[0]) {
    setSelectedAgent(agent)
    setMessages([])
    setInput('')
  }

  async function sendMessage(content?: string) {
    if (!selectedAgent) return
    const text = content ?? input.trim()
    if (!text || loading) return

    const userMsg: Message = { role: 'user', content: text }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }])

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          model: 'claude',
          agentId: selectedAgent.id,
        }),
      })

      if (!res.body) throw new Error('no stream')
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let text = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        text += decoder.decode(value, { stream: true })
        setMessages((prev) => {
          const updated = [...prev]
          updated[updated.length - 1] = { role: 'assistant', content: text }
          return updated
        })
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev]
        updated[updated.length - 1] = { role: 'assistant', content: 'Erro. Tente novamente.' }
        return updated
      })
    } finally {
      setLoading(false)
    }
  }

  /* ── Agent selection screen ───────────────────── */
  if (!selectedAgent) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: 'rgba(244,114,182,0.12)',
              border: '1px solid rgba(244,114,182,0.3)',
              boxShadow: '0 0 20px rgba(244,114,182,0.15)',
            }}
          >
            <Bot className="w-5 h-5" style={{ color: '#f472b6' }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Agentes Especializados</h1>
            <p className="cyber-text mt-0.5">ESPECIALISTAS EM IA COM PERSONALIDADE E FOCO</p>
          </div>
        </div>

        {/* Agent cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:-translate-y-1"
              style={{ background: agent.bg, border: `1px solid ${agent.border}` }}
              onClick={() => selectAgent(agent)}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 40px ${agent.glow}, 0 12px 32px rgba(0,0,0,0.3)`
                ;(e.currentTarget as HTMLDivElement).style.borderColor = agent.color + '60'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
                ;(e.currentTarget as HTMLDivElement).style.borderColor = agent.border
              }}
            >
              {/* Sweep */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `linear-gradient(135deg, transparent 30%, ${agent.bg} 50%, transparent 70%)` }}
              />

              <div className="relative z-10 p-5">
                {/* Top row */}
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 transition-transform group-hover:scale-110"
                    style={{
                      background: `linear-gradient(135deg,${agent.gradFrom},${agent.gradTo})`,
                      boxShadow: `0 0 20px ${agent.glow}`,
                    }}
                  >
                    {agent.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-bold text-lg text-white">{agent.name}</h3>
                      <span
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded tracking-widest"
                        style={{ background: `${agent.color}20`, color: agent.color, border: `1px solid ${agent.color}40` }}
                      >
                        IA
                      </span>
                    </div>
                    <p className="text-xs font-semibold mb-1" style={{ color: agent.color }}>{agent.role}</p>
                    <p className="text-xs leading-relaxed" style={{ color: '#a094c0' }}>{agent.description}</p>
                  </div>
                </div>

                {/* Quick prompts preview */}
                <div
                  className="pt-3 space-y-1.5"
                  style={{ borderTop: `1px solid ${agent.border}` }}
                >
                  <p className="text-[9px] font-bold tracking-widest mb-2" style={{ color: '#7a6fa0' }}>
                    SUGESTÕES
                  </p>
                  {agent.quickPrompts.slice(0, 2).map((p) => (
                    <p key={p} className="text-xs flex items-start gap-1.5" style={{ color: '#a094c0' }}>
                      <Sparkles className="w-3 h-3 mt-0.5 shrink-0" style={{ color: agent.color }} />
                      {p}
                    </p>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex items-center gap-1.5 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs font-semibold" style={{ color: agent.color }}>
                    Conversar com {agent.name}
                  </span>
                  <Zap className="w-3 h-3" style={{ color: agent.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  /* ── Chat with agent ──────────────────────────── */
  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] md:h-[calc(100vh-8rem)] max-w-3xl mx-auto gap-4">

      {/* Chat header */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all"
          style={{ color: '#a094c0', border: '1px solid rgba(168,85,247,0.1)' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#f0eeff' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#a094c0' }}
          onClick={() => setSelectedAgent(null)}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Agentes
        </button>

        <div className="flex items-center gap-3 flex-1">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
            style={{
              background: `linear-gradient(135deg,${selectedAgent.gradFrom},${selectedAgent.gradTo})`,
              boxShadow: `0 0 16px ${selectedAgent.glow}`,
            }}
          >
            {selectedAgent.emoji}
          </div>
          <div>
            <p className="font-semibold text-white">{selectedAgent.name}</p>
            <p className="cyber-text">{selectedAgent.role}</p>
          </div>
        </div>

        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider"
          style={{
            background: `${selectedAgent.color}15`,
            border: `1px solid ${selectedAgent.color}40`,
            color: selectedAgent.color,
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: selectedAgent.color }} />
          ONLINE
        </div>
      </div>

      {/* Chat body */}
      <div
        className="flex-1 overflow-hidden rounded-2xl flex flex-col"
        style={{
          background: 'rgba(5,3,14,0.92)',
          border: `1px solid ${selectedAgent.border}`,
          backdropFilter: 'blur(24px)',
        }}
      >
        <ScrollArea className="flex-1 p-5">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4"
                style={{
                  background: `linear-gradient(135deg,${selectedAgent.gradFrom},${selectedAgent.gradTo})`,
                  boxShadow: `0 0 30px ${selectedAgent.glow}`,
                }}
              >
                {selectedAgent.emoji}
              </div>
              <h3 className="font-semibold text-white mb-1">{selectedAgent.name}</h3>
              <p className="text-sm mb-6 max-w-sm leading-relaxed" style={{ color: '#a094c0' }}>
                {selectedAgent.description}
              </p>
              <div className="space-y-2 w-full max-w-sm">
                {selectedAgent.quickPrompts.map((p) => (
                  <button
                    key={p}
                    onClick={() => sendMessage(p)}
                    className="w-full text-left p-3 rounded-xl text-xs transition-all duration-200"
                    style={{ background: `${selectedAgent.color}08`, border: `1px solid ${selectedAgent.border}`, color: '#9b8cc0' }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = `${selectedAgent.color}50`
                      ;(e.currentTarget as HTMLButtonElement).style.background = `${selectedAgent.color}15`
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = selectedAgent.border
                      ;(e.currentTarget as HTMLButtonElement).style.background = `${selectedAgent.color}08`
                    }}
                  >
                    <Sparkles className="w-3 h-3 inline mr-1.5" style={{ color: selectedAgent.color }} />
                    {p}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn('flex gap-3', msg.role === 'user' ? 'justify-end' : '')}
                >
                  {msg.role === 'assistant' && (
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0 mt-0.5"
                      style={{
                        background: `linear-gradient(135deg,${selectedAgent.gradFrom},${selectedAgent.gradTo})`,
                        boxShadow: `0 0 12px ${selectedAgent.glow}`,
                      }}
                    >
                      {selectedAgent.emoji}
                    </div>
                  )}
                  <div
                    className="max-w-[80%] rounded-2xl px-4 py-3 text-sm"
                    style={
                      msg.role === 'user'
                        ? {
                            background: `${selectedAgent.color}18`,
                            border: `1px solid ${selectedAgent.color}40`,
                            color: '#f0eeff',
                          }
                        : {
                            background: 'rgba(5,3,14,0.94)',
                            border: '1px solid rgba(168,85,247,0.1)',
                            backdropFilter: 'blur(12px)',
                          }
                    }
                  >
                    {msg.role === 'assistant' ? (
                      msg.content ? (
                        <div className="prose prose-invert prose-sm max-w-none">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <div className="flex gap-1 py-1">
                          {[0, 150, 300].map((delay) => (
                            <div
                              key={delay}
                              className="w-1.5 h-1.5 rounded-full animate-bounce"
                              style={{ background: selectedAgent.color, animationDelay: `${delay}ms`, boxShadow: `0 0 6px ${selectedAgent.glow}` }}
                            />
                          ))}
                        </div>
                      )
                    ) : (
                      msg.content
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)' }}
                    >
                      <User className="w-4 h-4" style={{ color: '#c084fc' }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div
          className="p-4 flex gap-2 shrink-0"
          style={{ borderTop: `1px solid ${selectedAgent.border}` }}
        >
          <Textarea
            placeholder={`Pergunte para ${selectedAgent.name}...`}
            className="resize-none min-h-[44px] max-h-[120px] text-sm rounded-xl"
            style={{ background: `${selectedAgent.color}08`, border: `1px solid ${selectedAgent.border}`, color: '#f0eeff' }}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
              }
            }}
          />
          <Button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="shrink-0 h-11 w-11 p-0 rounded-xl border-0 text-white transition-opacity hover:opacity-90 disabled:opacity-40"
            style={{ background: `linear-gradient(135deg,${selectedAgent.gradFrom},${selectedAgent.gradTo})`, boxShadow: `0 0 20px ${selectedAgent.glow}` }}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
