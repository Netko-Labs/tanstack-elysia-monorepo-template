import { relations } from 'drizzle-orm'
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { user } from './auth'

/**
 * +---------------------+
 * | Chat Message Table  |
 * +---------------------+
 *        /\_/\
 *       ( ^.^ )
 */
export const chatMessageTable = pgTable('chat_message', {
  id: uuid('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  content: text('content').notNull(),
  authorId: text('author_id').references(() => user.id, { onDelete: 'set null' }),
  authorName: text('author_name').notNull(),
  createdAt: timestamp('created_at')
    .$defaultFn(() => new Date())
    .notNull(),
})

export const chatMessageRelations = relations(chatMessageTable, ({ one }) => ({
  author: one(user, {
    fields: [chatMessageTable.authorId],
    references: [user.id],
  }),
}))
