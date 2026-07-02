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

- Runtime and package manager: `bun@1.2.23`
- Monorepo tooling: Turborepo
- Web app: `apps/studio` using TanStack Start, React 19, Tailwind, Base UI, Tabler Icons, Elysia, and Eden Treaty
- Studio domain package: `packages/studio/domain`
- Studio repository package: `packages/studio/repository`
- Studio service package: `packages/studio/service`
- Studio API package (Elysia): `packages/studio/api`
- Shared tooling and UI packages live under `packages/shared/*` (`cli`, `logger`, `ui`, `typescript-config`)
- Environment and config for the studio stack live in `packages/configs/studio-config`

When extending this template with additional apps (e.g. mobile, realtime), colocate app-specific packages under `packages/{app-name}/*` and config under `packages/configs/{app-name}-config`. Keep cross-cutting concerns in `packages/shared/*`.

## Backend Layering

The generic layering pattern and per-layer folder structure (`domain → repository → service → api →
ui`, plus `lib/`/`shared/` and the `domain` folder vocabulary) live in **Backend Layering** in
`@docs/conventions.md`. This section records only the concrete studio-stack specifics:

- Keep app-specific WebSocket or realtime-only concerns out of `packages/studio/*` unless they belong to the studio stack.
- Put database schema definitions and `drizzle-zod` entities in `packages/studio/domain`; use `createInsertSchema()`, `createUpdateSchema()`, and `createSelectSchema()`.
- Keep direct database access in `packages/studio/repository`, business logic in `packages/studio/service`, and the Elysia app / route composition in `packages/studio/api`. Elysia validators accept the `drizzle-zod` schemas directly (Standard Schema).
- The Elysia app is mounted in the TanStack Start server via `app.handle()` at `/api`; the frontend calls it through the Eden Treaty client (`src/integrations/eden`). Real-time uses Elysia async-generator SSE routes consumed as Eden async iterables (WebSocket is not used — it can't upgrade through the mounted `.handle()`).

## Scaffolding

- **`bun run gen:app`** — Turbo generator in `turbo/generators/config.ts`. Creates the app under `apps/{name}` plus layered packages (`domain`, `repository`, `service`, `api`) and `packages/configs/{name}-config`.
- **TanStack Start template** — `turbo/generators/templates/app-tanstack/`. Aligns with `apps/studio`: `~/*` path alias, `components/core/root/` shell, Eden Treaty client under `src/integrations/eden/`, TanStack Query provider, `@temp-repo/ui`, Nitro + rolldown-vite.
- **Reference app** — treat `apps/studio` as the living example when extending a generated app. Root `CLAUDE.md` applies to all apps unless an app adds a local override.
- **`bun run gen:lib`** — shared library under `packages/shared/{name}`.

## Commands

- Web development: `bun run repo dev --app studio` (localhost:3000)
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
- If asked to commit, follow the **Commit Convention** in `@docs/conventions.md`.
