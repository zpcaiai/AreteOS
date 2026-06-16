# Deploy runbook — two ecosystems

> Run these on **your machine** (the sandbox has no GitHub/HF/Neon tokens and its network is locked).
> Order matters: **Neon (DB) → backend → frontend**, so each layer has the URL of the one below it.

```
emotion-sphere ecosystem            Arete (mission-os)
  emotion-sphere (Spring)  → HF       mission-os (Next.js, front+API)  → Vercel
  emotion-sphere-ui (Vite) → Vercel   prisma schema                    → Neon
  Postgres                 → Neon
```

Prereqs once: `npm i -g vercel`, install the HF CLI (`pip install -U huggingface_hub`), have `git`, `psql` (optional), Node 20+, JDK 21.

---

## 0) Neon — create the databases + connection strings

1. https://console.neon.tech → **New Project** (region close to your users).
2. Create **two** databases (or two projects) so the stacks don't share tables:
   - `arete` (for mission-os / Prisma)
   - `emotion_sphere` (for the Spring backend)
3. For each, copy from **Dashboard → Connection Details**:
   - **Pooled** string → `DATABASE_URL` (Arete runtime)
   - **Direct** string → `DIRECT_URL` (Arete migrations) and the host/user/pwd for emotion-sphere.

---

## A) Arete (mission-os) → GitHub + Vercel + Neon

### A1. Push to GitHub (repo already = `zpcaiai/AreteOS`)
```bash
cd python/emotions/AreteOS          # repo root IS the app now
git add -A
git commit -m "feat: Arete platform + Emporion store + deploy config"
git push origin main
```

### A2. Create the Neon schema (192 models)
```bash
cd python/emotions/AreteOS
export DATABASE_URL="<neon arete POOLED>"
export DIRECT_URL="<neon arete DIRECT>"
npm ci
npx prisma generate
npx prisma migrate deploy   # applies tracked migrations to Neon
npm run db:seed             # genius/identity/cognitive/worldview/audiobooks/emporion catalogs
```
> To **update** the schema later, edit `prisma/schema/*.prisma`, run
> `npm run db:migrate -- --name <x>` locally, commit the generated migration, then
> use `npm run db:migrate:deploy` in CI/production.
> If an existing Neon database was previously created with `db push`, baseline it
> once with `npx prisma migrate resolve --applied 20260610092400_init` before the
> first `migrate deploy`.

### A3. Vercel (whole Next app — front + API together)
```bash
cd python/emotions/AreteOS
vercel link                 # pick/create the project
# Set env vars (or do it in the dashboard → Settings → Environment Variables):
vercel env add DATABASE_URL production   # paste Neon POOLED
vercel env add DIRECT_URL  production     # paste Neon DIRECT
vercel env add AUTH_SECRET production     # long random
vercel env add AUTH_REQUIRED production   # true
vercel env add AI_PROVIDER production      # mock (or openai/anthropic + keys)
vercel --prod
```
Build is wired: `postinstall: prisma generate`, `build: prisma generate && next build`.
Root directory in Vercel = `.` (repo root is the app itself now).

---

## B) emotion-sphere backend → Hugging Face Space (Docker)

The backend repo already has remotes `origin` (GitHub) and `space` (HF).

### B1. Commit the new Docker config + push to GitHub
```bash
cd python/emotions/emotion-sphere
git add Dockerfile .dockerignore .env.example README.md
git commit -m "chore: Dockerize for Hugging Face Spaces (port 7860)"
git push origin main
```

### B2. Set HF Space secrets (Space → Settings → Variables and secrets)
From `emotion-sphere/.env.example` — at minimum:
```
DB_R2DBC_URL = r2dbc:postgresql://<neon-direct-host>:5432/emotion_sphere?sslMode=require
DB_USER      = <neon user>
DB_PASSWORD  = <neon password>
APP_JWT_SECRET = <long random>
APP_CORS_ORIGINS = https://<your-ui>.vercel.app
APP_ADMIN_EMAIL / APP_ADMIN_PASSWORD = <...>
```
> `schema.sql` runs on startup (`CREATE TABLE IF NOT EXISTS`), so Neon tables are created on first boot.

