alter table public.market_news_country_test_corpus
  add column if not exists collection_provider text,
  add column if not exists source_country_verified boolean not null default false;

comment on column public.market_news_country_test_corpus.collection_provider is
  'News discovery provider used for this country article, such as GDELT or Google News RSS.';
comment on column public.market_news_country_test_corpus.source_country_verified is
  'True only when the source-country filter or publisher country-domain check supports the country attribution.';
