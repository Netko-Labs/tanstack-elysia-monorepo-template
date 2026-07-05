import { verifyToken } from '@temp-repo/realtime-service'
import { Elysia } from 'elysia'

/**
 * HTTP auth macro: routes opt in with `{ auth: true }` and receive a non-null
 * `user` resolved from the `Authorization: Bearer <jwt>` header (verified via
 * the studio JWKS). Unauthenticated requests get 401.
 */
export const authPlugin = new Elysia({ name: 'auth' }).macro({
  auth: {
    async derive({ headers, status }) {
      const token = headers.authorization?.replace(/^Bearer /, '')
      const user = token ? await verifyToken(token) : null
      if (!user) return status(401, 'Unauthorized')
      return { user }
    },
  },
})
