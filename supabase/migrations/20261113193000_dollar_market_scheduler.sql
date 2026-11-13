create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pg_net;

grant usage on schema cron to postgres;
grant all privileges on all tables in schema cron to postgres;

create table if not exists public.market_refresh_gate (
  id smallint primary key check (id = 1),
  secret_sha256 text not null,
  updated_at timestamptz not null default now()
);

alter table public.market_refresh_gate enable row level security;
revoke all on table public.market_refresh_gate from anon, authenticated;
grant select, insert, update on table public.market_refresh_gate to service_role;
