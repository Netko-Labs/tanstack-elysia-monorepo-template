import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ChatMessage } from '@temp-repo/studio-domain'
import { type FormEvent, useEffect, useRef, useState } from 'react'
import { eden } from '@/integrations/eden'
import { scrollIntoView } from '@/shared/dom-events'
import type { ConnectionStatus } from '../types'
import { appendUniqueChatMessage } from '../utils'

const MESSAGES_QUERY_KEY = ['chat', 'messages'] as const
const ME_QUERY_KEY = ['auth', 'me'] as const

export function useChatExample() {
  const queryClient = useQueryClient()
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { data: currentUser } = useQuery({
    queryKey: ME_QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await eden.api.me.get()
      if (error) return null
      return data
    },
    retry: false,
  })

  const { data: messages = [], isLoading } = useQuery({
    queryKey: MESSAGES_QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await eden.api.chat.messages.get()
      if (error) throw error
      return data
    },
  })

  const sendMutation = useMutation({
    mutationFn: async (content: string) => {
      const { data, error } = await eden.api.chat.messages.post({ content })
      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: MESSAGES_QUERY_KEY }),
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll when message count changes
  useEffect(() => {
    scrollIntoView(messagesEndRef, { behavior: 'smooth' })
  }, [messages.length])

  // Live chat via the Elysia SSE stream, consumed as an async iterable.
  useEffect(() => {
    const controller = new AbortController()
    setConnectionStatus('connecting')

    const subscribe = async () => {
      const { data, error } = await eden.api.chat.stream.get({
        fetch: { signal: controller.signal },
      })
      if (error) {
        console.error('SSE subscription error:', error)
        setConnectionStatus('disconnected')
        return
      }
      try {
        for await (const event of data) {
          if (event.type === 'init') {
            queryClient.setQueryData(MESSAGES_QUERY_KEY, event.messages)
            setConnectionStatus('connected')
          } else if (event.type === 'message') {
            queryClient.setQueryData(MESSAGES_QUERY_KEY, (old: ChatMessage[] = []) =>
              appendUniqueChatMessage(old, event.message),
            )
          }
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error('SSE subscription error:', err)
          setConnectionStatus('disconnected')
        }
      }
    }

    subscribe()

    return () => {
      controller.abort()
      setConnectionStatus('disconnected')
    }
  }, [queryClient])

  const handleSendMessage = (e: FormEvent, content: string) => {
    e.preventDefault()
    if (!content.trim() || !currentUser) return
    sendMutation.mutate(content)
  }

  return {
    currentUser,
    messages,
    isLoading,
    connectionStatus,
    messagesEndRef,
    sendMutation,
    handleSendMessage,
  }
}
