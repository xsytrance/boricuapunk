# Handoff State

## Current branch
- forge-dev

## Current repo state
- Multi-page archive with cross-linked lore routes.
- Dynamic archive ingestion implemented.
- Telegram webhook auto-ingestion implemented.

## Runtime / environment
- Local dev target: http://127.0.0.1:9998
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
- Ingest target defaults to http://127.0.0.1:9998/api/archive/ingest (override with BORICUAPUNK_INGEST_URL).

## 2026-04-11T08:08:42-04:00 readiness checkpoint
- Preferred ingest path now supports local folder drop workflow (no Telegram dependency).
- Drop input folder: data/dropbox/incoming.
- Automation script: scripts/dropbox_ingest_watcher.py (duplicates + failed routing enabled).
- Project state flagged as ready for user-directed "big move" next step.

## 2026-04-11T08:48:54-04:00 experimental rollout prep checkpoint
- New experimental target context recorded:
  - Current Windows host: 100.94.216.114:9998
  - VPS experimental host: /home/xsypluto/projects/boricuapunk on 100.113.155.3
  - Experimental domain target: boricuapunk.agenorr.com
- Recovery artifacts created:
  - /home/xsypluto/backups/boricuapunk-pre-experimental-20260411T084854-0400.tar.gz
  - /home/xsypluto/backups/boricuapunk-pre-experimental-20260411T084854-0400.patch
  - git tag checkpoint-pre-experimental-20260411
- Runbook added: EXPERIMENTAL-ROLLOUT.md (autostart + Cloudflare options + rollback steps).

## 2026-04-11T11:54:37-04:00 session-reset checkpoint
- Experimental VPS port is now 9998 by decision.
- Cloudflare tunnel config snippet prepared for Windows host:
  - hostname boricuapunk.agenorr.com -> service http://100.113.155.3:9998
- Remaining activation sequence for next session:
  1) Save/reload Windows cloudflared config with new ingress rule
  2) Restart cloudflared on Windows
  3) Ensure VPS app is running/autostarting on 9998
  4) Validate https://boricuapunk.agenorr.com and API routes

## 2026-04-12T09:39:36-04:00 archive discovery checkpoint
- Added /archive Route Finder block (search + category filter) to speed navigation across growing routes.
- Route metadata now includes category/tags for filterable archive discovery.
- Local/default references now consistently point to port 9998 in README + handoff ingest/runtime lines.
- Build status: passing (Next.js 16.2.3); route set unchanged except behavior upgrade on /archive.

## 2026-04-12T09:49:16-04:00 faction/location detail expansion checkpoint
- Added new detail route families:
  - /factions/[id] (SSG via generateStaticParams)
  - /locations/[slug] (SSG via generateStaticParams)
- Added cross-links from index cards: /factions and /locations now deep-link into dossier pages.
- Added shared location source-of-truth: types/locations.ts (used by index + detail routes).
- Build status: passing (Next.js 16.2.3); static generation includes faction and location detail paths.

## 2026-04-12T10:04:51-04:00 mobile nav clipping fix checkpoint
- Header now stacks on mobile and nav links wrap into multiple rows instead of clipping off-screen.
- Mobile typography/tracking reduced in top nav for safe portrait fit.
- Hackermouth nav label is now "HM" on mobile and full "Hackermouth" on md+.
- Verification: 390px iframe overflow probe reports zero header offenders; production build passes.

## 2026-04-12T10:33:23-04:00 ingest review queue checkpoint
- Added /review page for human QA on low-confidence or unknown image matches.
- /api/archive/sightings now supports:
  - `GET ?needsReview=1&threshold=0.6&limit=...`
  - `PATCH` with `{ sightingId, characterId }` for one-click reassignment
- Reassignment updates card + match metadata + quotes + hackermouth effects in data/runtime/character-sightings.json.
- Review link now appears in header and archive route finder; build status passing.

## 2026-04-12T10:57:16-04:00 power map naming restore checkpoint
- Restored Power Map naming in nav + archive hub (formerly labeled Graph/Relationship Graph in some UI copy).
- Added `/power-map` route alias redirecting to `/relationships` to support old links/bookmarks.
- Timeline and relationships content style remains aligned with rnc.agenorr.com reference pages.
- Build status: passing with new alias route.

## 2026-04-12T12:22:15-04:00 figurines pipeline checkpoint
- Added `/figurines` and `/figurines/review` pages for shelf-photo ingest + QA reassignment workflow.
- Added `/api/archive/figurines` route with:
  - `GET` list + `needsReview` filtering
  - `POST` ingest (supports `shotType=single|group`)
  - `PATCH` manual character assignment
- New storage/runtime paths: `public/uploads/figurines/*` and `data/runtime/figurine-sightings.json`.
- Matching uses vision if configured; otherwise caption descriptor ranking with stronger weighting for name/id/role tokens.
- Group shots are supported but confidence-damped to encourage review safety.
- Build status: passing with figurine API/UI routes included.

## 2026-04-12T12:28:21-04:00 dropbox figurine auto-route checkpoint
- Updated `scripts/dropbox_ingest_watcher.py` so incoming filenames prefixed `fig_` are ingested through `/api/archive/figurines` automatically.
- Non-`fig_` files continue using `/api/archive/ingest` (character pipeline).
- Added shotType hinting from filename for figurines:
  - `figg_...` or names containing `_group` / `-group` => `shotType=group`
  - otherwise => `shotType=single`
- New optional env override: `BORICUAPUNK_FIGURINE_INGEST_URL` (default `http://127.0.0.1:9998/api/archive/figurines`).
- README updated with naming conventions for mixed drop-folder workflows (characters + figurines).

