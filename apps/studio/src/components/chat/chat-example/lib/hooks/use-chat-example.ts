import type { ChatMessage, ClientMessage, Member, ServerEvent } from '@temp-repo/realtime-domain'
import { type FormEvent, useEffect, useRef, useState } from 'react'
import { useSession } from '@/integrations/auth'
import { connectRoom } from '@/integrations/realtime'
import { scrollIntoView } from '@/shared/dom-events'
import type { ConnectionStatus } from '../types'
import { appendUniqueChatMessage } from '../utils'

const ROOM_ID = 'lobby'

export function useChatExample() {
  const { data: session } = useSession()
  const currentUser = session?.user ?? null
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const wsRef = useRef<WebSocket | null>(null)

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll when message count changes
  useEffect(() => {
    scrollIntoView(messagesEndRef, { behavior: 'smooth' })
  }, [messages.length])

  // biome-ignore lint/correctness/useExhaustiveDependencies: reconnect only when the user changes
  useEffect(() => {
    if (!currentUser) {
      setConnectionStatus('disconnected')
      return
    }
    let active = true
    setConnectionStatus('connecting')
    connectRoom(ROOM_ID).then((ws) => {
      if (!ws || !active) {
        ws?.close()
        if (!ws) setConnectionStatus('disconnected')
        return
      }
      wsRef.current = ws
      ws.onopen = () => setConnectionStatus('connected')
      ws.onmessage = (ev) => {
        const event = JSON.parse(ev.data) as ServerEvent
        if (event.type === 'history') setMessages(event.messages)
        else if (event.type === 'chat')
          setMessages((m) => appendUniqueChatMessage(m, event.message))
        else if (event.type === 'presence') setMembers(event.members)
        else if (event.type === 'join')
          setMembers((m) => [...m.filter((x) => x.userId !== event.member.userId), event.member])
        else if (event.type === 'leave')
          setMembers((m) => m.filter((x) => x.userId !== event.userId))
      }
      ws.onclose = () => setConnectionStatus('disconnected')
      ws.onerror = () => setConnectionStatus('disconnected')
    })
    return () => {
      active = false
      wsRef.current?.close()
      wsRef.current = null
    }
  }, [currentUser?.id])

  const handleSendMessage = (e: FormEvent, content: string) => {
    e.preventDefault()
    if (!content.trim() || !currentUser) return
    const message: ClientMessage = { type: 'chat', content }
    wsRef.current?.send(JSON.stringify(message))
  }

  return {
    currentUser,
    messages,
    members,
    isLoading: false,
    connectionStatus,
    messagesEndRef,
    sendMutation: { isPending: false },
    handleSendMessage,
  }
}
