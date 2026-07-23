'use server';

import { and, asc, desc, eq, ne } from 'drizzle-orm';

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

  const board = await db.query.boards.findFirst({
    where: and(eq(boards.id, boardId), eq(boards.userId, session.user.id)),
  });

  if (!board) {
    return { error: 'Board not found' };
  }

  const column = await db.query.columns.findFirst({
    where: and(eq(columns.id, columnId), eq(columns.boardId, board.id)),
  });

  if (!column) {
    return { error: 'Column not found' };
  }

  const [lastJob] = await db
    .select({ order: jobApplications.order })
    .from(jobApplications)
    .where(eq(jobApplications.columnId, columnId))
    .orderBy(desc(jobApplications.order))
    .limit(1);

  const nextOrder = lastJob ? lastJob.order + 1 : 0;

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
    })
    .returning();

  revalidatePath('/dashboard');

  return { data: job };
}

export async function updateJobApplication(
  id: string,
  updates: {
    company?: string;
    position?: string;
    location?: string;
    notes?: string;
    salary?: string;
    jobUrl?: string;
    tags?: string[];
    description?: string;
    columnId?: string;
    order?: number;
  }
) {
  const session = await getSession();

  if (!session?.user) {
    return { error: 'Unauthorized' };
  }

  const jobApplication = await db.query.jobApplications.findFirst({
    where: eq(jobApplications.id, id),
  });

  if (!jobApplication) {
    return { error: 'Job application not found' };
  }

  if (jobApplication.userId !== session.user.id) {
    return { error: 'Unauthorized' };
  }

  const { columnId: newColumnId, order, ...otherUpdates } = updates;

  const updatesToApply: Record<string, unknown> = { ...otherUpdates };

  const currentColumnId = jobApplication.columnId;
  const isMovingToDifferentColumn =
    newColumnId && newColumnId !== currentColumnId;

  if (isMovingToDifferentColumn) {
    const jobsInTargetColumn = await db
      .select()
      .from(jobApplications)
      .where(
        and(
          eq(jobApplications.columnId, newColumnId),
          ne(jobApplications.id, id)
        )
      )
      .orderBy(asc(jobApplications.order));

    let newOrderValue: number;

    if (order !== undefined && order !== null) {
      newOrderValue = order * 100;

      const jobsThatNeedToShift = jobsInTargetColumn.slice(order);
      for (const job of jobsThatNeedToShift) {
        await db
          .update(jobApplications)
          .set({ order: job.order + 100 })
          .where(eq(jobApplications.id, job.id));
      }
    } else {
      const lastJob = jobsInTargetColumn[jobsInTargetColumn.length - 1];
      newOrderValue = lastJob ? lastJob.order + 100 : 0;
    }

    updatesToApply.columnId = newColumnId;
    updatesToApply.order = newOrderValue;
  } else if (order !== undefined && order !== null) {
    const otherJobsInColumn = await db
      .select()
      .from(jobApplications)
      .where(
        and(
          eq(jobApplications.columnId, currentColumnId),
          ne(jobApplications.id, id)
        )
      )
      .orderBy(asc(jobApplications.order));

    const currentJobOrder = jobApplication.order;
    const currentPositionIndex = otherJobsInColumn.findIndex(
      (job) => job.order > currentJobOrder
    );
    const oldPositionIndex =
      currentPositionIndex === -1
        ? otherJobsInColumn.length
        : currentPositionIndex;

    const newOrderValue = order * 100;

    if (order < oldPositionIndex) {
      const jobsToShiftDown = otherJobsInColumn.slice(order, oldPositionIndex);
      for (const job of jobsToShiftDown) {
        await db
          .update(jobApplications)
          .set({ order: job.order + 100 })
          .where(eq(jobApplications.id, job.id));
      }
    } else if (order > oldPositionIndex) {
      const jobsToShiftUp = otherJobsInColumn.slice(oldPositionIndex, order);
      for (const job of jobsToShiftUp) {
        const newOrder = Math.max(0, job.order - 100);
        await db
          .update(jobApplications)
          .set({ order: newOrder })
          .where(eq(jobApplications.id, job.id));
      }
    }

    updatesToApply.order = newOrderValue;
  }

  const [updated] = await db
    .update(jobApplications)
    .set(updatesToApply)
    .where(eq(jobApplications.id, id))
    .returning();

  revalidatePath('/dashboard');

  return { data: updated };
}

export async function deleteJobApplication(id: string) {
  const session = await getSession();

  if (!session?.user) {
    return { error: 'Unauthorized' };
  }

  const jobApplication = await db.query.jobApplications.findFirst({
    where: eq(jobApplications.id, id),
  });

  if (!jobApplication) {
    return { error: 'Job application not found' };
  }

  if (jobApplication.userId !== session.user.id) {
    return { error: 'Unauthorized' };
  }

  await db.delete(jobApplications).where(eq(jobApplications.id, id));

  revalidatePath('/dashboard');

  return { success: true };
}