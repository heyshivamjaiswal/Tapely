'use server';

import { and, asc, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { db } from '@/db';
import { boards, columns } from '@/db/schema';
import { getSession } from '../auth';

export async function createColumn(boardId: string, name: string) {
  const session = await getSession();
  if (!session?.user) {
    return { error: 'Unauthorized' };
  }

  if (!name.trim()) {
    return { error: 'Column name is required' };
  }

  const board = await db.query.boards.findFirst({
    where: and(eq(boards.id, boardId), eq(boards.userId, session.user.id)),
  });

  if (!board) {
    return { error: 'Board not found' };
  }

  const [lastColumn] = await db
    .select({ order: columns.order })
    .from(columns)
    .where(eq(columns.boardId, boardId))
    .orderBy(asc(columns.order))
    .limit(1);

  const existingColumns = await db.query.columns.findMany({
    where: eq(columns.boardId, boardId),
    orderBy: asc(columns.order),
  });

  const nextOrder =
    existingColumns.length > 0
      ? existingColumns[existingColumns.length - 1].order + 1
      : 0;

  const [column] = await db
    .insert(columns)
    .values({ name: name.trim(), boardId, order: nextOrder })
    .returning();

  revalidatePath('/dashboard');

  return { data: column };
}

export async function renameColumn(columnId: string, name: string) {
  const session = await getSession();
  if (!session?.user) {
    return { error: 'Unauthorized' };
  }

  if (!name.trim()) {
    return { error: 'Column name is required' };
  }

  const column = await db.query.columns.findFirst({
    where: eq(columns.id, columnId),
    with: { board: true },
  });

  if (!column || column.board.userId !== session.user.id) {
    return { error: 'Column not found' };
  }

  const [updated] = await db
    .update(columns)
    .set({ name: name.trim() })
    .where(eq(columns.id, columnId))
    .returning();

  revalidatePath('/dashboard');

  return { data: updated };
}

export async function deleteColumn(columnId: string) {
  const session = await getSession();
  if (!session?.user) {
    return { error: 'Unauthorized' };
  }

  const column = await db.query.columns.findFirst({
    where: eq(columns.id, columnId),
    with: { board: true },
  });

  if (!column || column.board.userId !== session.user.id) {
    return { error: 'Column not found' };
  }

  // deleting the column cascades to its job applications via the FK's onDelete: 'cascade'
  await db.delete(columns).where(eq(columns.id, columnId));

  revalidatePath('/dashboard');

  return { success: true };
}