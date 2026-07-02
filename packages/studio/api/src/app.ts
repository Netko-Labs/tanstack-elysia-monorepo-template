import { createLogger } from '@temp-repo/logger'
import { Elysia } from 'elysia'
import { chatRoutes } from './routes/chat'
import { sessionRoutes } from './routes/session'
import { todosRoutes } from './routes/todos'

const logger = createLogger('api')

/**
 * The Elysia application. Mounted at `/api` inside the TanStack Start server
 * via `app.handle(request)`. `export type App` is consumed by Eden Treaty.
 */
export const app = new Elysia({ prefix: '/api' })
  .onError(({ code, path, error }) => {
    logger.error(
      { code, path, err: error instanceof Error ? error.message : String(error) },
      `API error: ${code}`,
    )
  })
  .use(sessionRoutes)
  .use(chatRoutes)
  .use(todosRoutes)

export type App = typeof app
