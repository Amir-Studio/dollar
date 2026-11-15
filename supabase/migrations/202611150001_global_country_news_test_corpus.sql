create table if not exists public.market_news_country_test_corpus (
  country_code text primary key,
  country_name text not null,
  gdelt_country text not null,
  language_code text,
  publisher_domain text,
  article_url text unique,
  title text,
  published_at timestamptz,
  article_text text,
  article_chars integer not null default 0,
  extraction_status text not null default 'pending',
  model_version text,
  model_output jsonb,
  expected_output jsonb,
  evaluation_status text not null default 'pending_review'
    check (evaluation_status in ('pending_review','verified','failed','not_evaluable')),
  evaluation_notes text,
  collected_at timestamptz,
  updated_at timestamptz not null default now(),
  constraint market_news_country_test_language_check
    check (language_code is null or language_code in ('fa','en','ar','zh','de','fr'))
);
create table if not exists public.market_news_country_test_state (
  id smallint primary key default 1 check (id = 1),
  next_index integer not null default 0,
  total_countries integer not null default 100,
  updated_at timestamptz not null default now()
);
insert into public.market_news_country_test_state(id,next_index,total_countries)
values (1,0,100) on conflict (id) do nothing;
create index if not exists market_news_country_test_status_idx
  on public.market_news_country_test_corpus(evaluation_status, collected_at desc);
alter table public.market_news_country_test_corpus enable row level security;
alter table public.market_news_country_test_state enable row level security;
revoke all on public.market_news_country_test_corpus from anon, authenticated;
revoke all on public.market_news_country_test_state from anon, authenticated;
grant all on public.market_news_country_test_corpus to service_role;
grant all on public.market_news_country_test_state to service_role;
