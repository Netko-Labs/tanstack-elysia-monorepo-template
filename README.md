# TanStack + Elysia Monorepo Template

A modern, type-safe full-stack **two-app** template: a TanStack Start frontend + auth server (`studio`) and a headless Elysia **WebSocket** server (`realtime`), wired with Eden Treaty, Drizzle ORM, TanStack Query, cross-service JWT auth, and Bun.

## 🚀 Features

- 🏛️ **Two-app architecture** - `studio` (TanStack Start frontend + auth) and `realtime` (headless Elysia WebSocket server), openhotel-shaped
- 🦊 **Elysia + Eden Treaty** - End-to-end type-safe APIs (Bun-first server, typed client)
- 🔌 **WebSocket real-time** - presence + live chat room on the standalone realtime server
- 🔑 **Magic-link auth** - better-auth magic link + a `/sign-in` page (Resend email, console fallback)
- 🔐 **Cross-service JWT** - studio mints JWTs; realtime verifies via JWKS (no shared secret)
- 📊 **TanStack Query** + 🗃️ **Drizzle ORM** - typed data fetching + `drizzle-zod` schemas; two databases
- 📦 **Turborepo** + ⚙️ **Bun** - fast monorepo tooling and runtime
- 🎯 **TypeScript** - Full type safety across the stack

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
│   └── studio/                 # TanStack Start application
│       └── src/
│           ├── components/     # React components (feature folders + definitions/)
│           ├── integrations/   # TanStack Query + Eden Treaty setup
│           │   ├── tanstack-query/
│           │   └── eden/
│           └── routes/         # File-based routing (thin Route exports)
│
├── packages/
│   ├── studio/
│   │   ├── domain/             # Domain layer
│   │   │   ├── db/             # Drizzle schemas
│   │   │   └── entities/       # drizzle-zod generated schemas
│   │   ├── repository/         # Database layer
│   │   ├── service/            # Business logic
│   │   │   ├── queries/        # Query functions (folder per entity)
│   │   │   └── mutations/      # Mutation functions (folder per entity)
│   │   └── api/                # Elysia app (HTTP + SSE)
│   │       ├── routes/         # todos.ts, chat.ts, session.ts
│   │       ├── setup.ts        # auth macro / shared plugins
│   │       └── app.ts          # Elysia app + exported App type
│   └── shared/
│       └── ui/                 # Shared UI primitives (shadcn-style)
```

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh/) (v1.0+)
- PostgreSQL database

### Installation

```bash
# Install dependencies
bun install

# Set up environment variables
cp apps/studio/sample.env apps/studio/.env
cp packages/studio/domain/sample.env packages/studio/domain/.env

# Edit .env files with your database URL and other settings
```

### Database Setup

```bash
# Generate and apply migrations
cd packages/studio/repository
bunx drizzle-kit push
```

### Development

```bash
# Start development server
bun run repo dev --app studio
# or: bun run dev

# Server will start at http://localhost:3000
# Visit http://localhost:3000/todos to see the example
```

## 📖 Architecture Patterns

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

**Hierarchy** — shallow feature trees, not flat large files: feature → section → element.

```
components/todos/
  todos-example/
  todo-list/
    todo-item/
