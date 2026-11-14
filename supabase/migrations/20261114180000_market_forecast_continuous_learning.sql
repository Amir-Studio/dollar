create table if not exists public.market_learning_cycles (
  id bigint generated always as identity primary key,
  cycle_at timestamptz not null default now(),
  model_version text not null,
  evaluated_count integer not null default 0,
  asset_metrics jsonb not null default '{}'::jsonb,
  learning_actions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists market_learning_cycles_cycle_at_idx on public.market_learning_cycles (cycle_at desc);
alter table public.market_learning_cycles enable row level security;
grant select, insert on public.market_learning_cycles to service_role;
