// GET    /api/notes                -> { notes: [{id, text, author, at, mine}] }  (newest 60)
// POST   /api/notes {text, author} -> { note }
// DELETE /api/notes {id}           -> { ok: true }
// Each browser sends a random X-Note-Token. Only its hash is stored, and it is what lets a
// browser remove the notes it wrote; nobody else can.
import { createHash } from "node:crypto";
import { db, json, body, safe } from "@/lib/db";

const KEEP = 500; // oldest notes past this are pruned so the table stays small

const hashOf = (request: Request) => {
  const token = request.headers.get("x-note-token") || "";
  return token.length >= 16 && token.length <= 200 ? createHash("sha256").update(token).digest("hex") : null;
};

const shape = (row: Record<string, unknown>, hash: string | null) => ({
  id: row.id,
  text: row.text,
  author: row.author,
  at: Number(row.at),
  mine: !!hash && row.token_hash === hash,
});

export const GET = safe(async (request) => {
  const sql = await db(), hash = hashOf(request);
  const rows = await sql`
    SELECT id, text, author, token_hash, (extract(epoch FROM created_at) * 1000)::float8 AS at
    FROM notes ORDER BY id DESC LIMIT 60`;
  return json({ notes: rows.map((r) => shape(r, hash)) });
});

export const POST = safe(async (request) => {
  const hash = hashOf(request);
  if (!hash) return json({ error: "Missing X-Note-Token header." }, 400);
  const input = await body(request);
  const text = typeof input.text === "string" ? input.text.trim() : "";
  const author = typeof input.author === "string" ? input.author.trim().slice(0, 40) : "";
  if (!text || text.length > 240) return json({ error: "A note needs 1 to 240 characters." }, 400);
  const sql = await db();
  const [row] = await sql`
    INSERT INTO notes (text, author, token_hash) VALUES (${text}, ${author}, ${hash})
    RETURNING id, text, author, token_hash, (extract(epoch FROM created_at) * 1000)::float8 AS at`;
  await sql`DELETE FROM notes WHERE id <= ${row.id - KEEP}`;
  return json({ note: shape(row, hash) }, 201);
});

export const DELETE = safe(async (request) => {
  const hash = hashOf(request);
  const { id } = await body(request);
  if (!hash || typeof id !== "number" || !Number.isInteger(id)) return json({ error: "Send the note id and your X-Note-Token." }, 400);
  const sql = await db();
  const rows = await sql`DELETE FROM notes WHERE id = ${id} AND token_hash = ${hash} RETURNING id`;
  return rows.length ? json({ ok: true }) : json({ error: "That note is gone or was written in another browser." }, 404);
});
