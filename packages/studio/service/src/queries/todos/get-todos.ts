import { type Todo, todoTable } from '@temp-repo/studio-domain'
import { db } from '@temp-repo/studio-repository'

export const getTodos = async (): Promise<Todo[]> => {
  return await db.select().from(todoTable)
}
