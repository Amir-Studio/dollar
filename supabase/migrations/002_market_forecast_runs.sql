-- Additive migration for the independent Dollar / Nabz Bazaar forecast ledger.
-- This creates only a market_-prefixed table; it does not alter Moon Shop tables.
create table if not exists public.market_forecast_runs (
  id uuid primary key default gen_random_uuid(),
  asset text not null check (asset in ('USD_IRR_FREE','EUR_IRR_FREE','GOLD_18K_IRR','COIN_EMAMI_IRR')),
  horizon_days integer not null check (horizon_days in (1,3,7)),
  model_version text not null,
  issued_at timestamptz not null,
  target_at timestamptz not null,
  reference_price numeric(24,6) not null check (reference_price > 0),
  quote_source text not null,
  quote_observed_at timestamptz not null,
  predicted_price numeric(24,6) not null check (predicted_price > 0),
  predicted_change_pct numeric(12,6) not null,
  lower_price numeric(24,6) not null check (lower_price > 0),
  upper_price numeric(24,6) not null check (upper_price >= lower_price),
  direction text not null check (direction in ('up','down','sideways')),
  model_weights jsonb not null default '{}'::jsonb,
  validation jsonb not null default '{}'::jsonb,
  input_fingerprint text not null,
  status text not null default 'pending' check (status in ('pending','evaluated')),
  actual_price numeric(24,6),
  actual_at timestamptz,
  absolute_error_pct numeric(12,6),
  direction_correct boolean,
  created_at timestamptz not null default now()
);

create index if not exists market_forecast_runs_asset_horizon_issued_idx
  on public.market_forecast_runs (asset, horizon_days, issued_at desc);
create index if not exists market_forecast_runs_pending_target_idx
  on public.market_forecast_runs (status, target_at)
  where status = 'pending';

alter table public.market_forecast_runs enable row level security;
revoke all on table public.market_forecast_runs from anon, authenticated;
grant all on table public.market_forecast_runs to service_role;
