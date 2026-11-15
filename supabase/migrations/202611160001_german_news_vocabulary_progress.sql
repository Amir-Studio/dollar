-- German News Vocabulary progress is isolated from every existing language engine.
-- Browser clients never receive the service-role key; the Worker validates a per-device token.
create table if not exists public.german_news_vocabulary_progress (
  learner_id uuid primary key,
  token_sha256 text not null check (token_sha256 ~ '^[0-9a-f]{64}$'),
  progress jsonb not null default '{"known":[],"learning":[],"due":[],"stats":{"correct":0,"attempted":0}}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint german_news_vocabulary_progress_payload_size
    check (pg_column_size(progress) <= 65536)
);

create index if not exists german_news_vocabulary_progress_updated_idx
  on public.german_news_vocabulary_progress (updated_at desc);

alter table public.german_news_vocabulary_progress enable row level security;
revoke all on table public.german_news_vocabulary_progress from anon, authenticated;
grant all on table public.german_news_vocabulary_progress to service_role;

comment on table public.german_news_vocabulary_progress is
  'Device-scoped German News Vocabulary progress only; isolated from Chinese vocabulary and market intelligence data.';
