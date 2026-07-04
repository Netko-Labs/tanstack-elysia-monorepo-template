import { cors } from '@elysiajs/cors'
import { createLogger } from '@temp-repo/logger'
import { realtimeEnvConfig } from '@temp-repo/realtime-config'
import { Elysia } from 'elysia'
import { chatRoutes } from './routes/chat'
import { todosRoutes } from './routes/todos'

const logger = createLogger('realtime-api')

/**
 * The transactional HTTP surface of the realtime server. `export type App` is
 * what the studio frontend's Eden Treaty client is typed against. The WebSocket
 * room route is composed in `apps/realtime` (kept out of this package so the
 * exported type stays simple for cross-package consumers).
 */
export const app = new Elysia()
  .use(cors({ origin: realtimeEnvConfig.app.cors, credentials: true }))
  .onError(({ code, path, error }) => {
    logger.error(
      { code, path, err: error instanceof Error ? error.message : String(error) },
      `realtime error: ${code}`,
    )
  })
  .get('/health', () => ({ status: 'ok' }))
  .use(todosRoutes)
  .use(chatRoutes)

export type App = typeof app
