-- ══════════════════════════════════════════════════
-- Cash.IA — Supabase Schema
-- Execute no SQL Editor do Supabase
-- ══════════════════════════════════════════════════

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── Enums ──────────────────────────────────────────
create type plan_type as enum ('trial', 'pro');
create type product_type as enum ('ebook', 'curso', 'oferta');
create type ai_model as enum ('claude', 'gpt', 'gemini');

-- ── Profiles ───────────────────────────────────────
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  name text,
  avatar_url text,
  plan plan_type default 'trial' not null,
  trial_ends_at timestamptz default (now() + interval '30 days'),
  stripe_customer_id text,
  stripe_subscription_id text,
  generations_used integer default 0 not null,
  generations_limit integer default 10 not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- ── Projects ───────────────────────────────────────
create table public.projects (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type product_type not null,
  title text not null,
  niche text,
  status text default 'draft' check (status in ('draft', 'completed')),
  content jsonb default '{}',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.projects enable row level security;

create policy "Users can CRUD own projects"
  on public.projects for all
  using (auth.uid() = user_id);

-- ── Chat Sessions ──────────────────────────────────
create table public.chat_sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  model ai_model default 'claude' not null,
  title text default 'Nova Conversa',
  messages jsonb[] default '{}',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.chat_sessions enable row level security;

create policy "Users can CRUD own chat sessions"
  on public.chat_sessions for all
  using (auth.uid() = user_id);

-- ── Auto-create profile on signup ──────────────────
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Updated_at trigger ─────────────────────────────
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger projects_updated_at
  before update on public.projects
  for each row execute procedure public.handle_updated_at();

create trigger chat_sessions_updated_at
  before update on public.chat_sessions
  for each row execute procedure public.handle_updated_at();
