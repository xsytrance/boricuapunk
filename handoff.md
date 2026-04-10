# Handoff State

## Current branch
- forge-dev

## Current repo state
- Boricuapunk is a multi-page archive experience with cross-linked lore routes.
- API ingestion foundation is live in code for evolving character uploads.
- Telegram webhook auto-ingestion is implemented at app layer.

## Runtime / environment
- Local dev target: http://127.0.0.1:9999
- rnc.agenorr.com is the intended public endpoint
- GitHub pushes require PAT auth in this environment

## Recent implementation checkpoint (2026-04-10T16:05:00-04:00)
- Added /api/archive/ingest, /api/archive/sightings, /api/archive/quote-of-day
- Added /api/telegram/webhook and /api/telegram/webhook/setup
- Home now renders evolving ingested sightings + evolving quote-of-day
- Runtime storage: data/runtime/character-sightings.json
- Upload storage: public/uploads/characters/
- Build status: passing

## Activation requirements for full live Telegram loop
- TELEGRAM_BOT_TOKEN on the deployed runtime
- BORICUAPUNK_PUBLIC_BASE_URL set to https://rnc.agenorr.com
- Optional security envs: TELEGRAM_WEBHOOK_SECRET, TELEGRAM_WEBHOOK_SETUP_KEY
