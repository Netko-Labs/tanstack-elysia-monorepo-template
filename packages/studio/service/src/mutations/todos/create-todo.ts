import { type Todo, type TodoInsert, todoTable } from '@temp-repo/studio-domain'
import { db } from '@temp-repo/studio-repository'

export const createTodo = async (data: TodoInsert): Promise<Todo | undefined> => {
  return await db
    .insert(todoTable)
    .values(data)
    .returning()
    .then(([result]) => result)
}
