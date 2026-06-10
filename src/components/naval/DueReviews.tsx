"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/client";

interface Due { id: string; title: string; reviewDate: string | null; confidence: number }

export default function DueReviews() {
  const { t } = useI18n();
  const [due, setDue] = useState<Due[] | null>(null);
  useEffect(() => {
    fetch("/api/naval/decision-journal/due").then((r) => (r.ok ? r.json() : null)).then((d) => d && setDue(d.due)).catch(() => {});
  }, []);

  if (!due) return null;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <h2 className="mb-2 text-sm font-semibold">{t("ui.due.title")} {due.length > 0 && <span className="ml-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-xs text-amber-300">{due.length}</span>}</h2>
      {due.length ? (
        <ul className="space-y-2 text-sm">
          {due.map((d) => (
            <li key={d.id} className="flex items-center justify-between border-t border-slate-800 pt-2">
              <span className="text-slate-200">{d.title}</span>
              <Link href="/naval/decision-journal" className="text-xs text-indigo-400 hover:text-indigo-300">{t("ui.due.review")}</Link>
            </li>
          ))}
        </ul>
      ) : <p className="text-sm text-slate-500">{t("ui.due.empty")}</p>}
    </div>
  );
}
