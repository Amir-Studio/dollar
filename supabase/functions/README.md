# Supabase backend migration

This migration keeps the existing database and reuses the current market and forecast code.

## Functions

- `market-api`: public read-only API used by the GitHub Pages frontend.
- `market-refresh`: scheduled writer. It requires the exact service-role key in the `apikey` header and writes quotes, RSS headlines and forecast runs.

Both functions reuse the existing code in `worker/`; no forecast algorithm or existing database table is replaced.

## Deploy

The workflow `.github/workflows/deploy-supabase.yml` deploys both functions after changes to the backend are merged to `main`. Add a GitHub Actions secret named `SUPABASE_ACCESS_TOKEN` (created in Supabase account settings). You can also deploy manually from the repository root:

```sh
npx supabase@latest link --project-ref oolfbjxclhzlbwjmzxxx
npx supabase@latest functions deploy market-api --use-api
npx supabase@latest functions deploy market-refresh --use-api
```

The Edge Functions runtime supplies `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. Do not add the service-role key to frontend files, repository files, or committed workflow YAML. Add the existing service-role key only as a GitHub Actions secret named `SUPABASE_SERVICE_ROLE_KEY`.

## Schedule

The GitHub Actions workflow `.github/workflows/supabase-market-refresh.yml` calls the protected refresh function every five minutes. Add the existing Supabase service-role key as a repository Actions secret named `SUPABASE_SERVICE_ROLE_KEY` before enabling the workflow. The secret is only used by the scheduled backend workflow.

## Frontend endpoint

Set the dashboard's analysis endpoint to:

`https://oolfbjxclhzlbwjmzxxx.supabase.co/functions/v1/market-api`

The old Cloudflare Worker remains available during verification. Do not delete it until the new API and scheduled refresh pass live checks.
