import { on } from 'node:events'
import type { ChatMessage } from '@temp-repo/studio-domain'
import { chatEvents, createChatMessage, getChatMessages } from '@temp-repo/studio-service'
import { Elysia } from 'elysia'
import { z } from 'zod'
import { authPlugin } from '../setup'

export const chatRoutes = new Elysia({ name: 'chat', prefix: '/chat' })
  .use(authPlugin)
  .get('/messages', () => getChatMessages())
  .post(
    '/messages',
    async ({ body, user }) => {
      const message = await createChatMessage({
        content: body.content,
        authorId: user.id,
        authorName: user.name,
      })
      if (message) {
        chatEvents.emitMessage(message)
      }
      return message
    },
    { auth: true, body: z.object({ content: z.string().min(1).max(2000) }) },
  )
  // SSE stream: initial history, then each new message fanned out via node:events.
  .get('/stream', async function* ({ request }) {
    yield { type: 'init' as const, messages: await getChatMessages() }
    const iterator = on(chatEvents, 'message', {
      signal: request.signal,
    }) as AsyncIterableIterator<[ChatMessage]>
    try {
      for await (const [message] of iterator) {
        yield { type: 'message' as const, message }
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') throw error
    }
  })
