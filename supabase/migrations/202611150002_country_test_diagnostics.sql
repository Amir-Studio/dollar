alter table public.market_news_country_test_state
  add column if not exists last_attempt_at timestamptz,
  add column if not exists last_error text;

comment on column public.market_news_country_test_state.last_attempt_at is
  'Timestamp of the most recent global country corpus collection attempt.';
comment on column public.market_news_country_test_state.last_error is
  'Most recent collector error, truncated to 500 characters.';