## 2026-04-12T12:55:01-04:00 HM visual polish checkpoint
- HM floating node readability pass:
  - wrapped message text in new `hm-node-text-shell` capsule with subtle scanline overlay
  - improved contrast against bright/busy backgrounds while keeping existing behavior/events
- HM toast upgrade:
  - added telemetry header (`HACKERMOUTH NODE`) and live stamp format (`T+HH:MM:SS`)
  - retained mobile-first placement and non-interactive overlay behavior
- HM quote card cleanup:
  - tighter mobile-safe paddings/spacing, cleaner border treatment, glow-tuned flicker cadence
- Added reduced-motion safety override for HM core animations (toast, quote flicker, node float/eye pulse).
- Build status: passing (Next.js 16.2.3).

## 2026-04-12T13:21:57-04:00 ingest taxonomy + admin control checkpoint
- Character ingestion now stores richer classification metadata per sighting:
  - `match.entityType` (`character|location|unknown`) + `match.entityId`
  - `classification.artStyle` + `classification.shotKind` + `classification.isMain`
- Vision prompt expanded to classify both character and location candidates and emit art-style/shot-kind labels.
- `/api/archive/sightings` now supports filter/search toggles and style-coherent feed ordering (`consistentMainStyle=1`).
- New admin route: `/admin/ingest`
  - reassign to character/location/unknown
  - override style + shot kind
  - toggle main-feed candidate flag
  - view latest rationale entries
- New append-only rationale log file + API:
  - `data/runtime/ingest-rationale-log.md`
  - `GET /api/archive/rationale-log`
- Header/archive hub include direct entry to Ingest Admin.
- Build status: passing (Next.js 16.2.3).

## 2026-04-12T13:45:35-04:00 mystery-overdrive checkpoint
- New style category added for ingest/admin controls: `mystery-unknown`.
  - Unknown/mystery style inputs now normalize into this bucket for cleaner filtering.
- HM behavior upgraded for mystery/unknown cards (`tags` include `mystery` or `unknown`):
  - stronger hover-proximity reactions (higher expansion chance)
  - tap/pointer-down overdrive burst triggers additional HM events (`node-expansion`, `hijack`, `context`, `toast`, `quote-appear`)
- Archive signal layer now treats `mystery` as a first-class high-reactivity signal tag.
- Build status: passing (Next.js 16.2.3).

## 2026-04-12T17:20:43-04:00 Hackermouth terminal-chat UI checkpoint
- Added dedicated Hackermouth-only chat interface on `/characters/hackermouth` via `HackermouthTerminalChat` (terminal aesthetic, no standard bubble UI).
- UX details implemented:
  - black system panel + teal/green monospace text
  - send label changed to `TRANSMIT`
  - placeholder set to `Speak. I am already listening.`
  - assistant output animates with typewriter-style reveal
- Wiring detail: requests from this UI post to `/api/chat` with `{ character_id: "hackermouth", commit_id: "hackermouth_active", message, history }`.
- Non-Hackermouth characters continue using existing `CharacterTalkButton` unchanged.
- Build status: passing (Next.js 16.2.3).

## 2026-04-12T17:31:40-04:00 Hackermouth portrait swap checkpoint
- Added user-provided portrait file at `public/images/hackermouth/hackermouth-user-photo.jpg`.
- Updated Hackermouth character image path in both data sources:
  - `data/characters.ts`
  - `types/characters.ts`
- New active image URL: `/images/hackermouth/hackermouth-user-photo.jpg`.
- Build status: passing (Next.js 16.2.3).

## 2026-04-12T17:49:58-04:00 Hackermouth send-flow fix checkpoint
- Updated `components/hackermouth/HackermouthTerminalChat.tsx` send mechanics so both TRANSMIT click and Enter key submit the same `handleSend` path.
- Enter support now matches requested behavior (`Enter` + not `Shift`) and prevents default newline/refresh behavior.
- Added `<form onSubmit>` safety path to prevent browser default refresh and keep SPA chat behavior stable.
- Added 20s `AbortController` timeout to prevent stuck `loading=true` from permanently disabling sends when upstream stalls.
- API validated separately via curl on live endpoint with Hackermouth payload; response returned successfully.
- Build status: passing (Next.js 16.2.3).

## 2026-04-12T17:57:26-04:00 Hackermouth no-form send checkpoint
- Removed the form wrapper from Hackermouth terminal send controls per request.
- Active send wiring is now direct-only:
  - input `onKeyDown`: `if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }`
  - button `onClick`: `handleSend()`
- Button updated to `type="button"` and `disabled={loading}` to eliminate implicit submit refresh paths.
- Build status: passing; live endpoint curl test for Hackermouth payload returns successful response.

## 2026-04-12T18:14:06-04:00 Hackermouth client-hydration wrapper checkpoint
- Confirmed `"use client"` is already first line in `HackermouthTerminalChat.tsx`.
- Added new wrapper `HackermouthTerminalChatWrapper.tsx` with `"use client"` + dynamic import (`ssr: false`) to force client-only render in App Router.
- Updated `app/characters/[id]/page.tsx` to import wrapper instead of direct chat component.
- Manual browser validation (localhost target): sent 3 messages successfully via UI; requests/responses now flow.
- Note: responses currently include remote engine command errors (SSH/history quoting path), but click/Enter send path is now active and functioning.

## 2026-04-12T18:23:41-04:00 Hackermouth stateless payload checkpoint
- Simplified Hackermouth chat payload in `HackermouthTerminalChat.tsx` to remove `history`; requests now send only:
  - `character_id: "hackermouth"`
  - `commit_id: "hackermouth_active"`
  - `message`
- Reason: avoids SSH shell quoting breakage from serialized conversation history.
- Manual browser validation (localhost): 3 sends succeeded with real Hackermouth responses (no command-failure text).
- Build status: passing (Next.js 16.2.3).
