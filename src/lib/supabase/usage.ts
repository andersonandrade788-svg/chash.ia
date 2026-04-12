import type { SupabaseClient } from '@supabase/supabase-js'
import type { PlanType } from '@/types/database'

interface UsageProfile {
  plan: PlanType
  generations_used: number
  generations_limit: number
}

/**
 * Checks if the user has reached their generation limit.
 * Returns the profile data or null if limit is reached.
 */
export async function checkUsageLimit(
  supabase: SupabaseClient,
  userId: string
): Promise<{ allowed: boolean; profile: UsageProfile | null }> {
  const { data } = await supabase
    .from('profiles')
    .select('plan, generations_used, generations_limit')
    .eq('id', userId)
    .single()

  const profile = data as UsageProfile | null

  if (!profile) return { allowed: false, profile: null }

  const allowed =
    profile.plan === 'pro' ||
    profile.generations_used < profile.generations_limit

  return { allowed, profile }
}

/**
 * Increments the generation counter for a user.
 */
export async function incrementUsage(
  supabase: SupabaseClient,
  userId: string,
  currentCount: number
): Promise<void> {
  await supabase
    .from('profiles')
    .update({ generations_used: currentCount + 1 })
    .eq('id', userId)
}
