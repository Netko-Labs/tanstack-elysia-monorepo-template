import { z } from 'zod'
import { SessionAuthSchema, UserAuthSchema } from './auth'

export const ContextSchema = z.object({
  user: UserAuthSchema.nullable(),
  session: SessionAuthSchema.nullable(),
})

export type Context = z.infer<typeof ContextSchema>

// Authenticated context with non-null user
export const AuthenticatedContextSchema = z.object({
  user: UserAuthSchema,
  session: SessionAuthSchema,
})

export type AuthenticatedContext = z.infer<typeof AuthenticatedContextSchema>
