'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  GraduationCap,
  Sparkles,
  Loader2,
  PlayCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  FileText,
  Zap,
} from 'lucide-react'
import { toast } from 'sonner'

interface Lesson {
  number: number
  title: string
  duration: string
  type: string
  script: string
}

interface Module {
  number: number
  title: string
  description: string
  lessons: Lesson[]
}

interface CourseData {
  courseName: string
  tagline: string
  description: string
  modules: Module[]
  bonuses: string[]
  targetResult: string
}

export function CourseGenerator() {
  const [loading, setLoading] = useState(false)
  const [course, setCourse] = useState<CourseData | null>(null)
  const [expandedModule, setExpandedModule] = useState<number | null>(0)
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null)
  const [model, setModel] = useState('claude')

  const [form, setForm] = useState({
    topic: '',
    audience: '',
    duration: '4 semanas',
    level: 'iniciante',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/ai/curso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, model }),
      })

      const { data, error } = await res.json()
      if (error) { toast.error(error); return }

      setCourse(data)
      toast.success('Estrutura do curso gerada!')
    } catch {
      toast.error('Erro ao gerar o curso.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    background: 'rgba(56,189,248,0.05)',
    border: '1px solid rgba(56,189,248,0.15)',
    color: '#f0eeff',
    borderRadius: '12px',
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* ── Header ────────────────────────────────── */}
      <div className="flex items-center gap-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: 'rgba(56,189,248,0.12)',
            border: '1px solid rgba(56,189,248,0.3)',
            boxShadow: '0 0 20px rgba(56,189,248,0.15)',
          }}
        >
          <GraduationCap className="w-5 h-5" style={{ color: '#38bdf8' }} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Gerador de Curso</h1>
          <p className="cyber-text mt-0.5">ESTRUTURA COMPLETA DE MÓDULOS, AULAS E SCRIPTS</p>
        </div>
      </div>

      {/* ── Form ──────────────────────────────────── */}
      {!course && (
        <div
          className="rounded-2xl p-6"
          style={{
            background: 'rgba(5,3,14,0.92)',
            border: '1px solid rgba(56,189,248,0.12)',
            backdropFilter: 'blur(24px)',
          }}
        >
          <div className="mb-5">
            <h2 className="text-base font-semibold text-white">Configurar seu curso</h2>
            <p className="text-xs mt-0.5" style={{ color: '#a094c0' }}>
              A IA vai criar módulos, aulas e scripts completos
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold tracking-wide" style={{ color: '#9b8cc0' }}>
                  TEMA DO CURSO *
                </Label>
                <Input
                  placeholder="Ex: Marketing Digital para Iniciantes"
                  style={inputStyle}
                  value={form.topic}
                  onChange={(e) => setForm({ ...form, topic: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold tracking-wide" style={{ color: '#9b8cc0' }}>
                  PÚBLICO-ALVO *
                </Label>
                <Input
                  placeholder="Ex: Empreendedores que querem vender online"
                  style={inputStyle}
                  value={form.audience}
                  onChange={(e) => setForm({ ...form, audience: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold tracking-wide" style={{ color: '#9b8cc0' }}>
                  DURAÇÃO ESTIMADA
                </Label>
                <Select value={form.duration} onValueChange={(v) => v && setForm({ ...form, duration: v })}>
                  <SelectTrigger className="rounded-xl" style={inputStyle}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1 semana">1 semana</SelectItem>
                    <SelectItem value="2 semanas">2 semanas</SelectItem>
                    <SelectItem value="4 semanas">4 semanas</SelectItem>
                    <SelectItem value="6 semanas">6 semanas</SelectItem>
                    <SelectItem value="3 meses">3 meses</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold tracking-wide" style={{ color: '#9b8cc0' }}>
                  NÍVEL
                </Label>
                <Select value={form.level} onValueChange={(v) => v && setForm({ ...form, level: v })}>
                  <SelectTrigger className="rounded-xl" style={inputStyle}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="iniciante">Iniciante</SelectItem>
                    <SelectItem value="intermediário">Intermediário</SelectItem>
                    <SelectItem value="avançado">Avançado</SelectItem>
                  </SelectContent>
                </Select>
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
              style={{ background: 'linear-gradient(135deg,#0ea5e9,#6366f1,#38bdf8)', height: '44px' }}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {loading ? 'Gerando estrutura...' : 'Gerar Estrutura do Curso'}
            </Button>
          </form>
        </div>
      )}

      {/* ── Course result ─────────────────────────── */}
      {course && (
        <div className="space-y-4">
          {/* Course header */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: 'rgba(56,189,248,0.05)',
              border: '1px solid rgba(56,189,248,0.2)',
              backdropFilter: 'blur(24px)',
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded tracking-widest"
                style={{ background: 'rgba(56,189,248,0.15)', color: '#38bdf8', border: '1px solid rgba(56,189,248,0.3)' }}
              >
                {form.level.toUpperCase()}
              </span>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded tracking-widest"
                style={{ background: 'rgba(168,85,247,0.1)', color: '#c084fc', border: '1px solid rgba(168,85,247,0.2)' }}
              >
                {form.duration.toUpperCase()}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">{course.courseName}</h2>
            <p className="italic mb-3" style={{ color: '#38bdf8' }}>{course.tagline}</p>
            <p className="text-sm mb-4 leading-relaxed" style={{ color: '#9b8cc0' }}>{course.description}</p>

            <div
              className="p-3 rounded-xl"
              style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)' }}
            >
              <p className="text-[10px] font-bold tracking-wider mb-1" style={{ color: '#34d399' }}>
                RESULTADO DO ALUNO
              </p>
              <p className="text-sm text-white">{course.targetResult}</p>
            </div>

            {course.bonuses.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {course.bonuses.map((bonus, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(251,191,36,0.1)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.2)' }}
                  >
                    🎁 {bonus}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Modules */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap className="w-4 h-4" style={{ color: '#38bdf8' }} />
              <p className="cyber-text">{course.modules.length} MÓDULOS</p>
            </div>
            <div className="space-y-2">
              {course.modules.map((mod) => (
                <div
                  key={mod.number}
                  className="rounded-xl overflow-hidden"
                  style={{
                    background: 'rgba(5,3,14,0.92)',
                    border: expandedModule === mod.number
                      ? '1px solid rgba(56,189,248,0.25)'
                      : '1px solid rgba(56,189,248,0.1)',
                    backdropFilter: 'blur(20px)',
                  }}
                >
                  <button
                    className="w-full p-4 flex items-center gap-3 text-left transition-colors hover:bg-sky-500/5"
                    onClick={() => setExpandedModule(expandedModule === mod.number ? null : mod.number)}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(56,189,248,0.15)', border: '1px solid rgba(56,189,248,0.3)' }}
                    >
                      <span className="text-xs font-bold" style={{ color: '#38bdf8' }}>{mod.number}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-white">{mod.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#a094c0' }}>
                        {mod.lessons.length} aulas
                      </p>
                    </div>
                    {expandedModule === mod.number ? (
                      <ChevronUp className="w-4 h-4 shrink-0" style={{ color: '#a094c0' }} />
                    ) : (
                      <ChevronDown className="w-4 h-4 shrink-0" style={{ color: '#a094c0' }} />
                    )}
                  </button>

                  {expandedModule === mod.number && (
                    <div className="px-4 pb-4 space-y-2" style={{ borderTop: '1px solid rgba(56,189,248,0.08)' }}>
                      <p className="text-xs py-3 pl-11" style={{ color: '#a094c0' }}>{mod.description}</p>
                      {mod.lessons.map((lesson) => {
                        const lessonKey = `${mod.number}-${lesson.number}`
                        return (
                          <div
                            key={lesson.number}
                            className="pl-11"
                            style={{ borderLeft: '2px solid rgba(56,189,248,0.15)' }}
                          >
                            <button
                              className="w-full flex items-center gap-3 py-2 text-left"
                              onClick={() => setExpandedLesson(expandedLesson === lessonKey ? null : lessonKey)}
                            >
                              <PlayCircle className="w-4 h-4 shrink-0" style={{ color: '#38bdf8' }} />
                              <span className="flex-1 text-sm text-white">{lesson.title}</span>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="flex items-center gap-1 text-[10px]" style={{ color: '#a094c0' }}>
                                  <Clock className="w-3 h-3" />
                                  {lesson.duration}
                                </span>
                                <span
                                  className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                                  style={{ background: 'rgba(56,189,248,0.1)', color: '#38bdf8', border: '1px solid rgba(56,189,248,0.2)' }}
                                >
                                  {lesson.type}
                                </span>
                              </div>
                            </button>
                            {expandedLesson === lessonKey && lesson.script && (
                              <div
                                className="mt-2 mb-3 p-3 rounded-xl"
                                style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(56,189,248,0.1)' }}
                              >
                                <div className="flex items-center gap-1.5 mb-2">
                                  <FileText className="w-3 h-3" style={{ color: '#38bdf8' }} />
                                  <span className="text-[9px] font-bold tracking-widest" style={{ color: '#38bdf8' }}>
                                    SCRIPT DA AULA
                                  </span>
                                </div>
                                <p className="text-xs whitespace-pre-wrap leading-relaxed" style={{ color: '#9b8cc0' }}>
                                  {lesson.script}
                                </p>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="rounded-xl"
              style={{ borderColor: 'rgba(56,189,248,0.2)', color: '#9b8cc0', background: 'transparent' }}
              onClick={() => setCourse(null)}
            >
              Refazer
            </Button>
            <Button
              className="flex-1 rounded-xl font-semibold gap-2 text-white border-0 hover:opacity-90 btn-glow"
              style={{ background: 'linear-gradient(135deg,#0ea5e9,#6366f1,#38bdf8)' }}
            >
              <Zap className="w-4 h-4" />
              Gerar Oferta para este Curso
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
