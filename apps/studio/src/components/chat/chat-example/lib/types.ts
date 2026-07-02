import type { ChatMessage } from '@temp-repo/studio-domain'
import type { FormEvent, RefObject } from 'react'

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected'

export interface ChatInitEvent {
  id: string
  type: 'init'
  messages: ChatMessage[]
}

export interface ChatMessageEvent {
  id: string
  type: 'message'
  message: ChatMessage
}

export type ChatEvent = ChatInitEvent | ChatMessageEvent

export interface ConnectionStatusProps {
  status: ConnectionStatus
  userName?: string
}

export interface MessageListProps {
  messages: ChatMessage[]
  isLoading: boolean
  currentUserId?: string
  messagesEndRef: RefObject<HTMLDivElement | null>
}

export interface ChatMessageItemProps {
  message: ChatMessage
  isOwnMessage: boolean
}

export interface SendMessageFormProps {
  onSubmit: (e: FormEvent, content: string) => void
  isPending: boolean
}
