'use server';

import { and, desc, eq } from 'drizzle-orm';

import { db } from '@/db';
import { boards, columns, jobApplications } from '@/db/schema';
import { getSession } from '../auth';
import { revalidatePath } from 'next/cache';

interface JobApplicationData {
  company: string;
  position: string;
  location?: string;
  notes?: string;
  salary?: string;
  jobUrl?: string;
  columnId: string;
  boardId: string;
  tags?: string[];
  description?: string;
}

export async function createJobApplication(data: JobApplicationData) {
  const session = await getSession();

  if (!session?.user) {
    return { error: 'Unauthorized' };
  }

  const {
    company,
    position,
    location,
    notes,
    salary,
    jobUrl,
    columnId,
    boardId,
    tags,
    description,
  } = data;

  if (!company || !position || !columnId || !boardId) {
    return { error: 'Missing required fields' };
  }

  // Verify board belongs to the current user
  const board = await db.query.boards.findFirst({
    where: and(eq(boards.id, boardId), eq(boards.userId, session.user.id)),
  });

  if (!board) {
    return { error: 'Board not found' };
  }

  // Verify column belongs to the board
  const column = await db.query.columns.findFirst({
    where: and(eq(columns.id, columnId), eq(columns.boardId, board.id)),
  });

  if (!column) {
    return { error: 'Column not found' };
  }

  // Get the highest order in this column
  const [lastJob] = await db
    .select({
      order: jobApplications.order,
    })
    .from(jobApplications)
    .where(eq(jobApplications.columnId, columnId))
    .orderBy(desc(jobApplications.order))
    .limit(1);

  const nextOrder = lastJob ? lastJob.order + 1 : 0;

  // Create the job application
  const [job] = await db
    .insert(jobApplications)
    .values({
      company,
      position,
      location,
      notes,
      salary,
      jobUrl,
      tags: tags ?? [],
      description,
      columnId,
      userId: session.user.id,
      order: nextOrder,
      // status is optional because the schema default is "Applied"
    })
    .returning();

  //revalidate
  revalidatePath('/dashboard');

  return {
    data: job,
  };
}
