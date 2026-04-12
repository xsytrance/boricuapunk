# Boricuapunk - Next Session Start

## Current objective
Bring up experimental site at `https://boricuapunk.agenorr.com` routed to VPS app on `100.113.155.3:9998`.

## Ground truth
- Stable/current Windows-hosted app: `rnc.agenorr.com` -> `127.0.0.1:9998`
- AI host on Windows: `ai.agenorr.com` -> `127.0.0.1:3000`
- Experimental VPS repo path: `/home/xsypluto/projects/boricuapunk`
- Branch: `forge-dev`

## Required cloudflared config (Windows)
```yaml
tunnel: 9a1d36a4-c276-4a9e-8bff-126cc520b37d
credentials-file: C:\Users\ageno\.cloudflared\9a1d36a4-c276-4a9e-8bff-126cc520b37d.json

ingress:
  - hostname: rnc.agenorr.com
    service: http://127.0.0.1:9998

  - hostname: ai.agenorr.com
    service: http://127.0.0.1:3000

  - hostname: boricuapunk.agenorr.com
    service: http://100.113.155.3:9998

  - service: http_status:404
```

## Activation checklist
1. Save Windows cloudflared config with ingress above.
2. Restart cloudflared service on Windows:
   - `Restart-Service cloudflared`
3. Ensure VPS boricuapunk is running on port 9998.
4. Verify:
   - `curl.exe -I https://boricuapunk.agenorr.com`
   - `curl.exe -sS https://boricuapunk.agenorr.com/api/archive/sightings`

## Recovery assets
- backup tar: `/home/xsypluto/backups/boricuapunk-pre-experimental-20260411T084854-0400.tar.gz`
- backup patch: `/home/xsypluto/backups/boricuapunk-pre-experimental-20260411T084854-0400.patch`
- checkpoint tag: `checkpoint-pre-experimental-20260411`

## Last commits
- `c0af760` docs: experimental rollout runbook and recovery checkpoints
- `c868ee8` pre-experimental checkpoint
