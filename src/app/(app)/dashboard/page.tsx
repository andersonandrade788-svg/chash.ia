import { DashboardClient } from '@/components/dashboard/dashboard-client'
import type { Profile, Project } from '@/types/database'

const DEMO_PROFILE: Profile = {
  id: 'demo-user',
  email: 'demo@cashia.com',
  name: 'Empreendedor',
  avatar_url: null,
  plan: 'trial',
  trial_ends_at: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
  stripe_customer_id: null,
  stripe_subscription_id: null,
  generations_used: 3,
  generations_limit: 10,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

const DEMO_PROJECTS: Project[] = [
  {
    id: '1',
    user_id: 'demo-user',
    type: 'ebook',
    title: 'Do Zero ao Primeiro Salário Digital',
    niche: 'Renda Online',
    status: 'completed',
    content: {},
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    user_id: 'demo-user',
    type: 'oferta',
    title: 'Oferta: Método Renda Digital',
    niche: 'Marketing Digital',
    status: 'completed',
    content: {},
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    user_id: 'demo-user',
    type: 'curso',
    title: 'Renda Digital com IA: Do Zero ao Cliente',
    niche: 'IA e Tecnologia',
    status: 'draft',
    content: {},
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export default async function DashboardPage() {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
    return <DashboardClient profile={DEMO_PROFILE} recentProjects={DEMO_PROJECTS} />
  }

  const { createClient } = await import('@/lib/supabase/server')
  const { redirect } = await import('next/navigation')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const userId = user!.id
  const { data: profileData } = await supabase.from('profiles').select('*').eq('id', userId).single()
  const { data: projects } = await supabase.from('projects').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(6)

  return <DashboardClient profile={profileData as Profile | null} recentProjects={projects ?? []} />
}
