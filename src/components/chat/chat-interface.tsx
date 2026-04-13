'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  MessageSquare,
  Send,
  Loader2,
  Bot,
  User,
  Sparkles,
  Zap,
  RefreshCw,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import type { AIModel } from '@/types/database'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const models: { id: AIModel; label: string; description: string; color: string; glow: string; dot: string }[] = [
  {
    id: 'claude',
    label: 'Claude',
    description: 'Melhor para textos longos',
    color: '#c084fc',
    glow: 'rgba(168,85,247,0.35)',
    dot: '#a855f7',
  },
  {
    id: 'gpt',
    label: 'GPT-4o',
    description: 'Mais popular',
    color: '#34d399',
    glow: 'rgba(52,211,153,0.35)',
    dot: '#10b981',
  },
  {
    id: 'gemini',
    label: 'Gemini',
    description: 'Google AI',
    color: '#38bdf8',
    glow: 'rgba(56,189,248,0.35)',
    dot: '#0ea5e9',
  },
]

const quickPrompts = [
  'Me dê 5 ideias de ebooks lucrativos para o nicho de saúde',
  'Crie um hook poderoso para um anúncio de curso de finanças',
  'Como montar um funil de vendas para infoprodutos?',
  'Quais os maiores erros de quem vende produtos digitais?',
]

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState<AIModel>('claude')
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  async function sendMessage(content?: string) {
    const text = content ?? input.trim()
    if (!text || loading) return

    const userMessage: Message = { role: 'user', content: text }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    setMessages((prev) => [...prev, { role: 'assistant', content: '' }])

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, model: selectedModel }),
      })

      if (!res.body) throw new Error('No stream')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let assistantText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        assistantText += decoder.decode(value, { stream: true })
        setMessages((prev) => {
          const updated = [...prev]
          updated[updated.length - 1] = { role: 'assistant', content: assistantText }
          return updated
        })
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          role: 'assistant',
          content: 'Erro ao processar resposta. Tente novamente.',
        }
        return updated
      })
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const activeModel = models.find((m) => m.id === selectedModel)!

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] md:h-[calc(100vh-8rem)] max-w-4xl mx-auto gap-4">

      {/* ── Header ────────────────────────────────── */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.25)' }}
          >
            <MessageSquare className="w-5 h-5" style={{ color: '#34d399' }} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Chat IA</h1>
            <p className="cyber-text">MULTI-MODELO EM TEMPO REAL</p>
          </div>
        </div>

        {/* Model selector */}
        <div className="hidden sm:flex gap-2">
          {models.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedModel(m.id)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
              style={
                selectedModel === m.id
                  ? {
                      background: `rgba(${m.color === '#c084fc' ? '168,85,247' : m.color === '#34d399' ? '52,211,153' : '56,189,248'},0.15)`,
                      border: `1px solid ${m.glow.replace('0.35', '0.5')}`,
                      color: m.color,
                      boxShadow: `0 0 12px ${m.glow}`,
                    }
                  : {
                      background: 'transparent',
                      border: '1px solid rgba(168,85,247,0.12)',
                      color: '#a094c0',
                    }
              }
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Model selector mobile */}
      <div className="sm:hidden flex gap-2 shrink-0">
        {models.map((m) => (
          <button
            key={m.id}
            onClick={() => setSelectedModel(m.id)}
            className="flex-1 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
            style={
              selectedModel === m.id
                ? {
                    background: `rgba(${m.color === '#c084fc' ? '168,85,247' : m.color === '#34d399' ? '52,211,153' : '56,189,248'},0.15)`,
                    border: `1px solid ${m.glow.replace('0.35', '0.5')}`,
                    color: m.color,
                  }
                : {
                    background: 'transparent',
                    border: '1px solid rgba(168,85,247,0.12)',
                    color: '#a094c0',
                  }
            }
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* ── Chat area ─────────────────────────────── */}
      <div
        className="flex-1 min-h-0 rounded-2xl flex flex-col"
        style={{
          background: 'rgba(5,3,14,0.92)',
          border: '1px solid rgba(168,85,247,0.12)',
          backdropFilter: 'blur(24px)',
        }}
      >
        <div
          ref={scrollRef}
          className="p-5"
          style={{ flex: '1 1 0', overflowY: 'auto', minHeight: 0 }}
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 relative"
                style={{
                  background: 'linear-gradient(135deg,#9333ea,#6366f1,#38bdf8)',
                  boxShadow: '0 0 40px rgba(168,85,247,0.4)',
                }}
              >
                <div className="absolute inset-0 rounded-2xl animate-pulse-neon" />
                <Sparkles className="w-8 h-8 text-white relative z-10" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Olá! Sou o assistente da{' '}
                <span className="gradient-cash-text">Cash.IA</span>
              </h3>
              <p className="text-sm mb-6 max-w-md leading-relaxed" style={{ color: '#a094c0' }}>
                Especialista em infoprodutos, copywriting e marketing digital.
                Pergunte qualquer coisa sobre criar e vender produtos digitais.
              </p>

              {/* Model active indicator */}
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-xs"
                style={{
                  background: `rgba(${activeModel.color === '#c084fc' ? '168,85,247' : activeModel.color === '#34d399' ? '52,211,153' : '56,189,248'},0.1)`,
                  border: `1px solid ${activeModel.glow}`,
                  color: activeModel.color,
                }}
              >
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: activeModel.dot }} />
                {activeModel.label} ativo
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    className="text-left p-3 rounded-xl text-xs transition-all duration-200 group"
                    style={{ background: 'rgba(168,85,247,0.05)', border: '1px solid rgba(168,85,247,0.12)', color: '#9b8cc0' }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(168,85,247,0.35)'
                      ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(168,85,247,0.1)'
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(168,85,247,0.12)'
                      ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(168,85,247,0.05)'
                    }}
                  >
                    <Zap className="w-3 h-3 inline mr-1.5" style={{ color: '#a855f7' }} />
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn('flex gap-3', msg.role === 'user' ? 'justify-end' : 'justify-start')}
                >
                  {msg.role === 'assistant' && (
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                      style={{
                        background: 'linear-gradient(135deg,#9333ea,#38bdf8)',
                        boxShadow: '0 0 16px rgba(168,85,247,0.4)',
                      }}
                    >
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}

                  <div
                    className="max-w-[80%] rounded-2xl px-4 py-3 text-sm"
                    style={
                      msg.role === 'user'
                        ? {
                            background: 'rgba(168,85,247,0.15)',
                            border: '1px solid rgba(168,85,247,0.3)',
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
                        <div className="flex items-center gap-1.5 py-1">
                          {[0, 150, 300].map((delay) => (
                            <div
                              key={delay}
                              className="w-1.5 h-1.5 rounded-full animate-bounce"
                              style={{ background: '#a855f7', animationDelay: `${delay}ms`, boxShadow: '0 0 6px rgba(168,85,247,0.8)' }}
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
        </div>

        {/* ── Input area ────────────────────────── */}
        <div
          className="p-4 shrink-0"
          style={{ borderTop: '1px solid rgba(168,85,247,0.1)' }}
        >
          <div className="flex items-center gap-2 mb-2.5">
            <div
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider"
              style={{
                background: `rgba(${activeModel.color === '#c084fc' ? '168,85,247' : activeModel.color === '#34d399' ? '52,211,153' : '56,189,248'},0.1)`,
                border: `1px solid ${activeModel.glow.replace('0.35', '0.4')}`,
                color: activeModel.color,
              }}
            >
              <div className="w-1 h-1 rounded-full" style={{ background: activeModel.dot }} />
              {activeModel.label}
            </div>
            {messages.length > 0 && (
              <button
                onClick={() => setMessages([])}
                className="ml-auto flex items-center gap-1 text-[10px] transition-colors hover:text-white"
                style={{ color: '#a094c0' }}
              >
                <RefreshCw className="w-2.5 h-2.5" />
                Limpar conversa
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <Textarea
              ref={textareaRef}
              placeholder="Pergunte sobre infoprodutos, copy, tráfego, funis..."
              className="resize-none min-h-[44px] max-h-[120px] text-sm rounded-xl"
              style={{
                background: 'rgba(168,85,247,0.05)',
                border: '1px solid rgba(168,85,247,0.15)',
                color: '#f0eeff',
              }}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="shrink-0 h-11 w-11 p-0 rounded-xl border-0 text-white transition-opacity hover:opacity-90 disabled:opacity-40 btn-glow"
              style={{ background: 'linear-gradient(135deg,#9333ea,#6366f1,#38bdf8)' }}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-[10px] text-center mt-1.5" style={{ color: '#7a6fa0' }}>
            Enter para enviar · Shift+Enter para nova linha
          </p>
        </div>
      </div>
    </div>
  )
}
