import { relations } from 'drizzle-orm';

import { user } from './auth';
import { boards } from './boards';
import { columns } from './column';
import { jobApplications } from './job-applications';

export const boardRelations = relations(boards, ({ one, many }) => ({
  user: one(user, {
    fields: [boards.userId],
    references: [user.id],
  }),
  columns: many(columns),
}));

export const jobApplicationRelations = relations(
  jobApplications,
  ({ one }) => ({
    column: one(columns, {
      fields: [jobApplications.columnId],
      references: [columns.id],
    }),
    user: one(user, {
      fields: [jobApplications.userId],
      references: [user.id],
    }),
  })
);

export const columnRelations = relations(columns, ({ one, many }) => ({
  board: one(boards, {
    fields: [columns.boardId],
    references: [boards.id],
  }),
  jobApplications: many(jobApplications), // ← unaffected, uses columnId not boardId — keep this
}));
