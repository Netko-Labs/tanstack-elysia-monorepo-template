import { type Todo, type TodoInsert, todoTable } from '@temp-repo/realtime-domain'
import { db } from '@temp-repo/realtime-repository'

export const createTodo = async (data: TodoInsert): Promise<Todo | undefined> => {
  return await db
    .insert(todoTable)
    .values(data)
    .returning()
    .then(([r]) => r)
}
