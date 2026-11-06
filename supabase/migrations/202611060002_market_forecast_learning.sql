-- Forecast ledger and walk-forward evaluation.
-- Additive only: existing shop tables and existing market tables are untouched.

create table if not exists public.market_forecast_runs (
  id uuid primary key default gen_random_uuid(),
  asset text not null,
  horizon_days integer not null check (horizon_days in (1,3,7)),
  model_version text not null,
  issued_at timestamptz not null,
  target_at timestamptz not null,
  reference_price numeric(24,8) not null check (reference_price > 0),
  quote_source text not null,
  quote_observed_at timestamptz not null,
  predicted_price numeric(24,8) not null check (predicted_price > 0),
  predicted_change_pct numeric(12,6) not null,
  lower_price numeric(24,8) not null check (lower_price > 0),
  upper_price numeric(24,8) not null check (upper_price >= lower_price),
  direction text not null check (direction in ('up','down','sideways')),
  model_weights jsonb not null default '{}'::jsonb,
  validation jsonb not null default '{}'::jsonb,
  input_fingerprint text not null,
  status text not null default 'pending' check (status in ('pending','evaluated','invalidated')),
  actual_price numeric(24,8),
  actual_at timestamptz,
  absolute_error_pct numeric(12,6),
  direction_correct boolean,
  created_at timestamptz not null default now(),
  unique (asset, horizon_days, issued_at)
);

create index if not exists market_forecast_runs_due_idx
  on public.market_forecast_runs (status, target_at);
create index if not exists market_forecast_runs_asset_history_idx
  on public.market_forecast_runs (asset, horizon_days, issued_at desc);

alter table public.market_forecast_runs enable row level security;
grant select, insert, update on public.market_forecast_runs to service_role;
