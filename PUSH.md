> Structure: this repo's root IS the Arete app (package.json, src/, prisma/ at top level).
> emotion-sphere-ui / emotion-sphere-manage were removed; the emotion-sphere backend lives in its own repo.

# Push & env reference — Arete (AreteOS repo)

> The sandbox can't reach GitHub (network locked + no credentials), so the final
> `git push` runs **on your machine**. A commit is already prepared (1 ahead of `origin/main`).

## Push

```bash
cd <your>/python/emotions          # repo root, remote = zpcaiai/AreteOS
git log --oneline -1               # should read "feat: consolidate app into AreteOS…"
git push origin main
```

- Amend the message first: `git commit --amend`
- Undo the whole commit (keep files): `git reset --soft HEAD~1`

## Environment variables — Arete → Vercel

Required:

| Variable | Purpose | Example / value |
|---|---|---|
| `DATABASE_URL` | Neon **pooled** (runtime) | `postgresql://…-pooler.…neon.tech/neondb?sslmode=require&pgbouncer=true` |
| `DIRECT_URL` | Neon **direct** (`prisma db push` / migrate) | `postgresql://…(no -pooler)…neon.tech/neondb?sslmode=require` |
| `AUTH_SECRET` | session signing key | long random string |
| `AUTH_REQUIRED` | force login in prod | `true` |
| `NEXT_PUBLIC_SITE_URL` | absolute URL for SEO / OpenGraph / sitemap / robots | `https://your-app.vercel.app` |
| `ADMIN_EMAILS` | `/admin` allowlist (comma-separated) | `zpchoney@gmail.com` |
| `AI_PROVIDER` | AI backend | `mock` (offline) \| `openai` \| `anthropic` |

Optional (only if `AI_PROVIDER` is a real model): `OPENAI_API_KEY`, `OPENAI_MODEL`,
`ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL`.
Optional (knowledge graph, inert if unset): `NEO4J_HTTP_URL`, `NEO4J_USER`, `NEO4J_PASSWORD`.

> `emotion-sphere` backend/UI are separate repos (gitignored here). Their vars
> (`DB_R2DBC_URL`, `DB_USER`, `DB_PASSWORD`, `APP_JWT_SECRET`, `APP_CORS_ORIGINS`,
> UI `VITE_API_BASE`) are in `DEPLOY.md` sections B/C.

## ⚠️ Rotate the leaked DB password

A real Neon `DATABASE_URL` (with password) was pasted earlier in chat. Rotate it in the
Neon console, then set the new string in Vercel.
