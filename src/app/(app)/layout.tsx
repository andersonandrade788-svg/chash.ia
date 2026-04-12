import { AppShell } from '@/components/layout/app-shell'
import type { Profile } from '@/types/database'

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

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  let profile: Profile | null = DEMO_PROFILE

  if (process.env.NEXT_PUBLIC_DEMO_MODE !== 'true') {
    const { redirect } = await import('next/navigation')
    const { createClient } = await import('@/lib/supabase/server')

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user!.id)
      .single()

    profile = profileData as Profile | null
  }

  return <AppShell profile={profile}>{children}</AppShell>
}
