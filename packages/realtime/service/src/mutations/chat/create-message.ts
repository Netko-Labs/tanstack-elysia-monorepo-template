import {
  type ChatMessage,
  type ChatMessageInsert,
  chatMessageTable,
} from '@temp-repo/realtime-domain'
import { db } from '@temp-repo/realtime-repository'

export const createChatMessage = async (
  data: ChatMessageInsert,
): Promise<ChatMessage | undefined> => {
  return await db
    .insert(chatMessageTable)
    .values(data)
    .returning()
    .then(([r]) => r)
}
