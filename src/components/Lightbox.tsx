"use client";
// Lightbox: anything with data-zoom opens its <img> big (with hearts, or a camera flash in the studio).
import { useEffect, useRef, useState } from "react";
import { burst, centerOf, isStudio, pop } from "@/lib/fx";

type Shot = { src: string; alt: string; cap: string; no: string };

export function Lightbox() {
  const [shot, setShot] = useState<Shot | null>(null);
  const opener = useRef<HTMLElement | null>(null), isOpen = useRef(false);

  const close = () => {
    if (!isOpen.current) return;
    isOpen.current = false;
    setShot(null);
    opener.current?.focus({ preventScroll: true });
  };

  useEffect(() => {
    const view = (el: HTMLElement, e?: MouseEvent) => {
      const img = el.querySelector("img"), studio = isStudio();
      if (!img) return;
      opener.current = el;
      if (studio) pop();
      else burst(...(e && e.clientX ? [e.clientX, e.clientY] as const : centerOf(el)), 6);
      setTimeout(() => {
        isOpen.current = true;
        setShot({ src: img.src, alt: img.alt, cap: el.dataset.cap || "", no: el.dataset.no || "" });
      }, studio ? 120 : 250);
    };
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element).closest<HTMLElement>("[data-zoom]");
      if (el) view(el, e);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return close();
      const el = (e.target as Element).closest?.<HTMLElement>("[data-zoom]");
      if (el && el.tagName !== "BUTTON" && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); view(el); }
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="lightbox" id="lb" hidden={!shot} onClick={close}>
      <figure>
        {shot && <img id="lbimg" src={shot.src} alt={shot.alt} />}
        <figcaption id="lbcap">{shot?.cap}</figcaption>
        <span className="label" id="lbno">{shot?.no}</span>
      </figure>
    </div>
  );
}
