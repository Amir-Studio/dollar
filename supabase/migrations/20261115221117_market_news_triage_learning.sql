-- Neural-assisted multilingual news triage and compact retention.
-- This migration touches only Dollar-prefixed news tables.
alter table public.market_news_items
  add column if not exists triage_status text not null default 'pending',
  add column if not exists triage_score numeric(5,2),
  add column if not exists triage_reason jsonb not null default '{}'::jsonb,
  add column if not exists triage_features jsonb not null default '{}'::jsonb,
  add column if not exists semantic_concepts jsonb not null default '[]'::jsonb,
  add column if not exists summary_original text,
  add column if not exists summary_language text,
  add column if not exists triage_model_version text,
  add column if not exists triaged_at timestamptz,
  add column if not exists history_synced_at timestamptz,
  add column if not exists duplicate_of uuid;

do $$
begin
  alter table public.market_news_items
    add constraint market_news_items_triage_status_check
    check (triage_status in ('pending','keep','summarize','quarantine','discard'));
exception when duplicate_object then null;
end $$;

do $$
begin
  alter table public.market_news_items
    add constraint market_news_items_triage_score_check
    check (triage_score is null or (triage_score >= 0 and triage_score <= 100));
exception when duplicate_object then null;
end $$;

create index if not exists market_news_items_triage_queue_idx
  on public.market_news_items (triage_status, published_at desc);

create table if not exists public.market_news_triage_feedback (
  id uuid primary key default gen_random_uuid(),
  item_url_hash text not null,
  item_id uuid,
  decision text not null check (decision in ('keep','summarize','quarantine','discard')),
  features jsonb not null,
  note text,
  reviewer text not null default 'human',
  created_at timestamptz not null default now()
);
create index if not exists market_news_triage_feedback_created_idx
  on public.market_news_triage_feedback (created_at desc);

create table if not exists public.market_news_triage_archive (
  id uuid primary key default gen_random_uuid(),
  item_url_hash text not null unique,
  title text not null,
  domain text,
  published_at timestamptz,
  decision text not null check (decision in ('keep','summarize','quarantine','discard')),
  reason jsonb not null default '{}'::jsonb,
  summary_original text,
  summary_fa text,
  archived_at timestamptz not null default now(),
  removed_payload_chars integer not null default 0
);
create index if not exists market_news_triage_archive_archived_idx
  on public.market_news_triage_archive (archived_at desc);

create table if not exists public.market_news_triage_cycles (
  id uuid primary key default gen_random_uuid(),
  model_version text not null,
  scanned integer not null default 0,
  kept integer not null default 0,
  summarized integer not null default 0,
  quarantined integer not null default 0,
  discarded integer not null default 0,
  model_trained boolean not null default false,
  metrics jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists market_news_triage_cycles_created_idx
  on public.market_news_triage_cycles (created_at desc);

alter table public.market_news_triage_feedback enable row level security;
alter table public.market_news_triage_archive enable row level security;
alter table public.market_news_triage_cycles enable row level security;
revoke all on table public.market_news_triage_feedback, public.market_news_triage_archive, public.market_news_triage_cycles from anon, authenticated;
grant all on table public.market_news_triage_feedback, public.market_news_triage_archive, public.market_news_triage_cycles to service_role;
