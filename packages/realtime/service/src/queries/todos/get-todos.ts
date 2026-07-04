import { type Todo, todoTable } from '@temp-repo/realtime-domain'
import { db } from '@temp-repo/realtime-repository'

export const getTodos = async (): Promise<Todo[]> => {
  return await db.select().from(todoTable)
}
