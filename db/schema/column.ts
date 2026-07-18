import { pgTable, uuid, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { boards } from './boards';

export const columns = pgTable('columns', {
  id: uuid().defaultRandom().primaryKey(),

  name: text().notNull(),

  boardId: uuid('board_id')
    .references(() => boards.id, {
      onDelete: 'cascade',
    })
    .notNull(),

  order: integer().default(0).notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),

  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
