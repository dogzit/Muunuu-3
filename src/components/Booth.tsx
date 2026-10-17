"use client";
// Photoshoot: the photobooth strip. The shutter fires four quick flashes, shuffling the strip
// like a fresh round, and counts the rounds taken in this browser.
import { useState } from "react";
import { pop } from "@/lib/fx";
import { useStored } from "@/lib/store";

const SHOTS = [
  { src: "/images/sidewalk.jpg", alt: "Silly selfie on the sidewalk", cap: "sidewalk silliness" },
  { src: "/images/plush.jpg", alt: "Selfie with the blue plush", cap: "family portrait (with son)" },
  { src: "/images/festival.jpg", alt: "Night mirror selfie", cap: "festival mirror moment" },
  { src: "/images/couch.jpg", alt: "Couch selfie", cap: "couch, peace, us" },
];

export function Booth() {
  const [strip, setStrip] = useState(SHOTS);
  const [stored, setStored] = useStored("shots", "0");
  const shots = parseInt(stored, 10) || 0;

  const shoot = () => {
    setStored(String(shots + 1));
    const data = strip;
    for (let k = 0; k < 4; k++) setTimeout(() => {
      pop();
      setStrip((s) => s.map((d, j) => (j === k ? data[(k + 1) % data.length] : d)));
    }, k * 420);
  };

  return (
    <section className="booth" aria-label="Photobooth strip">
      <div className="booth-strip">
        {strip.map((d, k) => (
          <button key={k} type="button" data-zoom data-no={`Booth shot ${k + 1} / 4`} data-cap={d.cap}><img src={d.src} alt={d.alt} /></button>
        ))}
        <div className="stamp">you &amp; me · 4 shots</div>
      </div>
      <div className="booth-copy">
        <span className="label">Look 02 · photobooth</span>
        <h3>Four flashes, one strip</h3>
        <p>Black and white until you hover. Then it&apos;s every color of that day again. Press the shutter for another round.</p>
        <button className="shutter" id="shutter" type="button" onClick={shoot}><span className="dot"></span>Take another <output id="shots">· {shots}</output></button>
      </div>
    </section>
  );
}
