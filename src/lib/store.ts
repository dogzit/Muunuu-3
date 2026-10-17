"use client";
// This browser's own storage. Reads and writes never throw (private windows can block
// localStorage), and values live in memory too so the page keeps working without it.
import { useCallback, useSyncExternalStore } from "react";

export const store = {
  get(k: string, d = "") { try { return localStorage.getItem(k) ?? d; } catch { return d; } },
  set(k: string, v: string) { try { localStorage.setItem(k, v); } catch {} },
};

const memory = new Map<string, string>();
const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => { listeners.add(cb); return () => { listeners.delete(cb); }; };

// A string kept in localStorage. Renders `fallback` on the server and during hydration.
export function useStored(key: string, fallback = ""): [string, (v: string) => void] {
  const value = useSyncExternalStore(
    subscribe,
    () => memory.get(key) ?? store.get(key, fallback),
    () => fallback,
  );
  const set = useCallback((v: string) => {
    memory.set(key, v);
    store.set(key, v);
    listeners.forEach((l) => l());
  }, [key]);
  return [value, set];
}
