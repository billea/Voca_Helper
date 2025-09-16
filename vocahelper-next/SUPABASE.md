# Supabase Setup (VocaHelper)

This app stores drafts and submissions in Supabase. Follow these steps to enable it:

## 1) Create project and get keys

1. Create a Supabase project (Region + free plan is fine).
2. In Project Settings → API, copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Create a `.env.local` in `vocahelper-next/`:

```
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

> For development, we use the anon key and no auth. For production, configure RLS policies for per‑user access and add auth.

## 2) Database schema (per-user with RLS)

Run this SQL in the Supabase SQL editor:

```sql
-- Drafts table
create table if not exists public.drafts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  genre text not null,
  lesson text not null,
  content text not null,
  word_count int not null,
  duration_sec int not null,
  created_at timestamp with time zone default now(),
  constraint fk_user_drafts foreign key (user_id) references auth.users (id) on delete cascade
);

-- Submissions table
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  genre text not null,
  lesson text not null,
  content text not null,
  word_count int not null,
  duration_sec int not null,
  next_step_target text,
  created_at timestamp with time zone default now(),
  constraint fk_user_submissions foreign key (user_id) references auth.users (id) on delete cascade
);

-- Enable Row Level Security
alter table public.drafts enable row level security;
alter table public.submissions enable row level security;

-- Authenticated policies (per-user). For local dev you can add anon to these roles if needed.
create policy "drafts insert own" on public.drafts for insert to authenticated with check (auth.uid() = user_id);
create policy "drafts select own" on public.drafts for select to authenticated using (auth.uid() = user_id);

create policy "subs insert own" on public.submissions for insert to authenticated with check (auth.uid() = user_id);
create policy "subs select own" on public.submissions for select to authenticated using (auth.uid() = user_id);
```

> Production: scope access by `auth.uid()` and store a `user_id uuid` column to enforce per‑user isolation.

## 3) App integration

- Client: `lib/supabase.ts` exports `getSupabase()` (session persistence enabled).
- Auth: `components/auth/AuthBar.tsx` provides magic‑link sign‑in/out.
- OAuth: enable providers (Authentication → Providers) for `GitHub` and/or `Google` and set redirect URL to your site origin (e.g., `http://localhost:3000` for dev). Buttons are available in the AuthBar.
- APIs:
  - Include the user's access token in `Authorization: Bearer <token>` header. The API forwards it to Supabase so RLS can evaluate `auth.uid()`.
  - `app/api/drafts/route.ts` → inserts into `drafts`
  - `app/api/submissions/route.ts` → inserts into `submissions`
- Drafts page `/drafts` reads from Supabase if env is set; otherwise falls back to local dev file store.

## 4) Verify locally

```
cd vocahelper-next
npm i
npm run dev
```

Visit:
- `/genres/narrative/suspense` → write → Save Draft / Submit
- `/drafts` → see records from Supabase
