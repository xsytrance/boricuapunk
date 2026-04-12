# Boricuapunk Experimental Rollout Runbook

Date: 2026-04-11

## Goal
Deploy an experimental Boricuapunk instance from VPS (`100.113.155.3`) at:
- `https://boricuapunk.agenorr.com`

Current stable site (Windows box) remains:
- `http://100.94.216.114:9998` (and current `rnc.agenorr.com` mapping)

## Desired access model
- Login: Agenor (admin)
- Login: Jay (collaborator)
- Public no-login view

Implementation of auth/access is intentionally deferred; this runbook is infra + recovery prep only.

---

## 1) Preflight checklist (VPS)
1. Repo path exists: `/home/xsypluto/projects/boricuapunk`
2. Build passes: `npm run build`
3. App starts locally: `PORT=9998 npm run start` (experimental port 9998)
4. Env configured in `.env` (or systemd env file)
5. Firewall allows only required inbound (80/443)

## 2) Autostart service (systemd) — recommended
Create `/etc/systemd/system/boricuapunk-experimental.service`:

```ini
[Unit]
Description=Boricuapunk Experimental Next.js
After=network.target

[Service]
Type=simple
User=xsypluto
WorkingDirectory=/home/xsypluto/projects/boricuapunk
Environment=NODE_ENV=production
Environment=PORT=9998
ExecStart=/usr/bin/npm run start
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Enable:
```bash
sudo systemctl daemon-reload
sudo systemctl enable --now boricuapunk-experimental
sudo systemctl status boricuapunk-experimental
```

Logs:
```bash
journalctl -u boricuapunk-experimental -f
```

## 3) Cloudflare routing options

### Option A (preferred): Cloudflare DNS + proxied A record
1. Add DNS record in Cloudflare:
   - Type: A
   - Name: `boricuapunk`
   - Content: VPS public IP (or tunnel endpoint)
   - Proxy status: Proxied (orange cloud)
2. TLS mode: Full (strict) if certs are valid.
3. Reverse proxy on VPS routes 443 -> `127.0.0.1:9998` (Nginx/Caddy).

### Option B: Cloudflare Tunnel (no direct public VPS IP exposure)
1. Install `cloudflared` on VPS.
2. Create tunnel and route hostname `boricuapunk.agenorr.com` to `http://127.0.0.1:9998`.
3. Keep tunnel service enabled on boot.

This is usually the easiest secure path if direct ingress is undesired.

## 4) Reverse proxy (if Option A)
Use Nginx or Caddy to terminate TLS and proxy to local Next.js port 9998.

## 5) Operational checks
- `curl -I https://boricuapunk.agenorr.com`
- `curl -I https://boricuapunk.agenorr.com/api/archive/sightings`
- Confirm homepage and key routes load.

## 6) Backup + recovery checkpoints already created
- Tarball backup:
  - `/home/xsypluto/backups/boricuapunk-pre-experimental-20260411T084854-0400.tar.gz`
- Patch backup:
  - `/home/xsypluto/backups/boricuapunk-pre-experimental-20260411T084854-0400.patch`
- Git commit checkpoint:
  - `c868ee8`
- Git tag:
  - `checkpoint-pre-experimental-20260411`

## 7) Fast rollback procedure
If experimental deployment fails:

```bash
cd /home/xsypluto/projects/boricuapunk
git fetch --all
git checkout checkpoint-pre-experimental-20260411
npm ci
npm run build
sudo systemctl restart boricuapunk-experimental
```

If filesystem recovery needed:
```bash
mkdir -p /home/xsypluto/recovery
tar -xzf /home/xsypluto/backups/boricuapunk-pre-experimental-20260411T084854-0400.tar.gz -C /home/xsypluto/recovery
```

## 8) Next phase (not implemented yet)
- Add auth system with 3 access modes (Agenor, Jay, public).
- Define role capabilities and protected routes.
- Add session and audit controls.
