# TanStack + Elysia Monorepo Template

A modern, type-safe full-stack **two-app** template on **Elysia 2** + Bun: a TanStack Start frontend + auth server (`studio`) and a headless Elysia **WebSocket** server (`realtime`), wired with Eden Treaty, Drizzle ORM, TanStack Query, and cross-service JWT auth.

## 🚀 Features

- 🏛️ **Two-app architecture** - `studio` (TanStack Start frontend + auth) and `realtime` (headless Elysia WebSocket server)
- 🦊 **Elysia 2 + Eden Treaty** - End-to-end type-safe APIs (Bun-first server, typed client)
- 🔌 **WebSocket real-time** - presence + live chat room on the standalone realtime server
- 🔑 **Magic-link auth** - better-auth magic link + a `/sign-in` page (Resend email, console fallback)
- 🔐 **Cross-service JWT** - studio mints JWTs; realtime verifies via JWKS (no shared secret)
- 📊 **TanStack Query** + 🗃️ **Drizzle ORM** - typed data fetching + `drizzle-zod` schemas; two databases
- 📦 **Turborepo** + ⚙️ **Bun** - fast monorepo tooling and runtime
- 🎯 **TypeScript** - Full type safety across the stack (the whole repo checks under `tsgo`)

## 📦 What's Included

### Working examples

- ✅ **Todos** — CRUD against the realtime server over HTTP (Eden Treaty + TanStack Query), Bearer-JWT authorized
- ✅ **Presence + live chat** — a WebSocket room: who's-online presence (join/leave) + live messages
- ✅ **Magic-link sign-in** — email → link → session → JWT, on a dedicated `/sign-in` page
- ✅ **drizzle-zod** — Zod schemas generated from Drizzle tables
- ✅ **Clean architecture** — `domain → repository → service → api` per app, with cross-service JWT/JWKS

## 🏗️ Project Structure

```
.
├── apps/
│   ├── studio/                     # TanStack Start frontend + auth (:3000)
│   │   └── src/
│   │       ├── components/         # feature modules (lib/, barrels)
│   │       ├── integrations/
│   │       │   ├── tanstack-query/
│   │       │   ├── auth/           # better-auth client (magic link)
│   │       │   └── realtime/       # Eden HTTP + native WebSocket to :3001
│   │       └── routes/             # file-based routes (incl. /sign-in)
│   └── realtime/                   # headless Elysia server (:3001)
│       └── src/index.ts            # imports the api app, `app.listen()`
│
├── packages/
│   ├── studio/                     # auth only
│   │   ├── domain/                 # better-auth tables + entities (DB #1)
│   │   ├── repository/             # studio DB client
│   │   ├── service/                # auth + email (magic link) + JWT helpers
│   │   └── api/                    # Elysia app: same-origin session check
│   ├── realtime/                   # all transactional + realtime logic
│   │   ├── domain/                 # todo + chat_message tables, WS event schemas (DB #2)
│   │   ├── repository/             # realtime DB client
│   │   ├── service/                # queries/mutations + RoomHub + JWKS verifyToken
│   │   └── api/                    # the whole Elysia app
│   │       ├── routes/             # todos.ts, chat.ts, room.ts (the .ws() room)
│   │       ├── setup.ts            # Bearer-JWT auth macro
│   │       └── app.ts              # composed app + CORS + exported App type
│   ├── configs/                    # studio-config, realtime-config (env schemas)
│   └── shared/                     # cli, logger, ui, typescript-config
```

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh/) (v1.2+)
- Docker (for the two PostgreSQL databases)

### Install + environment

```bash
bun install

# Two apps, two env files
cp apps/studio/sample.env apps/studio/.env
cp apps/realtime/sample.env apps/realtime/.env
# Edit as needed (DB URLs, WEB_BASE_URL, CORS, optional RESEND_API_KEY)
```

### Databases (two — studio auth, realtime data)

```bash
bun run repo docker:up --app studio      # db-studio  (:5432)
bun run repo docker:up --app realtime    # db-realtime (:5434)

bun run repo db:migrate --app studio
bun run repo db:migrate --app realtime
```

### Run both servers

```bash
bun run repo dev --app studio     # http://localhost:3000  (frontend + auth)
bun run repo dev --app realtime   # http://localhost:3001  (HTTP + WebSocket)
```

Sign in at **http://localhost:3000/sign-in** — the magic link is logged to the studio console in dev (or emailed via Resend when `RESEND_API_KEY` is set). Once signed in, the todos list and the live chat room talk to the realtime server.

## 📖 Architecture

### Two apps, two databases, cross-service JWT

