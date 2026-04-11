# Handoff State

## Current branch
- forge-dev

## Current repo state
- Multi-page archive with cross-linked lore routes.
- Dynamic archive ingestion implemented.
- Telegram webhook auto-ingestion implemented.

## Runtime / environment
- Local dev target: http://127.0.0.1:9999
- Public endpoint target: https://rnc.agenorr.com
- GitHub pushes in this environment use PAT auth.

## Latest checkpoint
- Added /api/archive/ingest, /api/archive/sightings, /api/archive/quote-of-day
- Added /api/telegram/webhook and /api/telegram/webhook/setup
- Home renders evolving ingested sightings + evolving quote-of-day
- Runtime storage: data/runtime/character-sightings.json
- Upload storage: public/uploads/characters/
- Build status: passing

## Activation requirements
- TELEGRAM_BOT_TOKEN on deployed runtime
- BORICUAPUNK_PUBLIC_BASE_URL set to https://rnc.agenorr.com
- Optional: TELEGRAM_WEBHOOK_SECRET, TELEGRAM_WEBHOOK_SETUP_KEY

## 2026-04-11 local ingest fallback checkpoint
- Added monitored drop folder flow under data/dropbox/incoming.
- Watcher script: scripts/dropbox_ingest_watcher.py.
- Processed files move to data/dropbox/processed; exact duplicates move to data/dropbox/duplicates; failures move to data/dropbox/failed.
- Duplicate index persisted at data/runtime/dropbox-ingest-index.json.
- Ingest target defaults to http://127.0.0.1:9999/api/archive/ingest (override with BORICUAPUNK_INGEST_URL).

## 2026-04-11T08:08:42-04:00 readiness checkpoint
- Preferred ingest path now supports local folder drop workflow (no Telegram dependency).
- Drop input folder: data/dropbox/incoming.
- Automation script: scripts/dropbox_ingest_watcher.py (duplicates + failed routing enabled).
- Project state flagged as ready for user-directed "big move" next step.
