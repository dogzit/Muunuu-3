"use client";
import type { ReactNode } from "react";
import { burst } from "@/lib/fx";

// The beating "&" (or ♡) in a heading. Tap it for hearts.
export function Amp({ children }: { children: ReactNode }) {
  return <span className="amp" title="tap me" onClick={(e) => burst(e.clientX, e.clientY, 10)}>{children}</span>;
}
