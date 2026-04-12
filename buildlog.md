# Build Log

Append-only record of work on Boricuapunk.

## 2026-04-10
- Expanded archive into multi-page route map with cross-linking.
- Added timeline/relationships/ships/weapons and detail pages.
- Validated with repeated build checks.

## 2026-04-10T15:50:00-04:00
- Added dynamic archive ingestion pipeline (/api/archive/ingest, /api/archive/sightings, /api/archive/quote-of-day).
- Added runtime persistence + uploads path (data/runtime/character-sightings.json, public/uploads/characters/*).
- Added evolving homepage section for ingested sightings.
- Quote-of-day now uses evolving pool with fallback.

## 2026-04-10T16:05:00-04:00
- Added Telegram automation routes (/api/telegram/webhook and /api/telegram/webhook/setup).
- Implemented Telegram update processing: photo extraction, file download, auto-ingest, optional confirmation reply.
- Added setup/status helper using Telegram Bot API (setWebhook/getWebhookInfo).
- Updated README with env/setup for automatic Telegram ingestion.

## 2026-04-11T07:00:00-04:00
- Added local dropbox ingest workflow folders: data/dropbox/incoming, processed, duplicates, failed.
- Added scripts/dropbox_ingest_watcher.py (polling watcher + duplicate SHA256 detection + auto-ingest to /api/archive/ingest).
- Added duplicate/failed file routing with hash index at data/runtime/dropbox-ingest-index.json.
- Updated .gitignore to keep dropbox folders tracked via .gitkeep while ignoring local image artifacts.

## 2026-04-11T08:08:42-04:00
- Confirmed local dropbox ingest flow as active fallback to Telegram: incoming -> ingest -> processed/duplicates/failed.
- Marked project state as ready for upcoming larger migration step ("big move") with docs/memory checkpoint.

## 2026-04-11T08:48:54-04:00
- Created pre-experimental backup artifacts under /home/xsypluto/backups (tarball + patch).
- Added git checkpoint commit/tag for rollback: c868ee8 / checkpoint-pre-experimental-20260411.
- Added EXPERIMENTAL-ROLLOUT.md runbook covering VPS autostart and Cloudflare routing options.

## 2026-04-11T11:54:37-04:00
- Updated experimental rollout docs to use VPS app port 9998.
- Prepared session-reset handoff package for next chat with exact Cloudflare ingress block and remaining activation steps.

## 2026-04-12T09:39:36-04:00
- Added Archive Route Finder on /archive with mobile-safe search + category filter for faster navigation.
- Tagged archive hub routes with categories/tags to support route discovery (people/power/story/world/signals/arsenal).
- Synced docs/runtime defaults to 9998 across README + handoff ingest/local URL references.
- Verified production build passes and includes /archive with unchanged route map coverage.

## 2026-04-12T09:49:16-04:00
- Added dynamic faction detail dossiers at /factions/[id] with generateStaticParams, alignment badge, member links, and location cross-links.
- Added dynamic location detail dossiers at /locations/[slug] with generateStaticParams, faction anchor links, connected-route links, and linked-figure links.
- Moved location dataset into shared types/locations.ts and updated /locations + /factions index cards to link into new detail routes.
- Verified production build passes and now statically generates faction/location detail paths.

## 2026-04-12T10:04:51-04:00
- Fixed mobile top-nav clipping by making header stack on mobile and enabling wrapped nav rows.
- Tightened mobile nav typography/tracking and kept desktop sizing unchanged at larger breakpoints.
- Shortened Hackermouth label to "HM" on mobile only to remove final-row overflow while preserving full label on md+.
- Verified with 390px iframe overflow probe (header offenders: 0) and passing production build.
