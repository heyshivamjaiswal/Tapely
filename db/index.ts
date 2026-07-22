// ✅ correct — the import alone does nothing; you need to call the function
import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first'); // ← this line was missing

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from './schema';

const client = postgres(process.env.DATABASE_URL!, {
  prepare: false,
  connect_timeout: 30,
  idle_timeout: 30,
  max:10,
});

export const db = drizzle(client, { schema });