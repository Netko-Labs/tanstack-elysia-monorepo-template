import { treaty } from '@elysiajs/eden'
import type { App as RealtimeApp } from '@temp-repo/realtime-api'

function getRealtimeUrl(): string {
  return import.meta.env.VITE_REALTIME_URL ?? 'http://localhost:3001'
}

/** Fetch a fresh JWT for the current session (studio mints it via the jwt plugin). */
export async function getRealtimeToken(): Promise<string | null> {
  try {
    const res = await fetch('/api/auth/token', { credentials: 'include' })
    if (!res.ok) return null
    const { token } = (await res.json()) as { token?: string }
    return token ?? null
  } catch {
    return null
  }
}

/**
 * Eden Treaty client for the realtime server's transactional HTTP API. A fresh
 * Bearer JWT is attached to every request (when signed in); public reads work
 * without one.
 */
export const realtime = treaty<RealtimeApp>(getRealtimeUrl(), {
  headers: async () => {
    const token = await getRealtimeToken()
    return token ? { authorization: `Bearer ${token}` } : {}
  },
})

/**
 * Open a native WebSocket to a room. Auth rides the `?token=` query param, and
 * a unique `?cid=` identifies this connection server-side (Elysia 2's `ws.id`
 * is unreliable, so the client supplies a stable per-connection id).
 */
export async function connectRoom(roomId: string): Promise<WebSocket | null> {
  const token = await getRealtimeToken()
  if (!token) return null
  const wsUrl = getRealtimeUrl().replace(/^http/, 'ws')
  const cid = crypto.randomUUID()
  return new WebSocket(
    `${wsUrl}/room/${encodeURIComponent(roomId)}?token=${encodeURIComponent(token)}&cid=${cid}`,
  )
}
