import { type ChatMessage, chatMessageTable } from '@temp-repo/studio-domain'
import { db } from '@temp-repo/studio-repository'
import { desc } from 'drizzle-orm'

export const getChatMessages = async (limit = 100): Promise<ChatMessage[]> => {
  const messages = await db
    .select()
    .from(chatMessageTable)
    .orderBy(desc(chatMessageTable.createdAt))
    .limit(limit)
  return messages.reverse()
}
