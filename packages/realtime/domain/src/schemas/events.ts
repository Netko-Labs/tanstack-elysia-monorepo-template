import { z } from 'zod'
import { ChatMessageSchema } from '../entities/chat'

export const MemberSchema = z.object({
  userId: z.string(),
  name: z.string(),
  status: z.enum(['active', 'idle']),
})
export type Member = z.infer<typeof MemberSchema>

/** client → server messages (validated by the `.ws` body schema) */
export const ClientMessageSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('chat'), content: z.string().min(1).max(2000) }),
  z.object({ type: z.literal('presence'), status: z.enum(['active', 'idle']) }),
])
export type ClientMessage = z.infer<typeof ClientMessageSchema>

/** server → client events (validated by the `.ws` response schema; Eden reads this type) */
export const ServerEventSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('history'), messages: z.array(ChatMessageSchema) }),
  z.object({ type: z.literal('presence'), members: z.array(MemberSchema) }),
  z.object({ type: z.literal('join'), member: MemberSchema }),
  z.object({ type: z.literal('leave'), userId: z.string() }),
  z.object({ type: z.literal('chat'), message: ChatMessageSchema }),
])
export type ServerEvent = z.infer<typeof ServerEventSchema>
