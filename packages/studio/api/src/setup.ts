import { auth } from '@temp-repo/studio-service'
import { Elysia } from 'elysia'

/**
 * Reusable auth macro. Routes opt in with `{ auth: true }` and receive a
 * typed, non-null `user` + `session` in context; unauthenticated requests are
 * rejected with 401 (better-auth reads the session from the request headers).
 */
export const authPlugin = new Elysia({ name: 'auth-macro' }).macro({
  auth: {
    async derive({ request, status }) {
      const authResponse = await auth.api.getSession({ headers: request.headers })
      if (!authResponse?.session || !authResponse?.user) {
        return status(401, 'Unauthorized')
      }
      return { user: authResponse.user, session: authResponse.session }
    },
  },
})
