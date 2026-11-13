-- Keep forecast history auditable while invalidating records based on stale reference quotes.
-- New forecasts require a quote no older than 24 hours; old records are retained but excluded from evaluation.

alter table public.market_forecast_runs
  drop constraint if exists market_forecast_runs_status_check;

alter table public.market_forecast_runs
  add constraint market_forecast_runs_status_check
  check (status in ('pending','evaluated','invalidated'));
