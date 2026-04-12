export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type PlanType = 'trial' | 'pro'
export type ProductType = 'ebook' | 'curso' | 'oferta'
export type AIModel = 'claude' | 'gpt' | 'gemini'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar_url: string | null
          plan: PlanType
          trial_ends_at: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          generations_used: number
          generations_limit: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          avatar_url?: string | null
          plan?: PlanType
          trial_ends_at?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          generations_used?: number
          generations_limit?: number
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      projects: {
        Row: {
          id: string
          user_id: string
          type: ProductType
          title: string
          niche: string | null
          status: 'draft' | 'completed'
          content: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: ProductType
          title: string
          niche?: string | null
          status?: 'draft' | 'completed'
          content?: Json
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['projects']['Insert']>
      }
      chat_sessions: {
        Row: {
          id: string
          user_id: string
          model: AIModel
          title: string
          messages: Json[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          model?: AIModel
          title?: string
          messages?: Json[]
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['chat_sessions']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      plan_type: PlanType
      product_type: ProductType
      ai_model: AIModel
    }
  }
}

// Convenient row types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Project = Database['public']['Tables']['projects']['Row']
export type ChatSession = Database['public']['Tables']['chat_sessions']['Row']
