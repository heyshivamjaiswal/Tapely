import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';

import { user } from './auth';

export const boards = pgTable('boards', {
  id: uuid().defaultRandom().primaryKey(),

  name: text().notNull(),

  userId: text('user_id')
    .references(() => user.id, {
      onDelete: 'cascade',
    })
    .notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),

  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
