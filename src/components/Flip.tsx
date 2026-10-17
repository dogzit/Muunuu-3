"use client";
import { useState } from "react";

// Notes: one "reason i like you" card. Tap to flip.
export function Flip({ n, children }: { n: number; children: React.ReactNode }) {
  const [on, setOn] = useState(false);
  return (
    <button className={on ? "flip on" : "flip"} type="button" aria-pressed={on} onClick={() => setOn(!on)}>
      <span className="inner"><span className="face front"><b>#{n}</b><i>tap</i></span><span className="face back">{children}</span></span>
    </button>
  );
}
