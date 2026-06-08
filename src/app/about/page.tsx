import Link from "next/link";
import Logo from "@/components/Logo";
import { Card, PageHeader } from "@/components/ui";

export const metadata = { title: "About Arete" };

const SUBBRANDS: { name: string; greek: string; meaning: string; module: string }[] = [
  { name: "Cosmos", greek: "κόσμος", meaning: "the ordered world — how you interpret reality", module: "Worldview OS" },
  { name: "Telos", greek: "τέλος", meaning: "purpose, the end something is for", module: "Mission" },
  { name: "Ethos", greek: "ἦθος", meaning: "character — the identities you live from", module: "Identity Library" },
  { name: "Phronesis", greek: "φρόνησις", meaning: "practical wisdom — judgment in action", module: "Cognitive OS" },
  { name: "Genius", greek: "genius (Lat.)", meaning: "the innate guiding spirit each person is born with", module: "Genius Kids" },
  { name: "Archon", greek: "ἄρχων", meaning: "the one who leads", module: "Leadership Leverage" },
  { name: "Oikos", greek: "οἶκος", meaning: "household — the root of 'economy', the art of stewardship", module: "Management OS" },
  { name: "Praxis", greek: "πρᾶξις", meaning: "turning principle into repeatable action", module: "Business Scaling (SFM)" },
  { name: "Mnemosyne", greek: "Μνημοσύνη", meaning: "memory, mother of the Muses — listen and internalize", module: "Audiobooks" },
];

export default function AboutPage() {
  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Logo size={72} />
        <div>
          <h1 className="text-3xl font-bold tracking-wide font-serif">ARETE</h1>
          <p className="text-sm italic text-slate-400">Become who you are.</p>
        </div>
      </div>

      <Card title="The name">
        <p className="text-sm leading-relaxed text-slate-300">
          <strong>Arete</strong> (ἀρετή, /ˈɑːrəteɪ/) is the ancient Greek word for <em>excellence</em> —
          the full realization of what a person or thing can become. For the Greeks, a knife's arete was
          its sharpness; a person's arete was the flourishing of their character and capabilities. That is
          exactly what this system is for: to help a human being — and the organizations they build —
          move from latent potential to realized excellence.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          The motto, <em>“Become who you are,”</em> is from the poet Pindar — <em>γένοιο οἷος ἐσσί</em>,
          “become such as you are, having learned what that is.” Growth here is not becoming someone else;
          it is the disciplined unfolding of who you already are.
        </p>
      </Card>

      <Card title="The lifecycle">
        <p className="text-sm leading-relaxed text-slate-300">
          Arete spans the whole arc of development: the child's <strong>Genius</strong> → the adult's
          <strong> Cosmos, Telos, Ethos</strong> and <strong>Phronesis</strong> → the organization's
          <strong> Archon, Oikos</strong> and <strong>Praxis</strong> → and finally <strong>Legacy</strong>.
          One operating system, from first curiosity to lasting contribution.
        </p>
      </Card>

      <Card title="The constellation of modules">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {SUBBRANDS.map((s) => (
            <div key={s.name} className="rounded-lg border border-slate-800 p-3">
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-slate-100 font-serif">{s.name}</span>
                <span className="text-xs text-slate-500">{s.greek}</span>
              </div>
              <div className="text-sm text-slate-300">{s.meaning}</div>
              <div className="mt-1 text-xs text-indigo-300">{s.module}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="What Arete is not">
        <p className="text-sm leading-relaxed text-slate-300">
          An original system inspired by widely-taught ideas — not affiliated with, endorsed by, or
          licensed from any author or rights-holder. The figures in our libraries are factual case studies
          and do not endorse this product. See <Link href="/about/attributions" className="text-indigo-400 underline">Attributions &amp; legal</Link>.
        </p>
      </Card>
    </div>
  );
}
