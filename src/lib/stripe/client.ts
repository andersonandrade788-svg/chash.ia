import Stripe from 'stripe'

/** Returns a Stripe instance — lazy so build doesn't fail without env vars */
export function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set')
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2026-03-25.dahlia' as const,
  })
}

export const PLANS = {
  trial: {
    name: 'Trial',
    price: 0,
    generationsLimit: 10,
    features: [
      '10 gerações gratuitas',
      'Gerador de eBook',
      'Gerador de Curso',
      'Gerador de Oferta',
      'Chat IA (Claude, GPT, Gemini)',
      'Suporte por email',
    ],
  },
  pro: {
    name: 'Pro',
    price: 97,
    generationsLimit: 999999,
    features: [
      'Gerações ilimitadas',
      'Todos os recursos do Trial',
      'Agentes IA especializados',
      'Gerador de imagens (em breve)',
      'Exportação em PDF',
      'Suporte prioritário',
      'Atualizações vitalícias',
    ],
  },
} as const
