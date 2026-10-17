// GET  /api/hearts            -> { total }
// POST /api/hearts {add: 1-50} -> { total }   (adds in one atomic UPDATE, so taps never overwrite each other)
import { db, json, body, safe } from './_db.js';

export const GET = safe(async () => {
  const sql = await db();
  const [row] = await sql`SELECT n FROM counters WHERE name = 'hearts'`;
  return json({ total: row ? row.n : 0 });
});

export const POST = safe(async request => {
  const { add } = await body(request);
  if (!Number.isInteger(add) || add < 1 || add > 50) return json({ error: 'add must be a whole number from 1 to 50.' }, 400);
  const sql = await db();
  const [row] = await sql`
    INSERT INTO counters (name, n) VALUES ('hearts', ${add})
    ON CONFLICT (name) DO UPDATE SET n = counters.n + EXCLUDED.n
    RETURNING n`;
  return json({ total: row.n });
});
