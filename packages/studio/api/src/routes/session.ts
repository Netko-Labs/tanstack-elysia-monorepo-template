import { Elysia } from 'elysia'
import { authPlugin } from '../setup'

export const sessionRoutes = new Elysia({ name: 'session' })
  .use(authPlugin)
  // (◕ᴗ◕✿) who am i? — the current signed-in user
  .get('/me', { auth: true }, ({ user }) => user)
