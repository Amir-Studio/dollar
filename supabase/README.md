# Supabase backend for Dollar / Nabz Bazaar

This is the replacement backend for the legacy Cloudflare Worker. The GitHub Pages frontend remains public and static. Supabase stores the persistent market data and runs the API and scheduled refreshes.

## What runs where

- GitHub Pages: public website only. No privileged keys are placed in browser files.
- Supabase Edge Function `market-api`: health, analysis, forecast history/performance, and the protected refresh endpoint.
- Supabase Postgres: quote history, forecast ledger, and RSS news archive.
- Supabase Cron + pg_net: invokes the protected refresh endpoint every five minutes.
- Supabase Vault: stores the service-role key used by the database scheduler.

## One-time setup

1. In GitHub, open **Settings → Secrets and variables → Actions** and add one repository secret named `SUPABASE_ACCESS_TOKEN`. Create the token in your Supabase account's Access Tokens page. Never paste it into chat or commit it to the repository.
2. Push to `main` after merging this migration branch, or manually run **Actions → Deploy Supabase Edge Function**. The workflow deploys `market-api` to project `oolfbjxclhzlbwjmzxxx`.
3. In Supabase Dashboard, open **Vault → Secrets** and create a secret:
   - Name: `dollar_market_service_key`
   - Value: the project's legacy `service_role` API key from **Project Settings → API Keys**.
   Do not send this key to anyone or put it in GitHub source files.
4. Open the Supabase SQL Editor and run the contents of `supabase/setup/enable_market_refresh.sql` once. This enables a five-minute schedule.
5. Test:
   - `https://oolfbjxclhzlbwjmzxxx.supabase.co/functions/v1/market-api/health`
   - `https://oolfbjxclhzlbwjmzxxx.supabase.co/functions/v1/market-api/catalog`
   The refresh endpoint is private to the service-role key and should not be opened in a browser.

## Security

The function's public GET routes expose only market information and diagnostics. The `/refresh` route checks the Supabase service-role API key in the `apikey` header. The service-role key is stored in Supabase Vault and is never included in the static site. The repository remains public because it hosts the free GitHub Pages website; public source code is not a place for secrets.

## Notes

- The existing `market_*` tables and migrations are retained. This setup is additive and does not delete or recreate existing data.
- Cloudflare Worker files remain temporarily as a rollback reference. The old Cloudflare deployment workflow is disabled for automatic pushes.
- Supabase free-tier quotas and project pausing rules still apply. This architecture is designed to fit the free tier, not to promise unlimited or zero-downtime service.
