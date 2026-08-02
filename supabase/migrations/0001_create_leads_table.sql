-- Per docs/TRD.md §4.1 and §4.3. Run this against both the production and
-- preview/development Supabase projects (docs/ARCHITECTURE.md §4.9) — they
-- are separate projects, so this migration needs applying to each.

create table public.leads (
  id            uuid primary key default gen_random_uuid(),
  type          text not null check (type in ('client', 'investor')),
  name          text not null,
  email         text not null,
  company       text,
  project_type  text,          -- only meaningful when type = 'client'
                                -- e.g. 'web', 'app', 'saas', 'crm', 'design'
  message       text not null,
  status        text not null default 'new'
                check (status in ('new', 'contacted', 'archived')),
  created_at    timestamptz not null default now()
);

create index leads_type_idx on public.leads (type);
create index leads_created_at_idx on public.leads (created_at desc);

-- RLS enabled with NO policies added, intentionally. Only the service role
-- (server-side, docs/ARCHITECTURE.md §4.3) can access this table — there is
-- no legitimate anon/authenticated read or write path in MVP.
alter table public.leads enable row level security;
