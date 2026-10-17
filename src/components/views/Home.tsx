import { Amp } from "@/components/Amp";
import { Stack } from "@/components/Stack";

export function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">welcome to our tiny corner of the internet</span>
          <h1>you <Amp>&amp;</Amp> me</h1>
          <p className="sub">five favorite pictures, two little photo books, and a few notes i meant to say out loud.</p>
          <div className="hero-actions">
            <a className="btn" href="#scrapbook">open the scrapbook →</a>
            <a className="btn ghost" href="#notes">read the notes ♡</a>
          </div>
        </div>
        <Stack />
      </section>

      <section className="doors" aria-label="Pages">
        <a className="door taped pink" href="#scrapbook" style={{ "--tr": "4deg" } as React.CSSProperties}>
          <span className="peek peek-scrap" aria-hidden="true">
            <img src="/images/sidewalk.jpg" alt="" />
            <img src="/images/plush.jpg" alt="" />
          </span>
          <h2>the scrapbook</h2>
          <p>taped polaroids, a little note, and a button for sending hearts</p>
          <span className="go">open it →</span>
        </a>
        <a className="door taped blue" href="#photoshoot">
          <span className="peek peek-studio" aria-hidden="true">
            <span className="mini-strip">
              <img src="/images/festival.jpg" alt="" />
              <img src="/images/couch.jpg" alt="" />
              <img src="/images/gum.jpg" alt="" />
            </span>
          </span>
          <h2>the photoshoot</h2>
          <p>a film contact sheet, a cover shot and a photobooth strip</p>
          <span className="go">roll film →</span>
        </a>
        <a className="door taped" href="#notes" style={{ "--tr": "-5deg" } as React.CSSProperties}>
          <span className="peek peek-notes" aria-hidden="true"><span className="mini-env"></span></span>
          <h2>little notes</h2>
          <p>our day counter, a note wall, reasons i like you, and open-when letters</p>
          <span className="go">read them →</span>
        </a>
      </section>

      <p className="site-foot">made with ♡ in ulaanbaatar, for my favorite person</p>
    </>
  );
}
