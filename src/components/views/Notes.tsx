import { Amp } from "@/components/Amp";
import { DaysCounter } from "@/components/DaysCounter";
import { Envelopes } from "@/components/Envelopes";
import { Flip } from "@/components/Flip";
import { NoteWall } from "@/components/NoteWall";

const REASONS = [
  "you make tongues-out selfies look like art",
  "you said yes to adopting a fluffy blue son",
  "you always split the gum 50 / 50",
  "festival nights are better with you",
  "the couch is my favorite place when you're on it",
  "you laugh at my worst jokes",
  "you make ordinary days feel like weekends",
  "out of the whole city, it's you",
];

const LETTERS = [
  {
    label: "open when you miss me",
    letter: (
      <>
        <h3>open when you miss me</h3>
        <img src="/images/couch.jpg" alt="Cozy selfie on the couch with a peace sign" />
        <p>here&apos;s the couch, here&apos;s us, here&apos;s proof.</p>
        <p>i&apos;m probably missing you right now too.</p>
        <p>text me. i&apos;ll send a silly selfie back.</p>
        <p className="sig">— me ♡</p>
      </>
    ),
  },
  {
    label: "open when you've had a bad day",
    letter: (
      <>
        <h3>open when you&apos;ve had a bad day</h3>
        <img src="/images/plush.jpg" alt="Cheek to cheek holding a fluffy blue plush" />
        <p>deep breath. our fluffy blue son believes in you.</p>
        <p>so do i. like, a lot.</p>
        <p>snacks are on me, and i&apos;ll listen as long as you want.</p>
        <p className="sig">— me ♡</p>
      </>
    ),
  },
  {
    label: "open when you can't sleep",
    letter: (
      <>
        <h3>open when you can&apos;t sleep</h3>
        <p>count hearts instead of sheep:</p>
        <p>one… two… i like you… three…</p>
        <img src="/images/sidewalk.jpg" alt="Silly selfie together on a sunny sidewalk" />
        <p>still awake? look at this face and try not to laugh.</p>
        <p className="sig">— me ♡</p>
      </>
    ),
  },
];

export function Notes() {
  return (
    <>
      <header className="page-head">
        <span className="eyebrow">things i don&apos;t say enough</span>
        <h1>little <Amp>♡</Amp> notes</h1>
        <p className="sub">tap, flip and open everything</p>
      </header>

      {/* fallback is the start date shown until the database (or this browser) has one */}
      <DaysCounter fallback="2026-07-28" />

      <section className="notes-section" aria-labelledby="wall-title">
        <h2 className="section-title" id="wall-title">our note wall</h2>
        <p className="section-sub">leave a little note. it stays up for both of us</p>
        <NoteWall />
      </section>

      <section className="notes-section" aria-labelledby="reasons-title">
        <h2 className="section-title" id="reasons-title">reasons i like you</h2>
        <p className="section-sub">a very incomplete list. tap a card to flip it</p>
        <div className="reasons">
          {REASONS.map((r, i) => <Flip key={r} n={i + 1}>{r}</Flip>)}
        </div>
      </section>

      <section className="notes-section" aria-labelledby="ow-title">
        <h2 className="section-title" id="ow-title">open when…</h2>
        <p className="section-sub">little letters for later. or now, i won&apos;t tell</p>
        <Envelopes letters={LETTERS} />
      </section>

      <p className="site-foot">that&apos;s all for now. <a href="#home">back to the start ♡</a></p>
    </>
  );
}
