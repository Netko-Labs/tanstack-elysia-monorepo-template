import { z } from 'zod'

/**
 * WebSocket room handshake query: the studio JWT (auth) plus a client-generated
 * connection id (Elysia 2's `ws.id` is unreliable, so the client supplies it).
 */
export const RoomConnectionQuerySchema = z.object({
  token: z.string(),
  cid: z.string(),
})

export type RoomConnectionQuery = z.infer<typeof RoomConnectionQuerySchema>
