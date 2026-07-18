import { and, eq } from 'drizzle-orm';

import { db } from '.';
import { boards, columns } from './schema';

const DEFAULT_BOARD_NAME = 'Job Hunt';

const DEFAULT_COLUMNS = [
  { name: 'Wish List', order: 0 },
  { name: 'Applied', order: 1 },
  { name: 'Interviewing', order: 2 },
  { name: 'Offer', order: 3 },
  { name: 'Rejected', order: 4 },
];

export async function initializeUserBoard(userId: string) {
  const existingBoard = await db.query.boards.findFirst({
    where: and(eq(boards.userId, userId), eq(boards.name, DEFAULT_BOARD_NAME)),
  });

  if (existingBoard) {
    return existingBoard;
  }

  const [board] = await db
    .insert(boards)
    .values({
      name: DEFAULT_BOARD_NAME,
      userId,
    })
    .returning();

  await db.insert(columns).values(
    DEFAULT_COLUMNS.map((column) => ({
      name: column.name,
      order: column.order,
      boardId: board.id,
    }))
  );

  return board;
}
