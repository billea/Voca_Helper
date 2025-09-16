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

## 2) Database schema

Run this SQL in the Supabase SQL editor:

```sql
-- Drafts table
create table if not exists public.drafts (
  id uuid primary key default gen_random_uuid(),
  genre text not null,
  lesson text not null,
  content text not null,
  word_count int not null,
  duration_sec int not null,
  created_at timestamp with time zone default now()
);

-- Submissions table
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  genre text not null,
  lesson text not null,
  content text not null,
  word_count int not null,
  duration_sec int not null,
  next_step_target text,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.drafts enable row level security;
alter table public.submissions enable row level security;

-- Development policies (open). Replace with authenticated policies for production.
create policy "dev insert" on public.drafts for insert to anon using (true) with check (true);
create policy "dev select" on public.drafts for select to anon using (true);

create policy "dev insert" on public.submissions for insert to anon using (true) with check (true);
create policy "dev select" on public.submissions for select to anon using (true);
```

> Production: scope access by `auth.uid()` and store a `user_id uuid` column to enforce per‑user isolation.

## 3) App integration

- Client: `lib/supabase.ts` exports `getSupabase()` that creates a browser/client instance from env.
- APIs:
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

