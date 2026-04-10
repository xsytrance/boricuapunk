# Build Log

Append-only record of work on Boricuapunk.

## 2026-04-10
- Cloned repository and established forge-dev workflow.
- Expanded archive into multi-page route map with cross-linking.
- Added timeline/relationships/ships/weapons and detail pages.
- Kept style consistency and validated with build checks.

## 2026-04-10T15:27:01-04:00
- Context checkpoint saved.
- Verified branch and build pass.

## 2026-04-10T15:50:00-04:00
- Added dynamic archive ingestion pipeline (/api/archive/ingest, /api/archive/sightings, /api/archive/quote-of-day).
- Added runtime persistence + uploads path (data/runtime/character-sightings.json, public/uploads/characters/*).
- Added evolving homepage section for ingested sightings.
- Quote-of-day now uses evolving pool with fallback.
- Verified build + local ingest retrieval tests.

## 2026-04-10T16:05:00-04:00
- Added Telegram automation routes (/api/telegram/webhook and /api/telegram/webhook/setup).
- Implemented Telegram update processing: photo extraction, Telegram file download, auto-ingest, optional confirmation reply.
- Added setup/status helper using Telegram Bot API (setWebhook/getWebhookInfo).
- Updated README with env/setup for automatic Telegram ingestion.
- Verified build + local webhook smoke tests.
