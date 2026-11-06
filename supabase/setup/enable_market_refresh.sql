-- Run once, after adding the Supabase service-role key to Vault.
-- In Supabase Dashboard: Project Settings -> API Keys, copy the legacy service_role key.
-- Store it in Vault under the exact name: dollar_market_service_key.
-- Never put the service-role key in GitHub source code or the browser.

create extension if not exists pg_cron;
create extension if not exists pg_net;
create extension if not exists supabase_vault with schema vault;

do $$
declare
  existing_job record;
begin
  for existing_job in
    select jobid from cron.job where jobname = 'dollar-market-refresh'
  loop
    perform cron.unschedule(existing_job.jobid);
  end loop;
end
$$;

select cron.schedule(
  'dollar-market-refresh',
  '*/5 * * * *',
  $job$
    select net.http_post(
      url := 'https://oolfbjxclhzlbwjmzxxx.supabase.co/functions/v1/market-api/refresh',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'apikey', (
          select decrypted_secret
          from vault.decrypted_secrets
          where name = 'dollar_market_service_key'
          limit 1
        )
      ),
      body := jsonb_build_object(
        'source', 'supabase-cron',
        'scheduled_at', now()
      ),
      timeout_milliseconds := 120000
    ) as request_id;
  $job$
);
