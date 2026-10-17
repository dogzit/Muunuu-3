"use client";
// Views: #home, #scrapbook, #photoshoot, #notes. Every view is rendered up front and the
// URL hash picks which one is shown, so flipped cards and open letters survive switching.
import { useEffect, useSyncExternalStore, type ReactNode } from "react";

const VIEWS = ["home", "scrapbook", "photoshoot", "notes"] as const;
type ViewName = (typeof VIEWS)[number];

const subscribe = (cb: () => void) => {
  addEventListener("hashchange", cb);
  return () => removeEventListener("hashchange", cb);
};

function useView(): ViewName {
  const hash = useSyncExternalStore(subscribe, () => location.hash.slice(1), () => "");
  return VIEWS.find((v) => v === hash) ?? "home";
}

export function View({ name, children }: { name: ViewName; children: ReactNode }) {
  return <main className="wrap" data-view={name} hidden={useView() !== name}>{children}</main>;
}

const LINKS: [ViewName, string][] = [["scrapbook", "scrapbook"], ["photoshoot", "photoshoot"], ["notes", "notes"]];

export function Nav() {
  const view = useView();

  // the photoshoot wears the dark studio theme; every view starts at the top
  useEffect(() => {
    document.body.classList.toggle("studio", view === "photoshoot");
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [view]);

  const current = (name: ViewName) => (name === view ? "page" : undefined);
  return (
    <nav className="tinynav" aria-label="Pages">
      <a className="brand" href="#home" aria-current={current("home")}><span className="full">you </span><b>&amp;</b><span className="full"> me</span></a>
      {LINKS.map(([name, label]) => <a key={name} href={"#" + name} aria-current={current(name)}>{label}</a>)}
    </nav>
  );
}
