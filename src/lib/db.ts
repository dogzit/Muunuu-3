// Shared Neon connection for the /api route handlers. Connects lazily, so nothing touches the
// database at build time. DATABASE_URL comes from .env.local locally and from the Vercel
// project's environment variables in production; the tables are created on first use.
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let sql: NeonQueryFunction<false, false> | null = null;
let ready: Promise<void> | null = null;

export async function db() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) throw new Error("DATABASE_URL is not set. Add it to .env.local or the Vercel project's environment variables.");
  sql ??= neon(url);
  ready ??= setup(sql).catch((err) => { ready = null; throw err; });
  await ready;
  return sql;
}

async function setup(sql: NeonQueryFunction<false, false>) {
  await sql`CREATE TABLE IF NOT EXISTS counters (
    name text PRIMARY KEY,
    n integer NOT NULL DEFAULT 0
  )`;
  await sql`CREATE TABLE IF NOT EXISTS settings (
    name text PRIMARY KEY,
    value text NOT NULL
  )`;
  await sql`CREATE TABLE IF NOT EXISTS notes (
    id serial PRIMARY KEY,
    text text NOT NULL CHECK (char_length(text) BETWEEN 1 AND 240),
    author text NOT NULL DEFAULT '' CHECK (char_length(author) <= 40),
    token_hash text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
  )`;
}

export const json = (data: unknown, status = 200) =>
  Response.json(data, { status, headers: { "cache-control": "no-store" } });

export async function body(request: Request): Promise<Record<string, unknown>> {
  try {
    const data = await request.json();
    return data && typeof data === "object" ? data : {};
  } catch {
    return {};
  }
}

// Wraps a handler so database errors become a short JSON error instead of a crash page.
export const safe = (handler: (request: Request) => Promise<Response>) => async (request: Request) => {
  try {
    return await handler(request);
  } catch (err) {
    console.error(err);
    return json({ error: "The database is not reachable right now." }, 503);
  }
};
