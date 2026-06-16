import Link from "next/link";
import { DISCLAIMER_SHORT, DISCLAIMER_SHORT_ZH } from "@/lib/legal/attributions";
import { getDict } from "@/lib/i18n/server";

/** Site-wide footer notice. Keeps the "inspired by / no endorsement" framing visible. */
export default async function Disclaimer({ variant = "footer" }: { variant?: "footer" | "inline" }) {
  const { locale } = await getDict();
  const en = locale === "en";
  const text = en ? DISCLAIMER_SHORT : DISCLAIMER_SHORT_ZH;
  if (variant === "inline") {
    return (
      <p className="mt-4 rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2 text-xs text-slate-500">
        {text} <Link href="/about/attributions" className="text-slate-400 underline">{en ? "Attributions" : "致谢"}</Link>
      </p>
    );
  }
  return (
    <footer className="mt-10 border-t border-slate-800 pt-4 text-xs text-slate-500">
      {text} <Link href="/about/attributions" className="text-slate-400 underline">{en ? "Attributions & legal" : "致谢与法律声明"}</Link>
    </footer>
  );
}
