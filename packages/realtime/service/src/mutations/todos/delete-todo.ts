import { type Todo, todoTable } from '@temp-repo/realtime-domain'
import { db } from '@temp-repo/realtime-repository'
import { eq } from 'drizzle-orm'

export const deleteTodo = async (todoId: string): Promise<Todo | undefined> => {
  return await db
    .delete(todoTable)
    .where(eq(todoTable.id, todoId))
    .returning()
    .then(([r]) => r)
}
