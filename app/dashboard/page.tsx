import KanbanBoard from '@/components/kanban-board';
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold">Job Hunt</h1>
          <p className="text-muted-foreground">
            {totalApplications === 0
              ? 'Add your first application to get started'
              : `${totalApplications} application${totalApplications === 1 ? '' : 's'} tracked`}
          </p>
        </div>

        <KanbanBoard board={board} userId={session.user.id} />
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <DashBoardPage />
    </Suspense>
  );
}