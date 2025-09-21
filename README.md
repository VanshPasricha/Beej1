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