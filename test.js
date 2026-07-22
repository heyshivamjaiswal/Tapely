import { sql } from "drizzle-orm";
import { db } from "./db";

async function main() {
  console.log(process.env.DATABASE_URL);

  const result = await db.execute(sql`select 1`);

  console.log(result);
}

main().catch(console.error);