- **studio** (`:3000`) — TanStack Start frontend + better-auth (magic link + `jwt`/`jwks`) mounted at `/api/auth`. Owns the **auth** database only.
- **realtime** (`:3001`) — a **standalone** Elysia server started with `.listen()` (so native WebSocket upgrades work). Owns all transactional operations (todos, chat) over HTTP **and** the presence/live-chat room over WebSocket, plus its own **business** database.
- **Auth** — studio mints a JWT (`GET /api/auth/token`); realtime verifies it against studio's JWKS (`GET /api/auth/jwks`) with `jose` — **no shared secret**. HTTP calls send `Authorization: Bearer <jwt>`; the WebSocket passes the token via `?token=` (browsers can't set WS headers).

```
studio (:3000)                          realtime (:3001, headless Bun/Elysia)
  TanStack Start frontend                 new Elysia().listen(3001)
  + better-auth at /api/auth                HTTP: /todos, /chat  (Bearer JWT)
    - /api/auth/token  (mint JWT)           WS:   /room/:id      (?token= + ?cid=)
    - /api/auth/jwks   (verify keys)         └ verifies studio JWT via jose + JWKS
  DB #1: auth tables                      DB #2: todo, chat_message (+ in-memory RoomHub)
```

**Data flow:** auth → studio same-origin `/api/auth`; transactional (todos/chat) → realtime HTTP (Bearer); real-time (presence/chat) → realtime WebSocket.

### Frontend component organization

React components in `apps/studio` follow a consistent structure (see `CLAUDE.md` for full agent rules):

**Module anatomy** — each feature is a module: the public `.tsx` (and nested sub-components) at the root, internals under `lib/`, and an `index.ts` barrel as the module's only public entry:

```
components/todos/todos-example/
  todos-example.tsx             # public component
  todo-list/                    # nested sub-components get their own folders
  lib/
    hooks/
      use-todos-example.ts      # hooks ALWAYS live in a hooks/ subfolder
    types.ts                    # props, hook types, local unions
    values.ts                   # labels, empty-state copy (optional)
    constants.ts                # limits, keys — UPPER_SNAKE_CASE (optional)
    utils.ts                    # pure helpers for this feature (optional)
    index.ts                    # re-exports the lib surface
  index.ts                      # module barrel: export { TodosExample }
```

Import a module through its barrel (`@/components/todos/todos-example`), never its inner files. `lib/` is private to its module.

**Progressive disclosure** — `utils`/`types`/`constants`/`values` start as a single flat file and graduate to a folder (`utils/`) only when the category has many entries or a file exceeds 300 lines. Only `hooks/` is always a subfolder.

**Scope ladder** (narrowest → widest):
- module-internal → the module's `lib/`
- cross-feature reuse within the app → a `shared/` module (`components/shared/*` for UI, `src/shared/*` for logic like `@/shared/dom-events`)
- app-root shells and providers → `components/core/*`
- cross-app primitives → `packages/shared/*`

**Budgets:** `.tsx`/colocated `.ts` ≤ **300 lines**; ≤ **3** hooks per component file (extract `lib/hooks/use-*.ts` when exceeded); route files are thin `Route` exports only.

The full, portable rules live in `@docs/conventions.md`.

### Backend layering (`domain → repository → service → api`)

**Domain** (`packages/realtime/domain`) — Drizzle tables + `drizzle-zod` entities. Identity comes from the JWT, so business tables carry no cross-database FK to the auth `user`:

```typescript
export const todoTable = pgTable('todo', {
  id: uuid('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text('title').notNull(),
  description: text('description'),
  completed: boolean('completed').default(false).notNull(),
  createdAt: timestamp('created_at').$defaultFn(() => new Date()).notNull(),
  updatedAt: timestamp('updated_at').$defaultFn(() => new Date()).$onUpdate(() => new Date()).notNull(),
})

export const TodoInsertSchema = createInsertSchema(todoTable) // drizzle-zod
export type Todo = z.infer<typeof createSelectSchema(todoTable)>
```

**Service** (`packages/realtime/service`) — business logic, folder-per-entity, plus the in-memory `RoomHub` and JWKS `verifyToken`:

```typescript
// mutations/todos/create-todo.ts
export const createTodo = async (data: TodoInsert): Promise<Todo | undefined> =>
  db.insert(todoTable).values(data).returning().then(([r]) => r)
```

### API layer (`packages/realtime/api`) — Elysia 2

**All** routes live here — HTTP **and** the WebSocket room — composed into the single exported `app`; the app entry (`apps/realtime`) just `.listen()`s it:

