// Shared Neon connection for the /api routes. Files starting with "_" are not routes on Vercel.
// Vercel's Neon integration sets DATABASE_URL; the tables are created on first use.
import { neon } from '@neondatabase/serverless';

let sql = null;
let ready = null;

export async function db() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) throw new Error('DATABASE_URL is not set. Connect a Neon database in the Vercel project\'s Storage tab.');
  sql ??= neon(url);
  ready ??= setup(sql).catch(err => { ready = null; throw err });
  await ready;
  return sql;
}

async function setup(sql) {
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

export const json = (data, status = 200) =>
  Response.json(data, { status, headers: { 'cache-control': 'no-store' } });

export async function body(request) {
  try { return await request.json() } catch { return {} }
}

// Wraps a handler so database errors become a short JSON error instead of a crash page.
export const safe = handler => async request => {
  try { return await handler(request) }
  catch (err) {
    console.error(err);
    return json({ error: 'The database is not reachable right now.' }, 503);
  }
};