### B3. Deploy to the Space
```bash
cd python/emotions/emotion-sphere
git push space main          # HF builds the Dockerfile, exposes app_port 7860
```
Watch **Space → Logs**. Base URL becomes `https://<hf-user>-emotion-sphere.hf.space`.

---

## C) emotion-sphere-ui → Vercel
> 现在 UI 在 **emotion-sphere 仓库**内。Vercel 项目连 `zpcaiai/emotion-sphere`,**Root Directory = `emotion-sphere-ui`**。

```bash
cd python/emotions/emotion-sphere/emotion-sphere-ui
git add .env.example && git commit -m "chore: vercel env example" && git push   # if it has its own repo
vercel link
vercel env add VITE_API_BASE production   # = the HF Space URL from B3 (no trailing slash)
vercel --prod
```
Vercel auto-detects Vite (build `vite build`, output `dist`).

### C-final. Close the CORS loop
Put the resulting `https://<ui>.vercel.app` into the Space's `APP_CORS_ORIGINS`, then restart the Space.

---

## Verify
- Arete: open the Vercel URL → `/dashboard` loads, `/emporion` lists products (after `db:seed`).
- emotion-sphere: `curl https://<space>.hf.space/actuator/health` (or any public endpoint) → 200.
- UI: open the Vercel UI URL → it talks to the HF backend with no CORS error.

## Notes / gotchas
- **Neon + Prisma**: always keep `DIRECT_URL` set for migrations; runtime uses the pooled `DATABASE_URL`.
- **R2DBC + Neon**: use the **direct** (non-pooler) host and keep `?sslMode=require`.
- **HF cold start**: free Spaces sleep; first request after idle is slow.
- **AI**: `AI_PROVIDER=mock` runs the whole Arete app with no API keys; switch to `openai`/`anthropic` + key to go live.

## Weekly growth cards (server crontab)

The weekly growth-card push runs over HTTP via the secret-protected endpoint
`POST /api/cron/weekly` (auth: `CRON_SECRET`), so it works regardless of the local
toolchain and shares logic with `npm run weekly`.

Setup (on the machine/host that runs or can reach the app):

1. `.env` already has a generated `CRON_SECRET`; set `APP_URL` to your running app's
   base URL (defaults to `http://localhost:3000`). The app must be running/reachable.
2. Test the trigger manually: `scripts/weekly-cron.sh` — it prints the JSON
   `{ ranAt, users, generated, failed }`.
3. Install the weekly cron (Mondays 09:00 local), secrets stay in `.env`:

   ```
   ( crontab -l 2>/dev/null; echo '0 9 * * 1 /Users/stephen/Documents/Projects/python/emotions/AreteOS/scripts/weekly-cron.sh >> /tmp/areteos-weekly.log 2>&1' ) | crontab -
   ```

Logs go to `/tmp/areteos-weekly.log`. To verify it's installed: `crontab -l`.

## Read-model projections (engine_projections)

The event-sourced engines (journey/dashboard overview, etc.) can serve a cheap
upserted projection instead of replaying the event log per request. Code is already
in place (`src/lib/projections.ts`, used by `journeyOverview`) and **degrades
gracefully until the table exists** — so you can apply this any time, online:

```
npx prisma migrate dev --name engine_projections   # creates the table + regenerates the client
# or, without a migration:
npx prisma db execute --file prisma/sql/engine_projections.sql --schema prisma/schema
```

The model lives in `prisma/schema/projections.prisma` (`EngineProjection` →
`engine_projections`). Reads use a two-tier cache: in-process 20s → DB projection
120s → recompute + persist. No code change is needed after migrating.
