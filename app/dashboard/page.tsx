import KanbanBoard from '@/components/kanban-board';
import { AmbientBackground } from '@/components/ambient-background';
import { BoardSkeleton } from '@/components/board-skeleton';
import { db } from '@/db';
import { boards } from '@/db/schema';
import { getSession } from '@/lib/auth';
import { and, eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

async function getBoard(userId: string) {
  const board = await db.query.boards.findFirst({
    where: and(eq(boards.userId, userId), eq(boards.name, 'Job Hunt')),
    with: {
      columns: {
        with: {
          jobApplications: true,
        },
      },
    },
  });

  return board;
}

async function DashBoardPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect('/sign-in');
  }

  const board = await getBoard(session.user.id);

  if (!board) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">
        No board found.
      </div>
    );
  }

  const totalApplications = board.columns.reduce(
    (sum, col) => sum + col.jobApplications.length,
    0
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <AmbientBackground intensity="subtle" />

      <div className="container relative z-10 mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold">Job Hunt</h1>
          <p className="text-muted-foreground">
            {totalApplications === 0
              ? 'Add your first application to get started'
              : `${totalApplications} application${totalApplications === 1 ? '' : 's'} tracked`}
          </p>
        </div>

        <div className="relative rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
          <KanbanBoard board={board} />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<BoardSkeletonWrapper />}>
      <DashBoardPage />
    </Suspense>
  );
}

function BoardSkeletonWrapper() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="container relative z-10 mx-auto p-6">
        <BoardSkeleton />
      </div>
    </div>
  );
}