import { treaty } from '@elysiajs/eden'
import type { App } from '@temp-repo/studio-api'

function getBaseUrl() {
  if (typeof window !== 'undefined') return window.location.origin
  return process.env.BASE_URL ?? `http://localhost:${process.env.PORT ?? 3000}`
}

/**
 * Eden Treaty — end-to-end typed client for the Elysia API.
 *
 * The API is mounted at `/api` on this same server, so calls are same-origin.
 * Every call returns `{ data, error }` (it never throws on non-2xx).
 */
export const eden = treaty<App>(getBaseUrl(), {
  fetch: { credentials: 'include' },
})
