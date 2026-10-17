"use client";
// Home: the polaroid pile. The first card is the top one; tapping it flies it off and tucks it
// under the pile. Only that card's DOM node moves, so the rest of the pile animates up a step.
import { useState } from "react";
import { burst, centerOf, reducedMotion } from "@/lib/fx";

const CARDS = [
  { src: "/images/sidewalk.jpg", alt: "Silly selfie together on a sunny sidewalk", cap: "tongues out, perfect day" },
  { src: "/images/plush.jpg", alt: "Cheek to cheek holding a fluffy blue plush", cap: "our fluffy blue son" },
  { src: "/images/festival.jpg", alt: "Mirror selfie together at a night festival", cap: "festival night" },
  { src: "/images/gum.jpg", alt: "Two packs of gum, one red and one blue, in two hands", cap: "matching, obviously" },
  { src: "/images/couch.jpg", alt: "Cozy selfie on the couch with a peace sign", cap: "couch days" },
];

export function Stack() {
  const [order, setOrder] = useState(() => CARDS.map((_, i) => i));
  const [flying, setFlying] = useState(false);

  const shuffle = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (flying) return;
    setFlying(true);
    burst(...(e.clientX ? [e.clientX, e.clientY] as const : centerOf(e.currentTarget)), 5);
    setTimeout(() => {
      setOrder((o) => [...o.slice(1), o[0]]);
      setFlying(false);
    }, reducedMotion() ? 0 : 380);
  };

  return (
    <div className="stack-wrap">
      <button className="stack" type="button" aria-label="Photo stack. Tap to shuffle to the next picture" onClick={shuffle}>
        {order.map((i, pos) => (
          <span key={i} className={pos === 0 && flying ? "card fly" : "card"}>
            <img src={CARDS[i].src} alt={CARDS[i].alt} /><span>{CARDS[i].cap}</span>
          </span>
        ))}
      </button>
      <p className="stack-hint">tap the pile to shuffle ↻</p>
    </div>
  );
}
