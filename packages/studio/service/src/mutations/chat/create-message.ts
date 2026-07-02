import {
  type ChatMessage,
  type ChatMessageInsert,
  chatMessageTable,
} from '@temp-repo/studio-domain'
import { db } from '@temp-repo/studio-repository'

export const createChatMessage = async (
  data: ChatMessageInsert,
): Promise<ChatMessage | undefined> => {
  return await db
    .insert(chatMessageTable)
    .values(data)
    .returning()
    .then(([result]) => result)
}
