import { type Todo, type TodoUpdate, todoTable } from '@temp-repo/studio-domain'
import { db } from '@temp-repo/studio-repository'
import { eq } from 'drizzle-orm'

export const updateTodo = async (
  todoId: string,
  data: Partial<TodoUpdate>,
): Promise<Todo | undefined> => {
  return await db
    .update(todoTable)
    .set(data)
    .where(eq(todoTable.id, todoId))
    .returning()
    .then(([result]) => result)
}
