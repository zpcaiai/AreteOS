import Link from "next/link";
import { DISCLAIMER_SHORT } from "@/lib/legal/attributions";

/** Site-wide footer notice. Keeps the "inspired by / no endorsement" framing visible. */
export default function Disclaimer({ variant = "footer" }: { variant?: "footer" | "inline" }) {
  if (variant === "inline") {
    return (
      <p className="mt-4 rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2 text-xs text-slate-500">
        {DISCLAIMER_SHORT} <Link href="/about/attributions" className="text-slate-400 underline">Attributions</Link>
      </p>
    );
  }
  return (
    <footer className="mt-10 border-t border-slate-800 pt-4 text-xs text-slate-500">
      {DISCLAIMER_SHORT} <Link href="/about/attributions" className="text-slate-400 underline">Attributions &amp; legal</Link>
    </footer>
  );
}
