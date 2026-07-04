import { type Todo, todoTable } from '@temp-repo/realtime-domain'
import { db } from '@temp-repo/realtime-repository'
import { eq } from 'drizzle-orm'

export const getTodo = async (todoId: string): Promise<Todo | undefined> => {
  return await db
    .select()
    .from(todoTable)
    .where(eq(todoTable.id, todoId))
    .then(([r]) => r)
}
