"use client";
// Scrapbook: send a heart. Shared: one total in Neon; taps are batched and added atomically.
// `mine` counts the hearts sent from this browser.
import { useRef, useState } from "react";
import { api, useRefresh } from "@/lib/api";
import { burst } from "@/lib/fx";
import { useStored } from "@/lib/store";

export function HeartTally() {
  const [stored, setStored] = useStored("hearts", "0");
  const mine = parseInt(stored, 10) || 0;
  const [total, setTotal] = useState<number | null>(null);
  const pending = useRef(0), sending = useRef(false), timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const flush = async () => {
    if (sending.current || !pending.current) return;
    sending.current = true;
    const add = Math.min(pending.current, 50);
    pending.current -= add;
    try { setTotal((await api<{ total: number }>("hearts", { method: "POST", data: { add } })).total + pending.current); }
    catch {}
    sending.current = false;
    if (pending.current) flush();
  };

  useRefresh(async () => {
    if (sending.current || pending.current) return;
    try { setTotal((await api<{ total: number }>("hearts")).total); } catch {}
  });

  const send = (e: React.MouseEvent<HTMLButtonElement>) => {
    setStored(String(mine + 1));
    if (total !== null) {
      setTotal(total + 1);
      pending.current++;
      clearTimeout(timer.current);
      timer.current = setTimeout(flush, 400);
    }
    const r = e.currentTarget.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top, 10);
  };

  return (
    <div className="tally">
      <button className="btn" id="love" type="button" onClick={send}>send a heart</button>
      <span><output id="count">{(total ?? mine).toLocaleString()}</output> sent</span>
      <span className="tally-note" id="tallyNote">{total !== null && mine && total > mine ? `(${mine.toLocaleString()} from you)` : ""}</span>
    </div>
  );
}
