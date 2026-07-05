import { createLogger } from '@temp-repo/logger'
import { Elysia } from 'elysia'
import { sessionRoutes } from './routes/session'

const logger = createLogger('api')

/**
 * The studio API is now auth-only: better-auth is mounted separately at
 * `/api/auth`; this app exposes a same-origin session check. All transactional
 * data (todos, chat) lives on the realtime server.
 */
export const app = new Elysia({ prefix: '/api' })
  .error(({ path, error }) => {
    logger.error({ path, err: error instanceof Error ? error.message : String(error) }, 'API error')
  })
  .get('/health', () => ({ status: 'ok' }))
  .use(sessionRoutes)

export type App = typeof app
