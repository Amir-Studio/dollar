# Supabase backend migration

This migration keeps the existing database and reuses the current market and forecast code.

## Functions

- `market-api`: public read-only API used by the GitHub Pages frontend.
- `market-refresh`: scheduled writer. It requires the exact service-role bearer token and writes quotes, RSS headlines and forecast runs.

Both functions reuse the existing code in `worker/`; no forecast algorithm or existing database table is replaced.

## Deploy

From the repository root, link the existing project and deploy with the Supabase CLI:

```sh
npx supabase@latest link --project-ref oolfbjxclhzlbwjmzxxx
npx supabase@latest functions deploy market-api --use-api
npx supabase@latest functions deploy market-refresh --use-api
```

The Edge Functions runtime supplies `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. Do not add the service-role key to frontend files, repository files, or committed workflow YAML.

## Schedule

The GitHub Actions workflow `.github/workflows/supabase-market-refresh.yml` calls the protected refresh function every five minutes. Add the existing Supabase service-role key as a repository Actions secret named `SUPABASE_SERVICE_ROLE_KEY` before enabling the workflow. The secret is only used by the scheduled backend workflow.

## Frontend endpoint

Set the dashboard's analysis endpoint to:

`https://oolfbjxclhzlbwjmzxxx.supabase.co/functions/v1/market-api`

The old Cloudflare Worker remains available during verification. Do not delete it until the new API and scheduled refresh pass live checks.
