"use client";
// Notes: open-when envelopes. Tapping one lifts its flap, then its letter opens in a dialog.
import { useEffect, useRef, useState, type ReactNode } from "react";
import { burst, centerOf, reducedMotion } from "@/lib/fx";

export function Envelopes({ letters }: { letters: { label: string; letter: ReactNode }[] }) {
  const [opened, setOpened] = useState<number | null>(null); // the envelope with its flap up
  const [shown, setShown] = useState<number | null>(null); // the letter in the dialog
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => { if (shown !== null) dialog.current?.showModal(); }, [shown]);

  const open = (i: number, env: HTMLElement) => {
    setOpened(i);
    setTimeout(() => {
      setShown(i);
      burst(...centerOf(env), 8);
    }, reducedMotion() ? 0 : 420);
  };
  const closed = () => { setOpened(null); setShown(null); };

  return (
    <>
      <div className="openwhen">
        {letters.map(({ label }, i) => (
          <button key={label} className={opened === i ? "env open" : "env"} type="button" onClick={(e) => open(i, e.currentTarget)}>
            <span className="paper"><span className="flap"></span><span className="seal">♥</span></span>
            <span className="label">{label}</span>
          </button>
        ))}
      </div>
      <dialog className="letter" id="letter" aria-label="Letter" ref={dialog} onClose={closed}
        onClick={(e) => { if (e.target === e.currentTarget) dialog.current?.close(); }}>
        <div className="sheet">
          <button className="close" id="letterClose" type="button" aria-label="Close letter" onClick={() => dialog.current?.close()}>×</button>
          <div id="letterBody">{shown !== null && letters[shown].letter}</div>
        </div>
      </dialog>
    </>
  );
}
