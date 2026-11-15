-- Durable, auditable vocabulary memory for the multilingual learner.
create table if not exists public.market_vocabulary_memory (
  id uuid primary key default gen_random_uuid(),
  language_code text not null,
  term text not null,
  normalized_term text not null,
  definition_en text,
  part_of_speech text,
  source_provider text not null,
  source_url text,
  confidence numeric(4,3) not null default 0,
  status text not null default 'candidate_review'
    check (status in ('candidate_review','verified','rejected')),
  concept_id text,
  evidence_count integer not null default 1 check (evidence_count >= 1),
  source_urls text[] not null default '{}',
  contexts text[] not null default '{}',
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(language_code, normalized_term)
);
create index if not exists market_vocabulary_memory_status_idx
  on public.market_vocabulary_memory(status, language_code, last_seen_at desc);
create index if not exists market_vocabulary_memory_term_idx
  on public.market_vocabulary_memory(language_code, normalized_term);
alter table public.market_vocabulary_memory enable row level security;
revoke all on public.market_vocabulary_memory from anon, authenticated;
grant all on public.market_vocabulary_memory to service_role;
