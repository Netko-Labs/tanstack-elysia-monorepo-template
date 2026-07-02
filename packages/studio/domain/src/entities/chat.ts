import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import type { z } from 'zod'
import { chatMessageTable } from '../db'

/**
 * +---------------------+
 * | Chat Message Schemas|
 * +---------------------+
 *        /\_/\
 *       ( ^.^ )
 */
export const ChatMessageInsertSchema = createInsertSchema(chatMessageTable)
export type ChatMessageInsert = z.infer<typeof ChatMessageInsertSchema>

export const ChatMessageSchema = createSelectSchema(chatMessageTable)
export type ChatMessage = z.infer<typeof ChatMessageSchema>
