import type { ChatMessage } from '@temp-repo/realtime-domain'

export function appendUniqueChatMessage(messages: ChatMessage[], message: ChatMessage) {
  if (messages.some((entry) => entry.id === message.id)) {
    return messages
  }

  return [...messages, message]
}
