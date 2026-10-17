"use client";
// Little effects shared by every view: floating heart bursts and the camera flash.
export const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
export const isStudio = () => document.body.classList.contains("studio");
export const centerOf = (el: Element): [number, number] => {
  const r = el.getBoundingClientRect();
  return [r.left + r.width / 2, r.top + r.height / 2];
};

const heart = (c: string) => `<svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true"><path fill="${c}" d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.2 4.4 2.5.8-1.3 2.3-2.5 4.4-2.5 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z"/></svg>`;

// Fire-and-forget: each heart is appended to <body> and removes itself after its animation.
export function burst(x: number, y: number, n = 8) {
  if (reducedMotion()) return;
  const colors = isStudio() ? ["#ff4d6d", "#ece4dc", "#e7893a", "#ff8fa3"] : ["#f497b6", "#9fd7ee", "#f7b5c9", "#7cc6e6"];
  for (let i = 0; i < n; i++) {
    const h = document.createElement("div");
    h.className = "float";
    h.innerHTML = heart(colors[i % colors.length]);
    h.style.left = (x - 13) + "px"; h.style.top = (y - 13) + "px";
    h.style.setProperty("--dx", (Math.random() * 160 - 80) + "px");
    h.style.setProperty("--rot", (Math.random() * 60 - 30) + "deg");
    h.style.animationDelay = (i * 40) + "ms";
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 1700);
  }
}

// Camera flash (photoshoot view): restarts the .flash animation.
export function pop() {
  const flash = document.getElementById("flash");
  if (!flash) return;
  flash.classList.remove("go");
  void flash.offsetWidth;
  flash.classList.add("go");
}
