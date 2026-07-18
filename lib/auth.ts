import { betterAuth } from 'better-auth';
import { drizzleAdapter } from '@better-auth/drizzle-adapter';

import { db } from '@/db';
import * as schema from '@/db/schema';
import { headers } from 'next/headers';
import { initializeUserBoard } from '@/db/init-user-board';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),

  emailAndPassword: {
    enabled: true,
  },

  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await initializeUserBoard(user.id);
        },
      },
    },
  },
});

export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  console.log('SESSION', session);

  return session;
}
