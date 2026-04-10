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
