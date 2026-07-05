import { createLogger } from '@temp-repo/logger'
import { realtimeEnvConfig } from '@temp-repo/realtime-config'
import { Elysia } from 'elysia'
import { chatRoutes } from './routes/chat'
import { todosRoutes } from './routes/todos'

const logger = createLogger('realtime-api')
const allowedOrigins = realtimeEnvConfig.app.cors

/**
 * The transactional HTTP surface of the realtime server. `export type App` is
 * what the studio frontend's Eden Treaty client is typed against. The WebSocket
 * room route is composed in `apps/realtime`.
 *
 * CORS is hand-rolled (cross-origin studio -> realtime with Bearer + credentials)
 * because `@elysiajs/cors` has no Elysia 2 build yet.
 */
export const app = new Elysia()
  .request(({ set, request }) => {
    const origin = request.headers.get('origin')
    if (origin && allowedOrigins.includes(origin)) {
      set.headers['access-control-allow-origin'] = origin
      set.headers['access-control-allow-credentials'] = 'true'
      set.headers['access-control-allow-methods'] = 'GET, POST, PATCH, DELETE, OPTIONS'
      set.headers['access-control-allow-headers'] = 'content-type, authorization'
    }
  })
  .options('/*', ({ set }) => {
    set.status = 204
    return ''
  })
  .error(({ path, error }) => {
    logger.error(
      { path, err: error instanceof Error ? error.message : String(error) },
      'realtime error',
    )
  })
  .get('/health', () => ({ status: 'ok' }))
  .use(todosRoutes)
  .use(chatRoutes)

export type App = typeof app
