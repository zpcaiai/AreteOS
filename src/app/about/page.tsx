import Link from "next/link";
import Logo from "@/components/Logo";
import { Card } from "@/components/ui";
import { getDict } from "@/lib/i18n/server";

export const metadata = { title: "About Arete" };

const SUBBRANDS: { name: string; greek: string; meaning: string; meaningZh: string; module: string }[] = [
  { name: "Cosmos", greek: "κόσμος", meaning: "the ordered world — how you interpret reality", meaningZh: "有序的世界——你如何解读现实", module: "Worldview OS" },
  { name: "Telos", greek: "τέλος", meaning: "purpose, the end something is for", meaningZh: "目的——事物为之存在的终点", module: "Mission" },
  { name: "Ethos", greek: "ἦθος", meaning: "character — the identities you live from", meaningZh: "品格——你以之生活的身份", module: "Identity Library" },
  { name: "Phronesis", greek: "φρόνησις", meaning: "practical wisdom — judgment in action", meaningZh: "实践智慧——行动中的判断力", module: "Cognitive OS" },
  { name: "Genius", greek: "genius (Lat.)", meaning: "the innate guiding spirit each person is born with", meaningZh: "每个人与生俱来的守护精灵", module: "Genius Kids" },
  { name: "Archon", greek: "ἄρχων", meaning: "the one who leads", meaningZh: "领路之人", module: "Leadership Leverage" },
  { name: "Oikos", greek: "οἶκος", meaning: "household — the root of 'economy', the art of stewardship", meaningZh: "家宅——『经济』一词的词根，治理的艺术", module: "Management OS" },
  { name: "Praxis", greek: "πρᾶξις", meaning: "turning principle into repeatable action", meaningZh: "把原则变成可重复的行动", module: "Business Scaling (SFM)" },
  { name: "Mnemosyne", greek: "Μνημοσύνη", meaning: "memory, mother of the Muses — listen and internalize", meaningZh: "记忆女神，缪斯之母——倾听并内化", module: "Audiobooks" },
];

export default async function AboutPage() {
  const { locale, t } = await getDict();
  const zh = locale === "zh";
  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Logo size={72} />
        <div>
          <h1 className="text-3xl font-bold tracking-wide font-serif">ARETE</h1>
          <p className="text-sm italic text-slate-400">{t("common.appTagline")}</p>
        </div>
      </div>

      <Card title={t("card.the_name")}>
        {zh ? (
          <>
            <p className="text-sm leading-relaxed text-slate-300">
              <strong>Arete</strong>（ἀρετή）是古希腊语中的<em>卓越</em>——一个人或一件事物所能成为的最充分实现。
              对希腊人来说，一把刀的 arete 是它的锋利；一个人的 arete 是其品格与能力的全面绽放。
              这正是这套系统的使命：帮助一个人——以及他们所建立的组织——从潜在可能走向实现了的卓越。
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              箴言<em>「成为你本来所是的样子」</em>出自诗人品达——<em>γένοιο οἷος ἐσσί</em>，
              「在认识了自己是什么之后，成为那样的自己。」这里的成长不是变成别人，
              而是有纪律地展开你本来已是的那个人。
            </p>
          </>
        ) : (
          <>
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
          </>
        )}
      </Card>

      <Card title={t("card.the_lifecycle")}>
        {zh ? (
          <p className="text-sm leading-relaxed text-slate-300">
            Arete 覆盖发展的完整弧线：孩子的 <strong>Genius</strong> → 成年人的
            <strong> Cosmos、Telos、Ethos</strong> 与 <strong>Phronesis</strong> → 组织的
            <strong> Archon、Oikos</strong> 与 <strong>Praxis</strong> → 最终到 <strong>Legacy（传承）</strong>。
            一套操作系统，从最初的好奇心到持久的贡献。
          </p>
        ) : (
          <p className="text-sm leading-relaxed text-slate-300">
            Arete spans the whole arc of development: the child's <strong>Genius</strong> → the adult's
            <strong> Cosmos, Telos, Ethos</strong> and <strong>Phronesis</strong> → the organization's
            <strong> Archon, Oikos</strong> and <strong>Praxis</strong> → and finally <strong>Legacy</strong>.
            One operating system, from first curiosity to lasting contribution.
          </p>
        )}
      </Card>

      <Card title={t("card.the_constellation_of_modules")}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {SUBBRANDS.map((s) => (
            <div key={s.name} className="rounded-lg border border-slate-800 p-3">
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-slate-100 font-serif">{s.name}</span>
                <span className="text-xs text-slate-500">{s.greek}</span>
              </div>
              <div className="text-sm text-slate-300">{zh ? s.meaningZh : s.meaning}</div>
              <div className="mt-1 text-xs text-indigo-300">{s.module}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card title={t("card.what_arete_is_not")}>
        {zh ? (
          <p className="text-sm leading-relaxed text-slate-300">
            这是一套受到广为流传的思想启发的原创系统——与任何作者或版权方均无隶属、背书或授权关系。
            库中出现的人物是事实性的案例研究，并不为本产品背书。
            详见<Link href="/about/attributions" className="text-indigo-400 underline">致谢与法律声明</Link>。
          </p>
        ) : (
          <p className="text-sm leading-relaxed text-slate-300">
            An original system inspired by widely-taught ideas — not affiliated with, endorsed by, or
            licensed from any author or rights-holder. The figures in our libraries are factual case studies
            and do not endorse this product. See <Link href="/about/attributions" className="text-indigo-400 underline">Attributions &amp; legal</Link>.
          </p>
        )}
      </Card>
    </div>
  );
}
