# CLAUDE.md

This file applies to the whole repository unless a deeper `CLAUDE.md` overrides it.

## Conventions

Portable code-style and folder-structure rules live in a reusable file imported here:

@docs/conventions.md

That file covers **Vocabulary**, **Modules & Scope** (the `lib/` + `shared/` model), **Backend
Layering**, **Component Authoring**, **State & Wiring**, **Code Style**, and **Workflow** (working
principles, task management, and the commit convention). The sections below stay in this file because
they describe this repo's specific topology, scaffolding, and commands.

## Repository Overview

- Runtime and package manager: `bun@1.4.0`
- TypeScript 7 (native `tsc`); dev servers run through **portless** (`https://{app}.localhost`, names in `portless.json`, `PORTLESS=0` to bypass)
- Monorepo tooling: Turborepo
- Two apps:
  - `apps/studio` — TanStack Start (React 19, Tailwind, Base UI, Tabler Icons) frontend + an **auth-only** Elysia backend (better-auth: magic link + jwt/jwks). The frontend + identity provider.
  - `apps/realtime` — a **headless** Bun/Elysia server (own process, `https://realtime.localhost`) that owns all transactional operations (todos, chat over HTTP) **and** a WebSocket room (presence + live chat). Verifies studio JWTs via JWKS — no shared secret.
- Studio packages: `packages/studio/{domain,repository,service,api}` (auth only) + `packages/configs/studio-config`.
- Realtime packages: `packages/realtime/{domain,repository,service,api}` + `packages/configs/realtime-config`.
- Two databases: studio (auth tables) and realtime (business/realtime data).
- Shared tooling and UI live under `packages/shared/*` (`cli`, `logger`, `ui`, `typescript-config`).

When extending the template with additional apps, colocate app-specific packages under `packages/{app-name}/*` and config under `packages/configs/{app-name}-config`. Keep cross-cutting concerns in `packages/shared/*`.

## Backend Layering

The generic layering pattern and per-layer folder structure (`domain → repository → service → api →
ui`, plus `lib/`/`shared/` and the `domain` folder vocabulary) live in **Backend Layering** in
`@docs/conventions.md`. This section records only the concrete studio-stack specifics:

- `apps/studio` backend is **auth only**: better-auth is mounted at `/api/auth` (magic link + `jwt`/`jwks`). All transactional data + logic lives on the realtime server. Put `drizzle-zod` entities in the relevant `domain` package (`createInsertSchema()`/`createUpdateSchema()`/`createSelectSchema()`).
- `apps/realtime` is a **standalone** Elysia server started with `.listen()` (NOT `.handle()`), so native WebSocket upgrades work. `packages/realtime/{domain,repository,service,api}` hold the tables/entities + WS event schemas, the DB client, business logic + an in-memory `RoomHub` + JWKS `verifyToken`, and the Elysia app (HTTP routes + the `.ws()` room). Elysia validators accept `drizzle-zod`/zod schemas directly (Standard Schema).
- **Cross-service auth**: studio mints a JWT (`GET /api/auth/token`); the realtime server verifies it against studio's JWKS (`/api/auth/jwks`) with `jose` — no shared secret. The frontend attaches a Bearer JWT to realtime HTTP calls and passes `?token=` on the WebSocket.
- **Elysia 2 (pre-release, `2.0.0-beta.14`)**: the whole repo type-checks under TypeScript 7's native `tsc` — Elysia 2 fixed the `.ws()` cross-package instantiation that broke on Elysia 1.x. Migration specifics worth knowing: `.ws()` requires the capability plugin (`import { websocket } from 'elysia/websocket'` + `.use(websocket())` before the routes); `@elysiajs/cors` has no Elysia-2 build yet, so realtime CORS is hand-rolled in `packages/realtime/api/src/app.ts` (a `request` hook + an `OPTIONS` preflight route); a `.ws()` route only populates `ws.query`/the message when a **schema is declared**; `ws.id` is empty and the `ws` object isn't stable across handlers, so the client supplies a unique **`?cid=`** per connection and `RoomHub` keys on it; and `ws.send` takes a **string** (events are JSON, the client `JSON.parse`s). **All routes live in the api package** — `packages/realtime/api/src/routes/{todos,chat,room}.ts` (HTTP routes **and** the `.ws()` room) — composed into the one exported `app`; the app entry (`apps/realtime`) just `.listen()`s it. The frontend consumes the WS via a native socket typed with `packages/realtime/domain` event schemas.

