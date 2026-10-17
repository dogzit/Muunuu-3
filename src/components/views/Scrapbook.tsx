import { Amp } from "@/components/Amp";
import { HeartTally } from "@/components/HeartTally";

const vars = (v: Record<string, string>) => v as React.CSSProperties;

export function Scrapbook() {
  return (
    <>
      <header className="page-head">
        <span className="eyebrow">a tiny scrapbook of</span>
        <h1>you <Amp>&amp;</Amp> me</h1>
        <p className="sub">my favorite person, my favorite pictures</p>
      </header>

      <section className="board" aria-label="Photos">
        <figure className="pol a taped pink" tabIndex={0} data-zoom data-cap="tongues out, zero shame, perfect day" style={vars({ "--ar": "4/3", "--tr": "4deg" })}>
          <img src="/images/sidewalk.jpg" alt="Silly selfie together on a sunny sidewalk" />
          <figcaption>tongues out, zero shame, perfect day<span className="date">sunny sidewalk</span></figcaption>
          <span className="sticker s1" aria-hidden="true">♡</span>
        </figure>
        <figure className="pol b taped blue" tabIndex={0} data-zoom data-cap="we adopted a fluffy blue son" style={vars({ "--ar": "4/3" })}>
          <img src="/images/plush.jpg" alt="Cheek to cheek holding a fluffy blue plush" />
          <figcaption>we adopted a fluffy blue son<span className="date">family photo</span></figcaption>
        </figure>
        <figure className="pol c taped" tabIndex={0} data-zoom data-cap="one red, one blue. matching, obviously" style={vars({ "--ar": "3/4", "--tr": "6deg" })}>
          <img src="/images/gum.jpg" alt="Two packs of gum, one red and one blue, in two hands" />
          <figcaption>one red, one blue. matching, obviously<span className="date">split 50 / 50</span></figcaption>
        </figure>
        <figure className="pol d taped pink" tabIndex={0} data-zoom data-cap="festival night, wristband still on" style={vars({ "--ar": "9/16", "--tr": "-5deg" })}>
          <img src="/images/festival.jpg" alt="Mirror selfie together at a night festival" />
          <figcaption>festival night, wristband still on<span className="date">after dark</span></figcaption>
        </figure>
        <figure className="pol e taped blue" tabIndex={0} data-zoom data-cap="my favorite place is right here" style={vars({ "--ar": "16/9" })}>
          <img src="/images/couch.jpg" alt="Cozy selfie on the couch with a peace sign" />
          <figcaption>my favorite place is right here<span className="date">couch days</span></figcaption>
        </figure>
      </section>

      <div className="note">
        <p>out of everyone in the whole city,</p>
        <p>i&apos;m really glad it&apos;s you i get to be silly with.</p>
        <p>more snacks, more walks, more pictures pls.</p>
        <p className="sig">— me ♡</p>
      </div>

      <HeartTally />

      <p className="site-foot">next page: <a href="#photoshoot">the photoshoot →</a></p>
    </>
  );
}
