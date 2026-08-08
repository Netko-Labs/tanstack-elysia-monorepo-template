# Conventions

Portable code-style and folder-structure rules. These are project-agnostic and meant to be reused
across repositories — import this file from a repo's `CLAUDE.md` (e.g. `@docs/conventions.md`) and
keep project-specific topology, commands, and data-flow notes in `CLAUDE.md` itself.

This file uses neutral placeholders: `{app}`, `{context}`, `{module}`, `{entity}`, `@org/*`. Swap
them for the host project's equivalents.

## 1. Vocabulary

| Term | Meaning |
| --- | --- |
| context | A grouping folder that owns child modules (`components/`, `integrations/`, a feature folder, a backend layer). |
| module | A folder with a public surface and an `index.ts` barrel. A **component module** has a `.tsx`; a **logic module** does not. |
| `lib/` | A context's internal implementation: `hooks/`, `utils`, `types`, `constants`, `values`. Private to the context. Universal — any app or backend layer. |
| `hooks/` | Obligatory subfolder for `use-*.ts` hooks, in any module. |
| `shared/` | Per-context reuse bucket (`{context}/shared/`): code reused by lower levels in the subtree, or exported. Universal across the monorepo. |
| `core/` | App-root providers, layouts, and shells not tied to a single feature. |
| store | Client-state coordination (e.g. a Zustand store), colocated with the feature it serves. |
| barrel | An `index.ts` that only re-exports. |
| layer | A backend package: `domain`, `repository`, `service`, `api`. |

## 2. Modules & Scope

A module is a folder with a public surface plus an `index.ts` barrel. Internals live under `lib/`;
anything reused or exported lives under `shared/`.

### Two core buckets — universal across the whole monorepo

Both buckets are valid in every app and every backend layer (`domain` included). No context is
exempt.