## Scaffolding

- **`bun run gen:app`** — Turbo generator in `turbo/generators/config.ts`. Prompts for a name and a **type** (`studio` | `realtime`), then creates the app under `apps/{name}` plus layered packages (`domain`, `repository`, `service`, `api`) and `packages/configs/{name}-config`.
- **Studio template** — `turbo/generators/templates/app-tanstack/`. TanStack Start + Elysia HTTP API: `~/*` path alias, `components/core/root/` shell, Eden Treaty client under `src/integrations/eden/`, TanStack Query provider, `@temp-repo/ui`, Nitro + Vite 8.
- **Realtime template** — `turbo/generators/templates/app-realtime/`. A headless Elysia WebSocket server (presence + chat room) with JWKS auth; mirrors `apps/realtime`.
- **Reference app** — treat `apps/studio` as the living example when extending a generated app. Root `CLAUDE.md` applies to all apps unless an app adds a local override.
- **`bun run gen:lib`** — shared library under `packages/shared/{name}`.

## Commands

- Studio (frontend + auth) development: `bun run repo dev --app studio` (https://studio.localhost)
- Realtime (WebSocket server) development: `bun run repo dev --app realtime` (https://realtime.localhost)
- Bypass portless (plain `localhost:3000` / `:3001`): `PORTLESS=0 bun run repo dev --app <app>`
- Web production build: `bun run repo build --app studio`
- Web preview: `bun run repo serve --app studio`
- Docker up/down: `bun run repo docker:up --app studio` / `bun run repo docker:down --app studio`
- Repo typecheck: `bun run check-types`
- Repo lint and formatting check: `bun run fmt-lint`
- Repo lint and formatting fix: `bun run fmt-lint:fix`
- Repo tests: `bun run test`
- End-to-end tests: `bun run repo test:e2e`
- Generate app: `bun run gen:app`
- Generate library: `bun run gen:lib`
- Studio DB generate: `bun run repo db:generate --app studio`
- Studio DB migrate: `bun run repo db:migrate --app studio`
- Studio DB push: `bun run repo db:push --app studio`
- Studio DB seed: `bun run repo db:seed --app studio`

## Deploy

Coolify + Railpack, built from the repo root. `bun run repo build --app {app}` emits a self-contained output (`apps/studio/.output` via Nitro's bun preset, `apps/realtime/dist` via `bun build --target bun`) plus `{out}/migrate/migrate.js` + the drizzle folder. `apps/{app}/railpack.json` (select per Coolify app with `RAILPACK_CONFIG_FILE=apps/{app}/railpack.json`) runs that build and ships only the output + bun into the runtime image; migrations run as the pre-deployment command `bun run {out}/migrate/migrate.js`. `db:migrate` uses the same `src/db/migrate.ts` locally. The build forces `NODE_ENV=production` (a dev value in `.env` would make Vite emit a development SSR bundle) and needs no secrets; `VITE_REALTIME_URL` is the one build-time value. Devtools are a dev-only lazy import (`components/core/root/root-devtools.tsx`) — Solid-based devtools must never reach the SSR bundle.

## Verification

- Start with the smallest relevant check for the code you changed, then broaden as needed.
- Before handing work off, run the relevant subset of:
  - `bun run check-types`
  - `bun run fmt-lint`
  - `bun run test`
- If database code changes, run the appropriate `db:*` command or explain why it was not run.
- If you cannot run a command, document the reason and note the remaining risk.

## Handoff Notes

- Reference concrete files and commands when summarizing work.
- Call out any follow-up steps needed when contracts or shared packages change.
- Commit freely at logical checkpoints, following the **Commit Convention** in
  `@docs/conventions.md`. Push or open a PR only when asked; never commit directly to main in
  multi-branch repos — branch first.
