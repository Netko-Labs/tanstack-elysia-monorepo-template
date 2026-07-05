import { Elysia } from 'elysia'
import { authPlugin } from '../setup'

export const sessionRoutes = new Elysia({ name: 'session' })
  .use(authPlugin)
  .get('/me', { auth: true }, ({ user }) => user)
