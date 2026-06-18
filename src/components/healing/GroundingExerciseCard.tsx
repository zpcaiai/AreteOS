"use client";

import { Card } from "@/components/ui";
import { useT } from "@/lib/i18n/client";

/** A single, calm grounding exercise. One thing on screen — used in stabilization. */
export default function GroundingExerciseCard({ text, grounding }: { text?: string; grounding?: string }) {
  const T = useT();
  const body = grounding ?? text;
  if (!body) return null;
  return (
    <Card title={T("60 秒稳定化", "60-second grounding")} accent="#34d399">
      <p className="text-sm leading-relaxed text-slate-200">{body}</p>
      <p className="mt-2 text-xs text-slate-500">{T("慢慢做。随时可以停下，或换一个练习。", "Go slowly. You can stop anytime, or switch exercises.")}</p>
    </Card>
  );
}
