"use client";
// Notes: days-together counter. Shared: settings 'since' in Neon. Until the API answers (or
// without a database) it uses this browser's pick, then `fallback`.
import { useEffect, useEffectEvent, useRef, useState, useSyncExternalStore } from "react";
import { api, useRefresh } from "@/lib/api";
import { burst, centerOf } from "@/lib/fx";
import { useStored } from "@/lib/store";

const isDate = (v: unknown): v is string => typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v);
const pad = (n: number) => String(n).padStart(2, "0");
const localDay = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const noSubscribe = () => () => {};

export function DaysCounter({ fallback }: { fallback: string }) {
  const [local, setLocal] = useStored("since");
  // undefined until /api/since answers; then the shared date, or null when none is saved yet
  const [shared, setShared] = useState<string | null | undefined>(undefined);
  const since = (isDate(shared) && shared) || local || fallback;
  const today = useSyncExternalStore(noSubscribe, localDay, () => null); // null on the server
  const input = useRef<HTMLInputElement>(null), days = useRef<HTMLOutputElement>(null);

  useRefresh(async () => {
    try { setShared((await api<{ since: string | null }>("since")).since ?? null); } catch {}
  });

  // the input is left uncontrolled so half-typed dates aren't fought; it follows `since` here
  useEffect(() => { if (isDate(since) && input.current) input.current.value = since; }, [since]);

  const pick = useEffectEvent((value: string) => {
    if (!isDate(value)) return;
    setLocal(value);
    if (shared !== undefined) {
      setShared(value);
      api("since", { method: "PUT", data: { since: value } }).catch(() => {});
    }
    if (days.current) burst(...centerOf(days.current), 12);
  });
  useEffect(() => {
    const el = input.current!;
    const onChange = () => pick(el.value);
    el.addEventListener("change", onChange);
    return () => el.removeEventListener("change", onChange);
  }, []);

  const n = today && isDate(since)
    ? Math.max(0, Math.round((Date.parse(today + "T00:00Z") - Date.parse(since + "T00:00Z")) / 864e5))
    : null;

  return (
    <section className={isDate(since) ? "counter" : "counter unset"} aria-label="Days together">
      <span className="eyebrow">we&apos;ve been us for</span>
      <p className="big"><output id="days" ref={days}>{n === null ? "?" : n.toLocaleString()}</output></p>
      <p className="unit">days <small>(and counting, obviously)</small></p>
      <label className="pick-date">when did &quot;us&quot; start? <input type="date" id="since" ref={input} max={today ?? undefined} /></label>
    </section>
  );
}
