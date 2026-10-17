"use client";
// Notes: the note wall, kept in Neon's notes table. The composer only shows once the API answers.
import { useEffect, useRef, useState } from "react";
import { api, ApiError, useRefresh } from "@/lib/api";
import { burst, centerOf } from "@/lib/fx";
import { useStored } from "@/lib/store";

type Note = { id: number; text: string; author: string; at: number; mine: boolean };

const tint = (n: number) => [...String(n)].reduce((a, ch) => (a * 31 + ch.charCodeAt(0)) >>> 0, 7);

export function NoteWall() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [live, setLive] = useState(false);
  const [status, setStatus] = useState("loading notes…");
  const [text, setText] = useState("");
  const [name, setName] = useStored("noteName");
  const [posting, setPosting] = useState(false);
  const post = useRef<HTMLButtonElement>(null);

  const load = async () => {
    try {
      const { notes } = await api<{ notes: Note[] }>("notes");
      setLive(true);
      setNotes(notes);
      setStatus(notes.length ? "" : "no notes yet. be the first ♡");
    } catch (err) {
      if (!live) setStatus(err instanceof ApiError && err.status === 503
        ? "the note wall is waiting for its database. connect Neon in Vercel and it wakes up."
        : "the note wall works once the site is online with its database.");
    }
  };
  useRefresh(load);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    setPosting(true);
    try {
      await api("notes", { method: "POST", data: { text: t, author: name.trim() } });
      setText("");
      if (post.current) burst(...centerOf(post.current), 10);
      await load();
    } catch (err) {
      setStatus(err instanceof ApiError && err.status === 400 ? err.message : "that note didn't stick. try again in a moment.");
    }
    setPosting(false);
  };

  return (
    <>
      <form className="composer" id="wallForm" hidden={!live} onSubmit={submit}>
        <label className="sr-only" htmlFor="wallText">Your note</label>
        <textarea id="wallText" maxLength={240} rows={3} placeholder="write something sweet…" required value={text} onChange={(e) => setText(e.target.value)} />
        <label className="name-field">from <input id="wallName" type="text" maxLength={40} placeholder="your name" autoComplete="nickname" value={name} onChange={(e) => setName(e.target.value)} /></label>
        <div className="composer-row">
          <span className="chars"><output id="wallChars">{text.length}</output> / 240</span>
          <button className="btn" id="wallPost" type="submit" ref={post} disabled={posting}>stick it on ♡</button>
        </div>
      </form>
      <p className="wall-status" id="wallStatus" hidden={!status}>{status}</p>
      <ul className="wall" id="wall" aria-live="polite">
        {notes.map((n) => <Sticky key={n.id} note={n} onRemoved={load} />)}
      </ul>
    </>
  );
}

// Removing your own note takes two taps: × then "remove?".
function Sticky({ note: n, onRemoved }: { note: Note; onRemoved: () => Promise<void> }) {
  const [sure, setSure] = useState(false);
  const [removing, setRemoving] = useState(false);
  const h = tint(n.id);

  useEffect(() => {
    if (!sure) return;
    const t = setTimeout(() => setSure(false), 3000);
    return () => clearTimeout(t);
  }, [sure]);

  const remove = async () => {
    if (!sure) return setSure(true);
    setRemoving(true);
    try { await api("notes", { method: "DELETE", data: { id: n.id } }); await onRemoved(); }
    catch { setRemoving(false); }
  };

  const when = n.at ? new Date(n.at).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "";
  return (
    <li className={"sticky t" + (h % 4)} style={{ "--r": ((h % 7) - 3) + "deg" } as React.CSSProperties}>
      <p className="sticky-text">{n.text}</p>
      <p className="sticky-meta">{"— " + (n.author || "someone") + (n.mine ? " (you)" : "") + (when ? " · " + when : "")}</p>
      {n.mine && (
        <button type="button" className={sure ? "sticky-del sure" : "sticky-del"} aria-label="Remove this note" disabled={removing} onClick={remove}>
          {sure ? "remove?" : "×"}
        </button>
      )}
    </li>
  );
}
