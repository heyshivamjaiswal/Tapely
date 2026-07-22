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
    return <div>No board found.</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-black">Job Hunt</h1>
          <p className="text-gray-600">Track your job application</p>
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