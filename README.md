# Beej1

## Branch strategy

- `cleaned-main`: Active development branch. This branch contains a clean history without large artifacts (no `node_modules/`, no `.next/`). Please base all new work and pull requests on this branch.
- `main`: Archived for reference only (older history that included large tracked files). Do not push new commits to `main`.

If you need to compare histories or cherry-pick, prefer opening PRs into `cleaned-main`.

## Local development

Prereqs: Node 18 with npm 9 (project engines), `nvm` recommended.

```bash
nvm use 18
npm install
npm run dev
```

Environment:

- To run without a database, create `hackthon-main/.env.local` with `NO_DB=true`.
- To enable DB later, set `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT` and restart the dev server.

## Deploy to Netlify

Use the `cleaned-main` branch and the `hackthon-main/` base directory.

Netlify settings:

- Base directory: `hackthon-main/`
- Build command: `npm ci && npm run build`
- Publish directory: `.next`
- Environment (already in `hackthon-main/netlify.toml`):
  - `NODE_VERSION=18`
  - `NO_DB=true` (DB-less demo mode)

Optional environment (to enable DB later):

- `NO_DB=false`
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`, `DB_SSL`

Notes:

- `@netlify/plugin-nextjs` is enabled via `netlify.toml` and will handle Next.js features.
- Deterministic installs use `npm ci` (guided by `package-lock.json`).
- Local Node version is pinned to 18 via `.nvmrc` and `package.json` engines.