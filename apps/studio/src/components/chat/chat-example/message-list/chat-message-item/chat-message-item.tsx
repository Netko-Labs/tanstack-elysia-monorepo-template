import { formatMessageTime } from '@/shared/format-date'
import type { ChatMessageItemProps } from '../../lib'

export function ChatMessageItem({ message, isOwnMessage }: ChatMessageItemProps) {
  return (
    <div className={`flex flex-col gap-1 ${isOwnMessage ? 'items-end' : 'items-start'}`}>
      <div
        className={`max-w-[80%] rounded-lg px-3 py-2 ${
          isOwnMessage ? 'bg-primary text-primary-foreground' : 'bg-muted'
        }`}
      >
        <p className="text-sm">{message.content}</p>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="font-medium">{message.authorName}</span>
        <span>{formatMessageTime(message.createdAt)}</span>
      </div>
    </div>
  )
}
