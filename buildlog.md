# Build Log

Append-only record of work on Boricuapunk.

## 2026-04-10
- Cloned the repository from https://github.com/xsytrance/boricuapunk.git into /tmp/boricuapunk.
- Created and switched to branch forge-dev; kept all changes off main.
- Added mobile/desktop-aware home rendering with optimized variants for each viewport.
- Verified with npm ci, npm run build, and local server checks on port 9999.
- Confirmed cloudflared config routes rnc.agenorr.com to localhost:9999.
- Pushed forge-dev after authenticating with the provided GitHub PAT file.
- Expanded the site into a multi-page archive with:
  - /archive
  - /factions
  - /lore
  - /locations
  - /logs
  - /about
- Added shared archive page shell and updated navigation.
- Cross-linked the archive pages so characters, factions, lore, locations, and logs point to each other.
- Added /timeline and /relationships for chronology and connection mapping.
- Added /ships for the Jibaro-focused vessel archive and cross-linked it from locations, timeline, relationships, archive hub, header, and home.
- Added /weapons for the novel’s named blades, Planet Weapons, and tech-curses.
- Added dedicated detail pages for Jibaro and Spada Virina.
- Updated README.md to describe the live archive structure and dev notes.
- Updated header/home links to surface the new archive structure.
- Verified builds after each major expansion and pushed commits to forge-dev.

## Working notes
- The repo is intended to stay on forge-dev; do not push directly to main.
- Current local dev server target is port 9999.
- The site is now a multi-route archive, not a homepage-only experience.