- **`lib/` — a context's internal implementation.** Groups the context's private supporting code:
  `hooks/`, `utils`, `types`, `constants`, `values`. Use it to separate internals from the context's
  primary artifact (a component `.tsx`, a layer's operation files, a domain table). A small module
  may keep a single category file at its root and introduce `lib/` once there are internals worth
  grouping.
- **`shared/` — a per-context reuse bucket.** Something belongs in `{context}/shared/` when it is
  reused by lower levels in that context's subtree, or exported to another app/package. Cross-app
  exports graduate out of the app to `packages/shared/*`.

### Module anatomy

A **component module** keeps the `.tsx` (and nested sub-components) at the root; internals nest
under `lib/`:

```
components/{feature}/                 # e.g. components/dashboard/message-feed/
  {feature}.tsx                       # public artifact(s)
  {feature}-item/                     # nested sub-components get their own folders
  lib/                                # internal implementation
    hooks/
      use-{feature}.ts                # hooks ALWAYS live in a hooks/ subfolder
    utils.ts                          # → utils/ when many OR a file > 300 lines
    types.ts                          # → types/ when many OR > 300 lines
    constants.ts                      # → constants/ when many OR > 300 lines
    values.ts                         # → values/ when many OR > 300 lines
    index.ts
  index.ts                            # barrel
```

A **logic / utility module** (no component) places its category files/folders at the module root —
no `lib/` wrapper, since the module itself is the implementation:

```
{context}/shared/{module}/            # e.g. components/shared/dom-events/
  hooks/
    use-document-keydown.ts
    use-sync-on-visible.ts
  utils.ts                            # → utils/ when many OR > 300 lines
  types.ts                            # → types/ when many OR > 300 lines
  constants.ts                        # → constants/ when many OR > 300 lines
  values.ts                           # → values/ when many OR > 300 lines
  index.ts
```

### Rules

- **`hooks/` is an obligatory subfolder** in every module (component or logic) — even for one hook.
  A module is a folder with files split by kind; never a single file mixing hooks, utils, and types.
- **Progressive disclosure** for `utils`, `types`, `constants`, and `values`: start as a single flat
  file (`utils.ts`); promote to a category subfolder (`utils/`) only when the category has **many
  entries OR a file exceeds 300 lines**. This applies uniformly to all four categories; only
  `hooks/` is always a subfolder.
- **Barrel:** `index.ts` re-exports only — no declarations or logic.
- **No inline type declarations** in implementation files (`.tsx`, hooks, stores, handlers,
  `utils.ts`). Types live in the module's `types.ts` (or `types/`).
- **Constants** export as `UPPER_SNAKE_CASE` (e.g. `IDEMPOTENCY_KEY_PREFIX`, `UPLOAD_EXPIRY`).
- **`lib/` holds no JSX, side effects, or runtime entry points** beyond pure helpers and hooks —
  declarations (`types`/`constants`/`values`) carry no runtime logic.

### Scope ladder (narrowest → widest)

1. **module-internal** → `lib/` (or the module root for a logic module)
2. **context reuse** → `{context}/shared/{module}/` (same anatomy)
3. **app-root foundational** → `components/core/` (providers, layouts, shells)
4. **cross-app** → `packages/shared/*`

### Placement

A module's "internal area" = `lib/` for a component module, or the module root for a logic module.

| You have… | Put it in |
| --- | --- |
| a hook | the internal area's `hooks/use-*.ts` (always a `hooks/` subfolder) |
| a pure helper | internal `utils.ts` → `utils/` when many or > 300 lines |
| a type / interface / enum | internal `types.ts` → `types/` when many or > 300 lines |
| immutable config / limit / key | internal `constants.ts` (`UPPER_SNAKE_CASE`) → `constants/` when many or > 300 lines |
| static copy / preset / label map | internal `values.ts` → `values/` when many or > 300 lines |
| the module barrel | `{module}/index.ts` (re-exports only) |
| code reused lower in a context, or exported | `{context}/shared/{module}/` |
| an app-root provider / layout / shell | `components/core/` |
| a cross-app primitive | `packages/shared/*` |
| shared client state / command registration | a feature store (`use-*-store.ts`); server state stays in the data layer |
| a cross-feature DOM event helper | a `shared/` logic module (e.g. `shared/dom-events/`), never a `window` event bus |

**Every module — component or logic — has a root `index.ts` barrel**, and it is the module's only
public entry. Import a module through its barrel (`@/{context}/{module}`), never through its inner
files: not the component file (`.../{module}/{module}`) and not its `lib/` internals. The barrel
re-exports the module's public surface (the component, public hooks/helpers) — internals stay
unexported.

## 3. Backend Layering

Strict one-way dependency:

```
domain  →  repository  →  service  →  api  →  ui
```

The universal conventions from §2 — `lib/` (internal), `shared/` (reused/exported), the obligatory
`hooks/` subfolder, and the "many or > 300 lines" promotion rule — apply to **every** layer; no
layer is exempt. Layers differ only in their layer-specific top-level folders.

**`domain`** — the data model. Fixed category folders, plus universal `lib/` and `shared/`:

```
domain/      db/         table definitions
             entities/   db entities (db-backed entity schemas)
             schemas/    zod validation schemas + interfaces/types, per entity
                         (schemas/{entity}/{name}-schema.ts)
             values/     constants, enums, etc.
             factory/    factories
             lib/        internal helpers/types          # universal
             shared/     reused/exported helpers/types   # universal
             index.ts
```

**`repository`** — the only layer with direct DB / cache / file IO:

```
repository/  db/      client + per-table query functions + migrations + seed
             cache/   cache client + pub/sub + idempotency + rate limiting
             files/   object storage
             shared/  cross-module helpers/types
             index.ts
```

**`service`** — business logic, folder-per-entity:

```
service/     queries/{entity}/{op}.ts + index.ts     # read operations
             mutations/{entity}/{op}.ts + index.ts    # write operations
             {concern}/                               # cross-entity concerns (logic modules)
             shared/                                  # cross-service helpers + types
             index.ts
```

**`api`** — the Elysia application (HTTP + WebSocket):

```
api/         routes/{entity}.ts   Elysia route modules (.use()-d into the app)
             setup.ts             shared plugins/macros (e.g. the auth guard)
             shared/              cross-route helpers/types
             app.ts               the Elysia app (prefix '/api') + `export type App`
             index.ts             re-exports app + App
```

Architecture rules:

- Keep the flow aligned as `domain → repository → service → api → ui`.
- Direct database access lives only in `repository`; business logic in `service`; the Elysia app and
  route composition in `api`.
- **Validation schemas come from `domain`, as zod — never inline, never TypeBox `t.*`.** For every
  HTTP/Elysia validator (`body`/`query`/`params`/`response`, including `.ws()` schemas), reuse a
  `drizzle-zod` entity from `domain/entities/`, or define the shape as a **zod** schema in
  `domain/schemas/{entity}/{name}-schema.ts` (e.g. `schemas/user/re-enable-user-schema.ts`) and import
  it — Elysia accepts zod directly via Standard Schema. This keeps request/response shapes owned by the
  domain and reusable. *(HTTP/Elysia servers only — tRPC routers keep their zod `input`/`output`
  inline.)*
- In `service`, prefer the folder-per-entity structure under `queries/*` and `mutations/*`.
- When extending the API, compose smaller per-entity Elysia route modules with `.use()` instead of growing one file.

## 4. Component Authoring

These rules apply to frontend UI code (apps and shared UI packages). They extend §2.

### Hierarchy and atomization

- Structure components as a shallow tree, not a flat list of large files. Each folder owns one
  concern and composes smaller children, nesting feature → section → element (e.g.
  `components/{feature}/{feature}-section/{feature}-element/`).
- Cross-feature reusable UI belongs in a `shared/` context; app-root foundational UI belongs in
  `core/`; primitives used across multiple features belong in `packages/shared/*`.
- Prefer many small components over one component with large conditional branches. Extract when a
  section has its own props, state boundary, or reuse potential.
- Name folders and files consistently: `{feature}-{section}.tsx`, `{feature}-{element}.tsx`.
- Keep route files thin — export `Route` and delegate substantial UI to a component under
  `components/` or a route-specific feature folder.

### Size and hook budgets

- **Line budget:** `.tsx` files and colocated `.ts` files (hooks, handlers) should stay **≤ 300
  lines**. Exceeding 300 lines requires a documented reason (e.g. code-generated markup, a single
  cohesive state machine) and a plan to split when next touched.
- **Hook budget:** a component file should use **≤ 3 React hooks** (`useState`, `useEffect`,
  `useMemo`, `useCallback`, `useRef`, context hooks, query hooks, etc.). Count each custom hook as
  one hook.
- When logic exceeds the budget, extract a colocated custom hook into `lib/hooks/` or move shared
  client state to a store. Split hooks by concern — data fetching, subscriptions, copy/actions,
  keyboard shortcuts, and bridge registration each get their own hook. If the overflow is *state that
  distant or sibling UI also touches*, lift that slice into a store; local/ephemeral state stays in
  the hook — see **State & Wiring**.
- Presentation stays in the component; data fetching, subscriptions, derived state, and pure helpers
  move to hooks, `lib/`, a `shared/` module, or a store.

## 5. State & Wiring

These rules apply to frontend client wiring. Prefer the simplest option that keeps producers and
consumers in sync:

1. **Props and callbacks** when both sides share a parent.
2. **A client state store** (e.g. Zustand) when distant UI needs shared client state or imperative
   command registration (e.g. a feed, sidebar, top bar, command palette).
3. **DOM helpers** in a `shared/` logic module (e.g. `shared/dom-events/`) for real browser events
   (`useDocumentKeydown`, `useSyncOnVisible`).

**Prefer a store over a state-heavy hook — when the state is actually shared**

When a hook coordinates state that **distant or sibling UI also reads/writes** — and that hook has
grown into a state machine (many atoms plus the effects wiring them) — move that state and its
actions into a colocated store instead of prop-drilling or fanning into more orchestrating sub-hooks.
Consumers then subscribe with selectors. The trigger is **shared reach**, not atom count:

- ✅ Extract: the state feeds a command palette, a sibling toolbar/panel, or app-level coordination
  (e.g. a `dashboard` store that a feed, top bar, and command palette all register into and read).
- ❌ Keep it a hook: state that is **local, ephemeral, or per-instance** — dialog open flags, form
  fields, copied/“just saved” flags, search text, per-channel feed buffers — even with many atoms.
  A global store here breaks remount-reset semantics and per-instance isolation, and adds ceremony
  with no sharing benefit. Tame the complexity by decomposing into focused sub-hooks and lifting
  only the genuinely-shared slice into the store.

Reserve hooks for view-bound glue — wiring props, local ephemeral UI state, and effects; put shared
or heavy state and
imperative coordination in a store.

**Client state stores**

- Colocate stores under the feature they serve (e.g. `components/{feature}/use-{feature}-store.ts`).
- Keep server state in the data-fetching layer (e.g. React Query); stores hold UI coordination and
  handlers, not fetched entities.
- Subscribe narrowly with selectors so unrelated updates do not re-render the tree.
- Call `getState()` in event callbacks when handlers must stay fresh without subscribing.
- Use `register*` + cleanup when a mounted feature owns handlers so unmount clears stale references.
- Prefer feature-scoped stores over one app-wide store. React Context is fine for static providers
  (theme, auth wrappers), not growing mutable coordination state.

**No `window` event bus** — do not use `window.dispatchEvent`, custom `window` listeners, or
`window` as application pub/sub.

- **Keyboard shortcuts:** a document-level hook (e.g. `useDocumentKeydown`), not scattered
  `window.addEventListener('keydown', ...)`.
- **Tab focus / permission sync:** a visibility hook on `document.visibilitychange` (e.g.
  `useSyncOnVisible`); do not duplicate with a `window` `focus` listener.
- **`window` is allowed** for unavoidable browser APIs (`window.location`, `window.open`,
  `Notification`, `localStorage`).
- **Viewport-wide pointer tracking** may use `window` listeners in a single hook when `document` is
  insufficient; document why.

## 6. Code Style

- Prefer the repo's package manager and scripts over ad-hoc npm/pnpm/yarn commands.
- Honor the repo's formatter/linter and its config (indentation, line width, quote style, naming
  convention). Do not fight the configured rules.
