create table if not exists public.market_news_triage_models (
  id integer primary key check (id = 1),
  version text not null,
  model jsonb not null,
  trained_samples integer not null default 0,
  metrics jsonb not null default '{}'::jsonb,
  trained_at timestamptz not null,
  updated_at timestamptz not null default now()
);
alter table public.market_news_triage_models enable row level security;
revoke all on table public.market_news_triage_models from anon, authenticated;
grant all on table public.market_news_triage_models to service_role;
