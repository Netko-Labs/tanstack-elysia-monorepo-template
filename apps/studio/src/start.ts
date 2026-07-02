import { createMiddleware, createStart } from '@tanstack/react-start'
import { logger } from '@temp-repo/logger'

/**
 * ✧･ﾟ: *✧･ﾟ:* REQUEST LOGGER MIDDLEWARE *:･ﾟ✧*:･ﾟ✧
 *
 * Logs all incoming requests and outgoing responses with kawaii energy!
 * Because even server logs deserve to be cute (◕‿◕✿)
 *
 * Note: API routes (/api) are excluded as they have their own logging middleware
 */
const requestLoggerMiddleware = createMiddleware().server(async ({ next, request }) => {
  const url = new URL(request.url)
  const path = url.pathname

  // Skip logging for API routes - they have their own logging middleware
  if (path.startsWith('/api')) {
    return next()
  }

  const startTime = Date.now()
  const { method } = request

  // Log incoming request with sparkle ✨
  logger.info({ method, path, query: url.search || undefined }, '→ incoming')

  try {
    const nextResponse = await next()
    const duration = Date.now() - startTime
    const status = nextResponse.response.status

    // Log successful response ヨシ!
    logger.info({ method, path, status, duration }, '← completed')

    return nextResponse
  } catch (error) {
    const duration = Date.now() - startTime

    // Log error with appropriate drama ダメ!
    logger.error(
      {
        method,
        path,
        duration,
        err: error instanceof Error ? error.message : String(error),
      },
      '✗ failed',
    )

    throw error
  }
})

/**
 * TanStack Start instance with global middleware
 * All requests flow through our kawaii logger! ψ(｀∇´)ψ
 */
export const startInstance = createStart(() => ({
  requestMiddleware: [requestLoggerMiddleware],
}))
