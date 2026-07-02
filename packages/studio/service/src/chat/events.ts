import { EventEmitter } from 'node:events'
import type { ChatMessage } from '@temp-repo/studio-domain'

class ChatEventEmitter extends EventEmitter {
  emitMessage(message: ChatMessage) {
    this.emit('message', message)
  }

  subscribeToMessages(callback: (message: ChatMessage) => void) {
    this.on('message', callback)
    return () => this.off('message', callback)
  }
}

export const chatEvents = new ChatEventEmitter()
