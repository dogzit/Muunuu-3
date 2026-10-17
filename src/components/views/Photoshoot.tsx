import { Booth } from "@/components/Booth";

const FRAMES = [
  { src: "/images/sidewalk.jpg", alt: "Silly selfie together on a sunny sidewalk", cap: "tongues out, zero shame", mark: "pick" },
  { src: "/images/plush.jpg", alt: "Cheek to cheek holding a fluffy blue plush", cap: "we adopted a fluffy blue son", mark: "★" },
  { src: "/images/gum.jpg", alt: "Two packs of gum, one red and one blue, in two hands", cap: "one red, one blue. matching, obviously", mark: null },
  { src: "/images/festival.jpg", alt: "Mirror selfie together at a night festival", cap: "festival night, wristband still on", mark: "pick" },
  { src: "/images/couch.jpg", alt: "Cozy selfie on the couch with a peace sign", cap: "my favorite place is right here", mark: "♡" },
];

export function Photoshoot() {
  return (
    <>
      <header className="slate">
        <h1>The <em>you&nbsp;&amp;&nbsp;me</em> session<small>starring my favorite person</small></h1>
        <dl className="meta">
          <dt>Roll</dt><dd>01</dd>
          <dt>Exposures</dt><dd>5 / 5</dd>
          <dt>Models</dt><dd>us two</dd>
          <dt>Location</dt><dd>Ulaanbaatar</dd>
          <dt>Status</dt><dd className="rec">rolling</dd>
        </dl>
      </header>

      <section className="cover" aria-label="Cover shot">
        <figure className="shot" tabIndex={0} data-zoom data-cap="cover shot ♡" data-no="Frame 05 · keeper">
          <img src="/images/couch.jpg" alt="Cozy selfie on the couch with a peace sign" />
          <span className="cap">cover shot ♡</span>
          <span className="no">FRAME 05 · KEEPER</span>
        </figure>
        <div className="words">
          <span className="label">Look 01 · at home</span>
          <h2>Soft light, matching grey, zero effort</h2>
          <p>Director&apos;s note: no poses were planned. One peace sign, one arm around the shoulder, one perfect pout. Wrapped in a single take.</p>
          <span className="badge">the one</span>
        </div>
      </section>

      <section aria-label="Contact sheet">
        <div className="sheet-head">
          <h3>Contact sheet</h3>
          <span className="label">tap a frame to view · circled = keepers</span>
        </div>
        <div className="strip-scroll">
          <div className="strip">
            {FRAMES.map((f, i) => (
              <div key={f.src} className="frame" tabIndex={0} data-zoom data-no={`Frame 0${i + 1}`} data-cap={f.cap}>
                <span className="iso">ISO 400</span>
                <img src={f.src} alt={f.alt} />
                {f.mark === "pick" ? <span className="pick"></span> : f.mark && <span className="mark">{f.mark}</span>}
                <span className="fno">▸ 0{i + 1}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="note-line">↑ honestly every frame is a keeper</p>
      </section>

      <Booth />

      <footer>that&apos;s a wrap. <b>same time tomorrow?</b><br /><a href="#notes">read the notes →</a></footer>
    </>
  );
}
