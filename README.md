# Boricuapunk

Boricuapunk is a story archive site for the Red Noodle Clan universe.

Current structure:
- /archive — central hub
- /characters — roster archive
- /factions — faction map
- /lore — myth fragments
- /locations — setting atlas
- /logs — quote and signal feed
- /ships — skycraft archive with Jibaro
- /ships/jibaro — dedicated Jibaro detail page
- /weapons — armory archive
- /weapons/spada-virina — dedicated weapon detail page
- /timeline — chronology view
- /relationships — connection map
- /about — archive overview

## Current implementation status (checkpoint)
As of 2026-04-10T16:05:00-04:00, production build is passing and these routes exist in app output:
- /
- /_not-found
- /api/archive/ingest
- /api/archive/quote-of-day
- /api/archive/sightings
- /api/telegram/webhook
- /api/telegram/webhook/setup
- /characters
- /characters/[id]
- /rnc/chat

## Run locally
- npm run dev (http://127.0.0.1:9999)
- npm run build
- npm run start

## Telegram photo → website pipeline
- POST multipart/form-data to /api/archive/ingest with:
  - photo (or image) file
  - optional caption
  - optional source (telegram or manual)
- Or POST JSON with { "imageUrl": "https://...", "caption": "..." }
- Pipeline behavior:
  - stores image in public/uploads/characters/
  - identifies character against manuscript-derived descriptors (types/characters.ts)
  - auto-builds character card payload
  - attaches canon quotes (or synthesizes fallback quote)
  - generates Hackermouth effect hooks
  - persists sightings in data/runtime/character-sightings.json
- Home page auto-renders evolving sightings and serves dynamic quote-of-day from /api/archive/quote-of-day.

## Fully automatic Telegram photo ingestion
Environment variables:
- TELEGRAM_BOT_TOKEN (required)
- BORICUAPUNK_PUBLIC_BASE_URL (required for webhook setup and link generation)
- TELEGRAM_WEBHOOK_SECRET (recommended)
- TELEGRAM_WEBHOOK_SETUP_KEY (recommended)
- TELEGRAM_INGEST_AUTO_REPLY=false (optional)

Routes:
- POST /api/telegram/webhook — receives Telegram updates and auto-ingests photo messages
- GET /api/telegram/webhook — health check
- GET /api/telegram/webhook/setup — read Telegram webhook status
- POST /api/telegram/webhook/setup — set Telegram webhook URL automatically

Activation:
1) Deploy or run on the public URL.
2) curl -X POST "$BORICUAPUNK_PUBLIC_BASE_URL/api/telegram/webhook/setup" -H "x-setup-key: $TELEGRAM_WEBHOOK_SETUP_KEY" -H "content-type: application/json" -d '{}'
3) curl "$BORICUAPUNK_PUBLIC_BASE_URL/api/telegram/webhook/setup" -H "x-setup-key: $TELEGRAM_WEBHOOK_SETUP_KEY"

## Optional vision matching
- Set OPENAI_API_KEY to enable image-based identification.
- Optional model override: BORICUAPUNK_VISION_MODEL (default gpt-4.1-mini).
- Without API key, pipeline falls back to caption/manuscript keyword matching.

## Notes
- Manuscript reference files are in data/manuscript/.
- Keep buildlog.md and handoff.md append-only and current.
- Keep edits minimal and focused.
