"use client";

// Shared 402 handling for the premium engines. When a gated endpoint returns
// "needs membership", show a friendly upgrade card instead of a raw error.

import { useEffect } from "react";
import { useI18n } from "@/lib/i18n/client";
import { track } from "@/lib/client/telemetry";

export function isUpgradeError(err: unknown): boolean {
  const m = err instanceof Error ? err.message : String(err ?? "");
  return /会员|升级|402|upgrade|payment required/i.test(m);
}

export function UpgradeNotice({ feature, tier = "Pro" }: { feature: string; tier?: string }) {
  const { t } = useI18n();
  useEffect(() => { track("upgrade_view", { feature, tier }); }, [feature, tier]);
  return (
    <div className="rounded-2xl border border-amber-700/40 bg-amber-950/30 p-5" role="status">
      <h3 className="text-sm font-semibold text-amber-300">{t("innov.upgrade.title").replace("{tier}", tier)}</h3>
      <p className="mt-1 text-sm text-slate-300">{t("innov.upgrade.body").replace("{feature}", feature)}</p>
      <a href="/membership" onClick={() => track("upgrade_click", { feature, tier })} className="mt-3 inline-block rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-500">
        {t("innov.upgrade.cta")}
      </a>
    </div>
  );
}
