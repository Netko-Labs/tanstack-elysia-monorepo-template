import { createLogger } from '@temp-repo/logger'
import { realtimeEnvConfig } from '@temp-repo/realtime-config'
import { Elysia } from 'elysia'
import { chatRoutes } from './routes/chat'
import { roomRoutes } from './routes/room'
import { todosRoutes } from './routes/todos'

const logger = createLogger('realtime-api')
const allowedOrigins = realtimeEnvConfig.app.cors

/**
 * The realtime server's full surface: transactional HTTP routes **and** the
 * WebSocket room. `export type App` is what the studio frontend's Eden Treaty
 * client is typed against. The app entry (`apps/realtime`) just `.listen()`s it.
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
  // (づ｡◕‿‿◕｡)づ CORS preflight — wave the browser through
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
  // ٩(◕‿◕)۶ health check — is realtime alive?
  .get('/health', () => ({ status: 'ok' }))
  // (｡◕‿◕｡) /todos — CRUD over HTTP
  .use(todosRoutes)
  // (◍•ᴗ•◍) /chat — history over HTTP
  .use(chatRoutes)
  // (づ￣ ³￣)づ /room/:id — presence + live chat over WS
  .use(roomRoutes)

export type App = typeof app
