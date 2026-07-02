import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import type { z } from 'zod'
import { todoTable } from '../db'

/**
 * +---------------------+
 * | Todo Schemas        |
 * +---------------------+
 *        /\_/\
 *       ( o.o )
 */
export const TodoInsertSchema = createInsertSchema(todoTable)
export type TodoInsert = z.infer<typeof TodoInsertSchema>

export const TodoUpdateSchema = createUpdateSchema(todoTable).required({ id: true })
export type TodoUpdate = z.infer<typeof TodoUpdateSchema>

export const TodoSchema = createSelectSchema(todoTable)
export type Todo = z.infer<typeof TodoSchema>
