
import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first'); // 

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from './schema';

console.log("DATABASE_URL =", process.env.DATABASE_URL);
const client = postgres(process.env.DATABASE_URL!, {
  prepare: false,

});

export const db = drizzle(client, { schema });