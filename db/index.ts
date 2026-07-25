
import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first'); // 

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from './schema';


const client = postgres(process.env.DATABASE_URL!, {
    prepare: false,
  connect_timeout: 30,

});

export const db = drizzle(client, { schema });