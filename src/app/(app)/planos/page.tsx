'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PLANS } from '@/lib/stripe/client'
// PLANS is used as static data only — no Stripe initialization at import time
import { Check, Zap, Crown, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function PlanosPage() {
  const [loading, setLoading] = useState(false)

  async function handleUpgrade() {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' })
      const { url, error } = await res.json()
      if (error) { toast.error(error); return }
      window.location.href = url
    } catch {
      toast.error('Erro ao processar pagamento.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Escolha seu plano</h1>
        <p className="text-muted-foreground">
          Comece grátis e faça upgrade quando precisar de mais poder
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Trial */}
        <Card className="glass border-border/40">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-primary" />
              <CardTitle>Trial</CardTitle>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">R$ 0</span>
              <span className="text-muted-foreground">/mês</span>
            </div>
            <p className="text-sm text-muted-foreground">Por 30 dias</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2.5">
              {PLANS.trial.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full border-border/60" disabled>
              Plano atual
            </Button>
          </CardContent>
        </Card>

        {/* Pro */}
        <Card
          className={cn(
            'border-2 border-yellow-500/40 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 relative overflow-hidden'
          )}
        >
          <div className="absolute top-0 right-0 left-0 h-0.5 gradient-cash" />
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-400" />
                <CardTitle>Pro</CardTitle>
              </div>
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                Mais popular
              </Badge>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">R$ 97</span>
              <span className="text-muted-foreground">/mês</span>
            </div>
            <p className="text-sm text-muted-foreground">Acesso ilimitado</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2.5">
              {PLANS.pro.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-yellow-400 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              className="w-full gradient-cash text-white border-0 hover:opacity-90 font-semibold gap-2"
              onClick={handleUpgrade}
              disabled={loading}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Crown className="w-4 h-4" />}
              {loading ? 'Redirecionando...' : 'Assinar Pro — R$97/mês'}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Cancele a qualquer momento
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="text-center p-4 rounded-xl border border-border/40 bg-white/3">
        <p className="text-sm text-muted-foreground">
          💳 Pagamento seguro via Stripe · 🔒 SSL · 🏦 Cartão de crédito ou débito
        </p>
      </div>
    </div>
  )
}
