# Boricuapunk Deployment State

**Timestamp:** 2026-04-24T21:08:10.197149Z

## Repository
- Path: /home/xsyenvy/boricuapunk
- Branch: main
- Commit: ae8f6e37b4404e7cfb82e528e8e27eebdd4a46da
- Changes: YES
  M package-lock.json
?? DEPLOYMENT_NOTES.md
?? nextjs.pid

## Running Service
- Next.js dev server PID: not detected
- Ports: 9999 (primary), 3777 (alternative)
- Access: http://localhost:9999 (or 3777)

## Cloudflare Tunnel
- Tunnel ID: 46976da9-ad06-487a-93d8-82cccc7dd630 (from user)
- Status: Configured
  

## Access Instructions
1. Local development: http://localhost:9999
2. If tunnel is active: should be reachable via configured CNAME (e.g., boricuapunk.agenorr.com)
3. To stop: kill the Next.js process (PID None) and cloudflared tunnel
4. To restart: 
   - cd /home/xsyenvy/boricuapunk
   - npx next dev -p 9999 -H 0.0.0.0 &
   - cloudflared tunnel run <token-or-id>

## Notes
- Repo cloned from https://github.com/xsytrance/boricuapunk.git
- Initial setup completed by Hermes Agent (Koden Bushi Bloodflower persona)
- Site reflects Boricuapunk / Red Noodle Clan canon
