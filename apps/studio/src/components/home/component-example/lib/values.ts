import type { FeatureCardProps } from './types'

export const PAGE_TITLE = 'Studio Demo'
export const PAGE_DESCRIPTION =
  'A modern full-stack monorepo template with TanStack Start, Elysia, Eden Treaty, Better Auth, and real-time SSE streams.'

export const AUTH_SECTION_TITLE = 'Authentication'
export const INTERACTIVE_SECTION_TITLE = 'Interactive Examples'
export const TECH_STACK_SECTION_TITLE = 'Tech Stack'
export const CODE_EXAMPLES_SECTION_TITLE = 'Code Examples'
export const UI_SECTION_TITLE = 'UI Components'
export const FOOTER_TEXT =
  'Built with TanStack Start, Elysia, Eden Treaty, Better Auth, Drizzle ORM, and Tailwind CSS'

export const FEATURE_CARDS: FeatureCardProps[] = [
  {
    title: 'Todos Example',
    description:
      'CRUD operations with real-time SSE updates. Create, update, and delete todos with instant synchronization.',
    href: '/todos',
    badge: 'SSE',
  },
  {
    title: 'Chat Example',
    description:
      'Real-time global chat using Elysia SSE streams. Requires authentication to send messages.',
    href: '/chat',
    badge: 'Auth Required',
  },
]

export const TECH_STACK_ITEMS = [
  {
    title: 'TanStack Start',
    description: 'Full-stack React framework',
    body: 'File-based routing, SSR, API routes, and middleware out of the box.',
  },
  {
    title: 'Elysia + Eden',
    description: 'End-to-end typesafe APIs',
    body: 'A Bun-first server with Eden Treaty for a fully typed client — queries, mutations, and SSE streams.',
  },
  {
    title: 'Better Auth',
    description: 'Modern authentication',
    body: 'Email/password, OAuth providers, passkeys, and magic links.',
  },
]

export const CODE_EXAMPLE_API = `
// packages/studio/api/src/routes/chat.ts
import { chatEvents, createChatMessage } from '@temp-repo/studio-service'
import { Elysia } from 'elysia'
import { z } from 'zod'
import { authPlugin } from '../setup'

export const chatRoutes = new Elysia({ prefix: '/chat' })
  .use(authPlugin)
  .post(
    '/messages',
    async ({ body, user }) => {
      const message = await createChatMessage({
        content: body.content,
        authorId: user.id,
        authorName: user.name,
      })
      if (message) chatEvents.emitMessage(message)
      return message
    },
    { auth: true, body: z.object({ content: z.string().min(1).max(2000) }) },
  )
`

export const CODE_EXAMPLE_QUERY = `
// Using Eden Treaty with TanStack Query
import { useQuery, useMutation } from '@tanstack/react-query'
import { eden } from '@/integrations/eden'

function TodosComponent() {
  const { data: todos } = useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const { data, error } = await eden.api.todos.get()
      if (error) throw error
      return data
    },
  })

  const createMutation = useMutation({
    mutationFn: async (input) => {
      const { data, error } = await eden.api.todos.post(input)
      if (error) throw error
      return data
    },
  })
}
`

export const CODE_EXAMPLE_SUBSCRIPTION = `
// Real-time updates via an Elysia SSE stream (Eden async iterable)
import { eden } from '@/integrations/eden'

useEffect(() => {
  const controller = new AbortController()

  ;(async () => {
    const { data, error } = await eden.api.chat.stream.get({
      fetch: { signal: controller.signal },
    })
    if (error) return

    for await (const event of data) {
      if (event.type === 'init') setMessages(event.messages)
      else if (event.type === 'message') {
        setMessages((prev) => [...prev, event.message])
      }
    }
  })()

  return () => controller.abort()
}, [])
`