shared/                         # cross-feature UI within the app
core/                           # app-wide shells and providers
```

**Budgets:**
- `.tsx` and colocated `.ts` files: **≤ 300 lines**
- Hooks per component file: **≤ 3** (extract `lib/hooks/use-*.ts` when exceeded)
- Route files: thin `Route` export only; UI lives under `components/`

**Layer boundaries:**
- UI-only types/constants/values → the module's `lib/` (private to the module)
- Pure helpers → the module's `lib/utils.ts`, or an app `src/shared/*` logic module when reused across features
- Entities, schemas, validation → `packages/studio/domain`

The full, portable rules live in `@docs/conventions.md`.

### Domain Layer (`packages/studio/domain`)

**Database Schema** (`src/db/todos.ts`):
```typescript
export const todoTable = pgTable('todo', {
  id: uuid('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text('title').notNull(),
  description: text('description'),
  completed: boolean('completed').default(false).notNull(),
  createdBy: text('created_by').notNull().references(() => user.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').$defaultFn(() => new Date()).notNull(),
  updatedAt: timestamp('updated_at').$defaultFn(() => new Date()).$onUpdate(() => new Date()).notNull(),
})
```

**Entity Schemas** (`src/entities/todos.ts`) - Using `drizzle-zod`:
```typescript
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'

export const TodoInsertSchema = createInsertSchema(todoTable)
export type TodoInsert = z.infer<typeof TodoInsertSchema>

export const TodoUpdateSchema = createUpdateSchema(todoTable).required({ id: true })
export type TodoUpdate = z.infer<typeof TodoUpdateSchema>

export const TodoSchema = createSelectSchema(todoTable)
export type Todo = z.infer<typeof TodoSchema>
```

### Service Layer (`packages/studio/service`)

**Queries** (`src/queries/todos/get-todo.ts`):
```typescript
export const getTodo = async (
  todoId: string,
  ctx?: AuthenticatedContext,
): Promise<Todo | undefined> => {
  const where = ctx
    ? and(eq(todoTable.id, todoId), eq(todoTable.createdBy, ctx.user.id))
    : eq(todoTable.id, todoId)

  return await db.select().from(todoTable).where(where).then(([result]) => result)
}
```

**Mutations** (`src/mutations/todos/create-todo.ts`):
```typescript
export const createTodo = async (data: TodoInsert): Promise<Todo | undefined> => {
  return await db.insert(todoTable).values(data).returning().then(([result]) => result)
}
```

### API Layer (`packages/studio/api`) — Elysia

Routes are plain Elysia modules. Validators accept `drizzle-zod` schemas directly (Standard Schema), and async-generator routes stream over SSE.

**Routes** (`src/routes/todos.ts`):
```typescript
import { TodoInsertSchema } from '@temp-repo/studio-domain'
import { createTodo, getTodos, updateTodo } from '@temp-repo/studio-service'
import { Elysia } from 'elysia'

export const todosRoutes = new Elysia({ name: 'todos', prefix: '/todos' })
  .get('/', () => getTodos())
  .post('/', ({ body }) => createTodo(body), { body: TodoInsertSchema })
  .patch('/:todoId', ({ params, body }) => updateTodo(params.todoId, body), { body: TodoPatchSchema })
  // SSE stream — Eden consumes this as an async iterable
  .get('/stream', async function* ({ request }) {
    yield { type: 'sync', todos: await getTodos(), timestamp: Date.now() }
    while (!request.signal.aborted) {
      await new Promise((resolve) => setTimeout(resolve, 3000))
      yield { type: 'update', todos: await getTodos(), timestamp: Date.now() }
    }
  })
```

**Protected routes** use the reusable auth macro (`src/setup.ts`):
```typescript
export const authPlugin = new Elysia({ name: 'auth-macro' }).macro({
  auth: {
    async resolve({ request, status }) {
      const session = await auth.api.getSession({ headers: request.headers })
      if (!session?.user) return status(401, 'Unauthorized')
      return { user: session.user, session: session.session }
    },
  },
})
// then: .use(authPlugin).post('/messages', handler, { auth: true, body: ... })
```

The app is mounted inside the TanStack Start server via `app.handle(request)` at `/api` (`src/routes/api/$.ts`).

### Frontend Integration (`apps/studio/src/integrations`)

**Eden client** (`eden/client.ts`) — a single typed `treaty<App>()` client; every call returns `{ data, error }`.

**Usage in Components** (Eden wrapped in TanStack Query):
```typescript
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { eden } from '@/integrations/eden'

function TodosExample() {
  const queryClient = useQueryClient()

  const { data: todos } = useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const { data, error } = await eden.api.todos.get()
      if (error) throw error
      return data
    },
  })

  const createMutation = useMutation({
    mutationFn: async (input: { title: string }) => {
      const { data, error } = await eden.api.todos.post(input)
      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  })

  // Real-time via the SSE stream (async iterable)
  useEffect(() => {
    const controller = new AbortController()
    ;(async () => {
      const { data, error } = await eden.api.todos.stream.get({ fetch: { signal: controller.signal } })
      if (error) return
      for await (const event of data) {
        queryClient.setQueryData(['todos'], event.todos)
      }
    })()
    return () => controller.abort()
  }, [queryClient])
}
```

## 🔧 Key Patterns

### 1. drizzle-zod for Schema Generation
Instead of manually defining Zod schemas, use `drizzle-zod` to automatically generate them from your Drizzle tables:
- `createInsertSchema()` - For create operations
- `createUpdateSchema()` - For update operations
- `createSelectSchema()` - For reading/selecting data

### 2. Folder-per-Entity in Service Layer
Each entity has its own folder with individual files for each operation:
```
service/src/
├── queries/
│   └── todos/
│       ├── get-todo.ts
│       ├── get-todos.ts
│       └── index.ts
└── mutations/
    └── todos/
        ├── create-todo.ts
        ├── update-todo.ts
        ├── delete-todo.ts
        └── index.ts
```

### 3. Composed Elysia Routes
Per-entity route modules are composed into one app with `.use()`:
```typescript
export const app = new Elysia({ prefix: '/api' })
  .use(sessionRoutes)
  .use(chatRoutes)
  .use(todosRoutes)

export type App = typeof app
```

### 4. Eden Treaty + SSE

- **Queries/mutations**: `eden.api.todos.get()` / `.post(body)` — wrap in TanStack Query
- **Real-time**: `eden.api.todos.stream.get()` returns an async iterable (Elysia SSE). WebSocket is intentionally avoided — it can't upgrade through the mounted `app.handle()`.

## 📦 Dependencies

Key packages added:
- `@tanstack/react-query` - Data fetching and caching
- `elysia` - Bun-first server framework (HTTP + SSE)
- `@elysiajs/eden` - Eden Treaty end-to-end typed client
- `drizzle-zod` - Zod schema generation from Drizzle (reused as Elysia validators)

## 🚧 Production Notes

### Replace SSE Polling with Redis Pub/Sub
For production, replace the polling-based subscription with Redis:
```typescript
// Use Redis Pub/Sub or PostgreSQL LISTEN/NOTIFY
for await (const event of createRedisIterable(channel, signal)) {
  yield event
}
```

## 📝 License

MIT License

Made by Netko Labs with love
