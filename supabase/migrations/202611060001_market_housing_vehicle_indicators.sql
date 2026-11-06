-- Iran-focused housing, vehicle and macro indicators.
-- Isolated market_* tables only; existing shop tables are untouched.
-- Run this migration in Supabase SQL Editor after reviewing it.

create table if not exists public.market_data_sources (
  id uuid primary key default gen_random_uuid(),
  source_key text not null unique,
  source_name text not null,
  source_type text not null check (source_type in ('official_statistics','central_bank','listing_aggregate','exchange','other')),
  source_url text,
  geography text not null default 'national',
  frequency text not null check (frequency in ('realtime','daily','weekly','monthly','quarterly','annual','irregular')),
  methodology text,
  status text not null default 'candidate' check (status in ('candidate','validated','active','paused','retired')),
  last_checked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.market_housing_observations (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references public.market_data_sources(id),
  geography_level text not null check (geography_level in ('national','province','city')),
  province text,
  city text,
  property_type text not null check (property_type in ('apartment','house','land','all_residential','rent_index','official_cpi_housing')),
  market_type text not null check (market_type in ('registered_transaction','asking_listing','official_index','rent')),
  period_start date not null,
  period_end date not null,
  unit text not null check (unit in ('toman_per_sqm','rial_per_sqm','index','toman_per_month')),
  median_value numeric(24,4),
  mean_value numeric(24,4),
  p25_value numeric(24,4),
  p75_value numeric(24,4),
  sample_count integer,
  index_base text,
  currency text not null default 'IRT',
  methodology_note text,
  source_published_at timestamptz,
  collected_at timestamptz not null default now(),
  unique (source_id, geography_level, province, city, property_type, market_type, period_start, period_end, unit)
);

create table if not exists public.market_vehicle_observations (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references public.market_data_sources(id),
  geography_level text not null check (geography_level in ('national','province','city')),
  province text,
  city text,
  make text,
  model text,
  model_year integer,
  condition text not null check (condition in ('new','used','all')),
  market_type text not null check (market_type in ('registered_transaction','asking_listing','official_index')),
  period_start date not null,
  period_end date not null,
  unit text not null default 'toman_per_vehicle' check (unit in ('toman_per_vehicle','rial_per_vehicle','index')),
  median_value numeric(24,4),
  mean_value numeric(24,4),
  p25_value numeric(24,4),
  p75_value numeric(24,4),
  sample_count integer,
  index_base text,
  currency text not null default 'IRT',
  methodology_note text,
  source_published_at timestamptz,
  collected_at timestamptz not null default now(),
  unique (source_id, geography_level, province, city, make, model, model_year, condition, market_type, period_start, period_end, unit)
);

create table if not exists public.market_macro_observations (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references public.market_data_sources(id),
  indicator_key text not null,
  indicator_name_fa text not null,
  geography_level text not null default 'national' check (geography_level in ('national','province')),
  province text,
  period_start date not null,
  period_end date not null,
  value numeric(24,8) not null,
  unit text not null,
  index_base text,
  source_published_at timestamptz,
  collected_at timestamptz not null default now(),
  methodology_note text,
  unique (source_id, indicator_key, geography_level, province, period_start, period_end)
);

create index if not exists market_housing_period_idx
  on public.market_housing_observations (period_end desc, geography_level, province, city);
create index if not exists market_vehicle_period_idx
  on public.market_vehicle_observations (period_end desc, geography_level, province, city);
create index if not exists market_macro_period_idx
  on public.market_macro_observations (indicator_key, period_end desc);

alter table public.market_data_sources enable row level security;
alter table public.market_housing_observations enable row level security;
alter table public.market_vehicle_observations enable row level security;
alter table public.market_macro_observations enable row level security;

grant select, insert, update on public.market_data_sources to service_role;
grant select, insert, update on public.market_housing_observations to service_role;
grant select, insert, update on public.market_vehicle_observations to service_role;
grant select, insert, update on public.market_macro_observations to service_role;
