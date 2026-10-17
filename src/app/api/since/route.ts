// GET /api/since                        -> { since: "YYYY-MM-DD" | null }
// PUT /api/since {since: "YYYY-MM-DD"}  -> { since }
import { db, json, body, safe } from "@/lib/db";

const isDay = (v: unknown): v is string =>
  typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v)
  && !Number.isNaN(Date.parse(v + "T00:00:00Z"))
  && new Date(v + "T00:00:00Z").toISOString().startsWith(v);

export const GET = safe(async () => {
  const sql = await db();
  const [row] = await sql`SELECT value FROM settings WHERE name = 'since'`;
  return json({ since: row ? row.value : null });
});

export const PUT = safe(async (request) => {
  const { since } = await body(request);
  if (!isDay(since)) return json({ error: "since must be a real date written as YYYY-MM-DD." }, 400);
  if (Date.parse(since + "T00:00:00Z") > Date.now() + 864e5) return json({ error: "since cannot be in the future." }, 400);
  const sql = await db();
  await sql`
    INSERT INTO settings (name, value) VALUES ('since', ${since})
    ON CONFLICT (name) DO UPDATE SET value = EXCLUDED.value`;
  return json({ since });
});