```typescript
export const app = new Elysia()
  .request(/* hand-rolled CORS: @elysiajs/cors has no Elysia 2 build yet */)
  .options('/*', ({ set }) => { set.status = 204; return '' })   // preflight
  .get('/health', () => ({ status: 'ok' }))
  .use(todosRoutes)   // HTTP
  .use(chatRoutes)    // HTTP
  .use(roomRoutes)    // WebSocket .ws('/room/:id')

export type App = typeof app
```

**HTTP routes** — validators accept `drizzle-zod`/zod schemas directly (Standard Schema); protected routes opt into the Bearer-JWT macro:

```typescript
export const todosRoutes = new Elysia({ name: 'todos', prefix: '/todos' })
  .use(authPlugin)
  .get('/', () => getTodos())
  .post('/', { auth: true, body: TodoInsertSchema }, ({ body }) => createTodo(body))

// setup.ts — Elysia 2 renamed the macro hook `resolve` -> `derive`
export const authPlugin = new Elysia({ name: 'auth' }).macro({
  auth: {
    async derive({ headers, status }) {
      const user = await verifyToken(headers.authorization?.replace(/^Bearer /, ''))
      if (!user) return status(401, 'Unauthorized')
      return { user }
    },
  },
})
```

**WebSocket room** (`routes/room.ts`) — presence + live chat, gated on the same JWT:

```typescript
export const roomRoutes = new Elysia().ws('/room/:id', {
  query: t.Object({ token: t.String(), cid: t.String() }), // schema => ws.query is populated
  body: ClientMessageSchema,
  async open(ws) {
    const user = await verifyToken(ws.query.token)
    if (!user) return ws.close(1008, 'Unauthorized')
    ws.send(JSON.stringify({ type: 'history', messages: await getChatMessages() }))
    const members = hub.join(ws.params.id, ws.query.cid, ws, /* member */)
    ws.send(JSON.stringify({ type: 'presence', members }))
    hub.broadcast(ws.params.id, { type: 'join', member }, ws.query.cid)
  },
  async message(ws, message) { /* persist chat + broadcast, or update presence */ },
  close(ws) { /* leave + broadcast */ },
})
```

### Frontend integration (`apps/studio/src/integrations`)

- **`realtime/`** — an Eden Treaty client (`treaty<RealtimeApp>()`) for the todos/chat HTTP API (a fresh Bearer JWT is attached per request), plus `connectRoom(roomId)` which opens a **native WebSocket** to `ws://…/room/:id?token=…&cid=…`. Room events are typed by `packages/realtime/domain` schemas and `JSON.parse`d.
- **`auth/`** — the better-auth client (magic link).
- **`tanstack-query/`** — the Query provider; Eden calls are wrapped in `useQuery`/`useMutation`.

```typescript
const { data: todos } = useQuery({
  queryKey: ['todos'],
  queryFn: async () => {
    const { data, error } = await realtime.todos.get()   // Eden Treaty, Bearer JWT
    if (error) throw error
    return data
  },
})
```

## 🔧 Key Patterns

1. **drizzle-zod for schemas** — `createInsertSchema()` / `createUpdateSchema()` / `createSelectSchema()` generate Zod from Drizzle tables, reused directly as Elysia validators.
2. **Folder-per-entity service** — `service/src/{queries,mutations}/{entity}/{op}.ts` + `index.ts`.
3. **Composed Elysia routes** — per-concern route modules merged with `.use()` into one exported `App` type.
4. **Eden Treaty (HTTP) + native WebSocket (room)** — HTTP transactional calls via `treaty<App>()`; the real-time room via a native socket (the token rides `?token=`, a unique `?cid=` identifies the connection).

## ⚡ Elysia 2 notes

Pinned to `elysia@2.0.0-exp.25` (experimental — expect changes). Because of it, the whole repo (including the `.ws()` app) type-checks under **tsgo** — no `tsc` fallback. Specifics worth knowing:

- `@elysiajs/cors` has no Elysia 2 build → CORS is hand-rolled in `realtime/api/src/app.ts`.
- A `.ws()` route only populates `ws.query`/the message when a **schema is declared**.
- `ws.id` is empty and the `ws` object isn't stable across handlers → the client sends a unique **`?cid=`** and `RoomHub` keys on it; `ws.send` takes a **string** (events are JSON).
- `@elysiajs/eden@1.4` is forward-compatible with Elysia 2 (no 2.x build yet).

Re-pin these when Elysia 2 and its plugins reach a stable release.

## 🚧 Production Notes

The `RoomHub` is **in-memory** (single instance). To scale the realtime server horizontally, back presence and fan-out with **Redis pub/sub** (or Postgres `LISTEN/NOTIFY`) so broadcasts reach clients across instances. Magic-link email uses Resend when `RESEND_API_KEY` is set (console fallback in dev).

## 📝 License

MIT License

Made by Netko Labs with love
