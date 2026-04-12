import Link from 'next/link'
import { Zap, BookOpen, GraduationCap, Megaphone, MessageSquare, Bot, Check, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const features = [
  { icon: BookOpen, title: 'Gerador de eBook', desc: 'Crie ebooks completos com sumário, capítulos e capa prontos para vender', color: 'text-purple-400' },
  { icon: GraduationCap, title: 'Gerador de Curso', desc: 'Estrutura de módulos, aulas e scripts de gravação automaticamente', color: 'text-blue-400' },
  { icon: Megaphone, title: 'Gerador de Oferta', desc: 'Copy, criativos, funil e scripts de WhatsApp em 1 clique', color: 'text-yellow-400' },
  { icon: MessageSquare, title: 'Chat IA Multi-Modelo', desc: 'GPT-4o, Claude e Gemini em uma única interface', color: 'text-green-400' },
  { icon: Bot, title: 'Agentes Especializados', desc: 'Copywriter, tráfego pago, funil e social media com personalidade IA', color: 'text-pink-400' },
  { icon: Zap, title: 'Gerar Tudo', desc: 'Produto digital completo criado automaticamente com um clique', color: 'text-orange-400' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background stars-bg">
      {/* Nav */}
      <nav className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg gradient-cash flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl gradient-cash-text">Cash.IA</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Entrar</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="gradient-cash text-white border-0 hover:opacity-90">
                Começar grátis
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-24 pb-16 text-center">
        <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 px-4 py-1.5">
          ⚡ Powered by Claude, GPT-4o & Gemini
        </Badge>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Crie produtos digitais que{' '}
          <span className="gradient-cash-text">geram dinheiro</span>
          <br />
          com inteligência artificial
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          eBooks, cursos e ofertas prontos para vender em minutos.
          Sem precisar saber escrever. Sem precisar ser expert.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup">
            <Button
              size="lg"
              className="gradient-cash text-white border-0 hover:opacity-90 font-semibold gap-2 px-8 text-base"
            >
              <Zap className="w-5 h-5" />
              Criar conta grátis — 30 dias
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="border-border/60 hover:bg-white/5 text-base">
              Ver demo
            </Button>
          </Link>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Sem cartão de crédito · Cancele quando quiser
        </p>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Tudo que você precisa para vender</h2>
          <p className="text-muted-foreground">Uma plataforma completa para criar e vender infoprodutos</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="glass border border-border/40 rounded-xl p-6 hover:border-primary/20 transition-colors"
            >
              <f.icon className={`w-8 h-8 ${f.color} mb-3`} />
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-3">Preços simples e justos</h2>
        <p className="text-muted-foreground mb-12">Comece grátis, faça upgrade quando precisar</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {/* Trial */}
          <div className="glass border border-border/40 rounded-2xl p-6">
            <p className="text-sm font-medium text-muted-foreground mb-1">Trial</p>
            <p className="text-4xl font-bold mb-1">Grátis</p>
            <p className="text-sm text-muted-foreground mb-6">por 30 dias</p>
            {['10 gerações', 'Todos os geradores', 'Chat IA', 'Suporte email'].map((f) => (
              <div key={f} className="flex items-center gap-2 mb-2 text-sm">
                <Check className="w-4 h-4 text-primary" />
                {f}
              </div>
            ))}
            <Link href="/signup" className="block mt-6">
              <Button className="w-full" variant="outline">Começar grátis</Button>
            </Link>
          </div>

          {/* Pro */}
          <div className="relative border-2 border-yellow-500/40 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 rounded-2xl p-6 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 gradient-cash" />
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium text-yellow-400">Pro</p>
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">Popular</Badge>
            </div>
            <p className="text-4xl font-bold mb-1">R$ 97</p>
            <p className="text-sm text-muted-foreground mb-6">/mês</p>
            {['Gerações ilimitadas', 'Agentes especializados', 'Exportação PDF', 'Suporte prioritário', 'Atualizações vitalícias'].map((f) => (
              <div key={f} className="flex items-center gap-2 mb-2 text-sm">
                <Check className="w-4 h-4 text-yellow-400" />
                {f}
              </div>
            ))}
            <Link href="/signup" className="block mt-6">
              <Button className="w-full gradient-cash text-white border-0 hover:opacity-90 font-semibold">
                Começar com Pro
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="glass border border-primary/20 rounded-2xl p-12">
          <Zap className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse-neon" />
          <h2 className="text-3xl font-bold mb-3">
            Pronto para criar seu primeiro produto?
          </h2>
          <p className="text-muted-foreground mb-8">
            Junte-se a empreendedores que usam IA para criar produtos que vendem
          </p>
          <Link href="/signup">
            <Button
              size="lg"
              className="gradient-cash text-white border-0 hover:opacity-90 font-semibold gap-2 px-10"
            >
              <Zap className="w-5 h-5" />
              Criar conta grátis
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 text-center text-sm text-muted-foreground">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-6 h-6 rounded gradient-cash flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold gradient-cash-text">Cash.IA</span>
        </div>
        <p>© {new Date().getFullYear()} Cash.IA — Crie produtos digitais que geram dinheiro</p>
      </footer>
    </div>
  )
}