- Reuse existing import aliases (e.g. `@/*` inside apps) instead of adding deep relative imports.
- Prefer shared UI primitives and the project's icon set before adding or hand-rolling UI building
  blocks.
- Avoid `any`, `@ts-ignore`, and loosely typed boundaries when a type-safe alternative is practical.
- Keep changes tightly scoped; do not refactor unrelated areas while fixing a focused problem.
- Update supporting artifacts when required, including schema, migrations, generated files, or docs.

## 7. Workflow

### Working principles

- Prefer the smallest safe change that solves the problem.
- Follow existing patterns before introducing new abstractions.
- Fix root causes instead of layering on workarounds.
- Do not add new dependencies unless the current stack cannot solve the problem cleanly.
- Be explicit about uncertainty, tradeoffs, and anything you could not verify.

### Task management

Use a `tasks/` directory for non-trivial work that needs a visible checklist or checkpoint trail:

- `tasks/todo.md` — checklist with acceptance criteria, progress, and checkpoint notes.
- `tasks/lessons.md` — failure modes and prevention rules after corrections.

Keep task files short and current. Do not create them for one-line fixes.

### Commit convention

Commit freely at logical checkpoints, using `<emoji> <type>(<scope>?): <subject>`
(commitlint-enforced where adopted). Push or open a PR only when asked. Never commit directly to
main in multi-branch repos — branch first.

Commit types: `✨ feat`, `🐛 fix`, `📝 docs`, `💄 style`, `♻️ refactor`, `⚡ perf`, `✅ test`,
`🔧 chore`, `🏗️ build`, `👷 ci`, `🔒 security`.
