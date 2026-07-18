import { pgTable, uuid, text, timestamp, integer } from 'drizzle-orm/pg-core';

import { user } from './auth';
import { boards } from './boards';
import { columns } from './column';

export const jobApplications = pgTable('job_applications', {
  id: uuid().defaultRandom().primaryKey(),

  company: text().notNull(),

  position: text().notNull(),

  location: text(),

  status: text().default('Applied').notNull(),

  notes: text(),

  salary: text(),

  jobUrl: text('job_url'),

  order: integer().default(0).notNull(),

  boardId: uuid('board_id')
    .references(() => boards.id, {
      onDelete: 'cascade',
    })
    .notNull(),

  columnId: uuid('column_id')
    .references(() => columns.id, {
      onDelete: 'cascade',
    })
    .notNull(),

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
