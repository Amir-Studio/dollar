-- Persistent, rate-limited RSS headline cache for the independent Dollar market service.
-- These are additive market_-prefixed tables; no Moon Shop table is changed.
create table if not exists public.market_news_items (
  id uuid primary key default gen_random_uuid(),
  url text not null unique,
  title text not null,
  domain text not null,
  published_at timestamptz not null,
  fetched_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists market_news_items_published_idx
  on public.market_news_items (published_at desc);
create index if not exists market_news_items_fetched_idx
  on public.market_news_items (fetched_at desc);

create table if not exists public.market_news_sync_state (
  id integer primary key check (id = 1),
  last_fetched_at timestamptz
);
insert into public.market_news_sync_state (id, last_fetched_at)
values (1, null)
on conflict (id) do nothing;

alter table public.market_news_items enable row level security;
alter table public.market_news_sync_state enable row level security;
revoke all on table public.market_news_items, public.market_news_sync_state from anon, authenticated;
grant all on table public.market_news_items, public.market_news_sync_state to service_role;
