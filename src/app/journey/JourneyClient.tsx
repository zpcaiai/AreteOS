"use client";

import { PageHeader } from "@/components/ui";
import { useI18n, useT } from "@/lib/i18n/client";
import JourneyTiles from "@/components/JourneyTiles";

export default function JourneyPage() {
  const { locale } = useI18n();
  const T = useT();
  return (
    <div>
      <PageHeader title={T("成长全景", "Journey · mission control")} subtitle={T("把整个成长闭环的状态聚合到一页 —— 诊断、处方、练习、资产、资本、身份。", "Every engine in the loop, aggregated on one page — diagnose, prescribe, practice, assets, capital, identity.")} />
      <JourneyTiles />
    </div>
  );
}
