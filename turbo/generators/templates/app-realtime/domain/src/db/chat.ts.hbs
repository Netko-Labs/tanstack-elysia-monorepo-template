import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

/**
 * Chat messages live in the realtime database. Author identity comes from the
 * verified JWT (minted by the studio auth server), so there is no FK to a
 * `user` table here — that table lives in a different database.
 */
export const chatMessageTable = pgTable('chat_message', {
  id: uuid('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  content: text('content').notNull(),
  authorId: text('author_id'),
  authorName: text('author_name').notNull(),
  createdAt: timestamp('created_at')
    .$defaultFn(() => new Date())
    .notNull(),
})
