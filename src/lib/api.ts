"use client";
// Shared data (hearts, our start date, the note wall) lives in Neon behind /api. When the API
// can't answer (no database yet), every feature falls back to this browser's own storage.
import { useEffect, useEffectEvent } from "react";
import { store } from "./store";

let token = "";
function noteToken() {
  token ||= store.get("noteToken");
  if (!token) {
    token = (crypto.randomUUID?.() || Math.random().toString(36).slice(2) + Date.now().toString(36)).replace(/-/g, "")
      + Math.random().toString(36).slice(2);
    store.set("noteToken", token);
  }
  return token;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function api<T>(path: string, { method = "GET", data }: { method?: string; data?: unknown } = {}): Promise<T> {
  const res = await fetch("/api/" + path, {
    method, cache: "no-store",
    headers: { "content-type": "application/json", "x-note-token": noteToken() },
    body: data === undefined ? undefined : JSON.stringify(data),
  });
  const out = await res.json().catch(() => null);
  if (!res.ok || !out) throw new ApiError(out?.error || "Request failed", res.status);
  return out;
}

// Runs `refresh` now, then every 20 s while the page is visible and whenever it becomes visible again.
export function useRefresh(refresh: () => void) {
  const tick = useEffectEvent(() => { if (!document.hidden) refresh(); });
  useEffect(() => {
    tick();
    const id = setInterval(tick, 20000);
    document.addEventListener("visibilitychange", tick);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", tick);
    };
  }, []);
}
