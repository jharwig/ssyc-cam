# SSYC Cameras

Static React app served on GitHub Pages that displays camera feeds through an HTTPS Cloudflare Worker proxy.

## Deploy Commands

- `npm run deploy:github`: builds `docs/` for GitHub Pages (main branch workflow/branch publish handles the deploy).
- `npm run deploy:cloudflare`: deploys the Worker in `cloudflare/worker.js` via Wrangler.
- `npm run deploy`: runs both deploys in sequence.
- `npm run deploy:all`: build `docs/`, commit only `docs/` updates, push `main`, then deploy Cloudflare.

## One-Time Setup (CLI-Only)

1. Configure GitHub Pages for main-branch deploys:
   - Ensure GitHub Pages is configured to publish from `main` and `docs/`.
   - Push `main` after running `npm run deploy:github` so Pages picks up the updated `docs/`.
2. Set Cloudflare auth env vars:
   - `export CLOUDFLARE_API_TOKEN=...`
   - `export CLOUDFLARE_ACCOUNT_ID=...`
3. Deploy Worker to `workers.dev`:
   - `wrangler.toml` uses `workers_dev = true` and does not require routes or DNS setup.

With these set, deploys are fully command-driven and do not require dashboard clicks.

`deploy:all` assumes you are using `origin/main`.

## Camera Proxy URL

The app reads `VITE_CAM_PROXY_BASE` and defaults to:

- `https://ssyc-cam-proxy.jason-harwig.workers.dev`

Set it explicitly if needed:

- `export VITE_CAM_PROXY_BASE=https://ssyc-cam-proxy.jason-harwig.workers.dev`

## Notes

- Worker config: `wrangler.toml`
- Worker code: `cloudflare/worker.js`
- Camera URL mapping: `src/cameras.ts`
