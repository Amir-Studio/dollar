-- News intelligence pipeline: source registry, original article text, Persian translation and summaries.
-- Additive only. Existing market tables and forecast history remain intact.

create table if not exists public.market_news_sources (
  source_id text primary key,
  name text not null,
  country_code text not null,
  language_code text not null,
  site_url text not null,
  feed_url text,
  active boolean not null default true,
  trust_tier text not null default 'unrated'
    check (trust_tier in ('unrated','primary','established','specialist')),
  ownership_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.market_news_items
  add column if not exists source_id text references public.market_news_sources(source_id),
  add column if not exists language_code text,
  add column if not exists original_title text,
  add column if not exists original_text text,
  add column if not exists translated_title_fa text,
  add column if not exists translated_text_fa text,
  add column if not exists summary_fa text,
  add column if not exists content_hash text,
  add column if not exists article_status text not null default 'headline_only'
    check (article_status in ('headline_only','queued','extracted','translated','summarized','failed','blocked')),
  add column if not exists extraction_method text,
  add column if not exists translation_model text,
  add column if not exists processing_error text,
  add column if not exists processed_at timestamptz;

create index if not exists market_news_items_status_published_idx
  on public.market_news_items (article_status, published_at desc);
create index if not exists market_news_items_content_hash_idx
  on public.market_news_items (content_hash)
  where content_hash is not null;
create index if not exists market_news_items_source_published_idx
  on public.market_news_items (source_id, published_at desc);

alter table public.market_news_sources enable row level security;
revoke all on table public.market_news_sources from anon, authenticated;
grant all on table public.market_news_sources to service_role;
