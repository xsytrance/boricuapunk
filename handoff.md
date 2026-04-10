# Handoff State

## Current branch
- forge-dev

## Current repo state
- Boricuapunk has been expanded into a multi-page archive.
- Key routes exist: /archive, /characters, /factions, /lore, /locations, /logs, /ships, /timeline, /relationships, /about.
- Header nav and the archive hub both surface the major routes.
- Character detail pages now include faction context, related quotes, and cross-links.
- The new ships page centers the Jibaro and links ship lore into the archive network.

## Runtime / environment
- Local dev server target: http://127.0.0.1:9999
- cloudflared config maps rnc.agenorr.com to localhost:9999
- GitHub pushes require PAT-based auth in this environment.

## Design constraints
- Keep edits minimal and focused.
- Preserve the archive’s red/orange cinematic style.
- Prefer new routes and cross-linking over homepage bloat.

## Good next moves
- Add search/filtering for the character archive.
- Add faction detail pages.
- Add location detail pages.
- Add a site search or recommendation path page.
