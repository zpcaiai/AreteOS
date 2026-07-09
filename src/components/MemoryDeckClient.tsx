"use client";

import { useMemo, useState } from "react";
import ShareCardModal from "@/components/ShareCardModal";
import { SuggestionField } from "@/components/SuggestionField";
import VirtualList from "@/components/VirtualList";
import { addMemoryCard, deckStats, getDeck, getDueCards, nextDueLabel, removeMemoryCard, reviewCard, type MemoryCard } from "@/lib/client/memory-deck";
import { useDraft } from "@/lib/client/useDraft";
import { useT } from "@/lib/i18n/client";

export default function MemoryDeckClient() {
  const T = useT();
  const [tick, setTick] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [mode, setMode] = useState<"review" | "all" | "new">("review");
  const [shareCard, setShareCard] = useState<MemoryCard | null>(null);
  const [draft, setDraft] = useState({ title: "", content: "", source: "" });
  const { savedHint, clearDraft } = useDraft("arete-memory-card-draft", draft, setDraft);

  const stats = useMemo(() => deckStats(), [tick]);
  const due = useMemo(() => getDueCards(), [tick]);
  const all = useMemo(() => getDeck().sort((a, b) => a.due - b.due), [tick]);
  const current = due[0] ?? null;

  function refresh() {
    setTick((value) => value + 1);
  }

  function grade(quality: 1 | 3 | 5) {
    if (!current) return;
    reviewCard(current.id, quality);
    setFlipped(false);
    refresh();
  }

  function createCard() {
    const ok = addMemoryCard(draft);
    if (ok) {
      setDraft({ title: "", content: "", source: "" });
      clearDraft();
      setMode("review");
      refresh();
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
      <aside className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <Stat label={T("卡片", "Cards")} value={stats.total} />
          <Stat label={T("待复习", "Due")} value={stats.due} tone="text-amber-300" />
          <Stat label={T("已掌握", "Mature")} value={stats.mature} tone="text-emerald-300" />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <Tab active={mode === "review"} onClick={() => setMode("review")}>{T("复习", "Review")}</Tab>
          <Tab active={mode === "all"} onClick={() => setMode("all")}>{T("卡组", "Deck")}</Tab>
          <Tab active={mode === "new"} onClick={() => setMode("new")}>{T("新建", "New")}</Tab>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-400">
          {T("用来记住 Arete 中真正值得内化的原则:复盘教训、决策规则、身份证明、长期游戏约束。", "Remember what is worth internalizing in Arete: review lessons, decision rules, identity proofs, long-term game constraints.")}
        </p>
      </aside>

      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        {mode === "review" && (
          <div>
            {!stats.total && <Empty title={T("还没有卡片", "No cards yet")} body={T("添加一条原则或教训,开始间隔重复。", "Add one principle or lesson to begin spaced repetition.")} />}
            {stats.total > 0 && !current && <Empty title={T("今天复习都完成了", "All reviews are done")} body={T("当前没有到期的卡片。新增一条教训,或稍后再来。", "No card is due right now. Add a new lesson or come back later.")} />}
            {current && (
              <div>
                <p className="mb-3 text-center text-sm text-slate-500">{T("待复习", "Due now")}: {due.length}</p>
                <button
                  onClick={() => setFlipped((value) => !value)}
                  className="min-h-64 w-full rounded-xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 to-emerald-500/10 p-6 text-center">
                  <div className="text-lg font-semibold text-slate-100">{current.title}</div>
                  {flipped ? (
                    <p className="mx-auto mt-5 max-w-2xl whitespace-pre-wrap text-base leading-8 text-slate-100">{current.content}</p>
                  ) : (
                    <p className="mt-5 text-sm text-slate-500">{T("先回忆这条原则,再翻开卡片。", "Recall the principle first, then flip the card.")}</p>
                  )}
                  {current.source && <p className="mt-5 text-xs uppercase tracking-wide text-slate-500">{current.source}</p>}
                </button>
                {!flipped ? (
                  <button onClick={() => setFlipped(true)} className="mt-3 w-full rounded-lg border border-slate-700 px-4 py-3 text-sm text-slate-200 hover:bg-slate-800">
                    {T("翻开", "Flip")}
                  </button>
                ) : (
                  <div className="mt-3 grid gap-2 sm:grid-cols-3">
                    <GradeButton label={T("忘记了", "Forgot")} detail={T("10 分钟", "10 min")} onClick={() => grade(1)} tone="rose" />
                    <GradeButton label={T("有点难", "Hard")} detail={T("短间隔", "short interval")} onClick={() => grade(3)} tone="amber" />
                    <GradeButton label={T("容易", "Easy")} detail={T("长间隔", "long interval")} onClick={() => grade(5)} tone="emerald" />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {mode === "all" && (
          <div>
            {!all.length && <Empty title={T("卡组是空的", "Deck is empty")} body={T("从一条复盘教训或决策规则创建卡片。", "Create a card from a reflection lesson or decision rule.")} />}
            <div className="space-y-2">
              <VirtualList
                items={all}
                estimatedHeight={96}
                keyOf={(card) => card.id}
                renderItem={(card) => (
                  <div className="mb-2 flex gap-3 rounded-lg border border-slate-800 bg-slate-950/50 p-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate text-sm font-semibold text-slate-100">{card.title}</h3>
                        <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] text-slate-400">{nextDueLabel(card)}</span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-400">{card.content}</p>
                    </div>
                    <button onClick={() => setShareCard(card)} className="h-9 rounded-lg border border-slate-700 px-3 text-xs text-slate-200 hover:bg-slate-800">{T("分享", "Share")}</button>
                    <button onClick={() => { removeMemoryCard(card.id); refresh(); }} className="h-9 rounded-lg border border-slate-700 px-3 text-xs text-rose-300 hover:bg-slate-800">{T("删除", "Delete")}</button>
                  </div>
                )}
              />
            </div>
          </div>
        )}

        {mode === "new" && (
          <div className="mx-auto max-w-2xl">
            <SuggestionField
              as="input"
              label={T("标题", "Title")}
              value={draft.title}
              onChange={(value) => setDraft({ ...draft, title: value })}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
              maxLength={120}
              chipLabel={T("标题备选", "Title options")}
              suggestions={[
                T("一个可复用的决策规则", "A reusable decision rule"),
                T("今天验证到的真实证据", "Real evidence validated today"),
                T("下次遇到类似问题先做什么", "What to do first next time"),
              ]}
            />
            <div className="mt-4">
              <SuggestionField
                label={T("原则或教训", "Principle or lesson")}
                value={draft.content}
                onChange={(value) => setDraft({ ...draft, content: value })}
                rows={6}
                className="mt-1 min-h-40 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm leading-6 text-slate-100"
                maxLength={2000}
                chipLabel={T("内容备选", "Content options")}
                suggestions={[
                  T("先完成一个可被用户验证的小结果，再继续扩展功能。", "Finish one user-verifiable small result before expanding features."),
                  T("如果一个行动不能留下证据，它就不能作为主要进展叙事。", "If an action leaves no evidence, it should not be the main progress narrative."),
                  T("把下一步缩小到 5/25/60 分钟之一，降低启动阻力。", "Shrink the next step to 5, 25, or 60 minutes to reduce activation friction."),
                ]}
              />
            </div>
            <div className="mt-4">
              <SuggestionField
                as="input"
                label={T("来源", "Source")}
                value={draft.source}
                onChange={(value) => setDraft({ ...draft, source: value })}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                maxLength={160}
                placeholder={T("复盘、决策回顾、书籍、教练对话……", "Reflection, decision review, book, coach session...")}
                chipLabel={T("来源备选", "Source options")}
                suggestions={[T("周复盘", "Weekly review"), T("教练对话", "Coach conversation"), T("用户验证", "User validation")]}
              />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-slate-500" aria-live="polite">{savedHint ? T("草稿已保存", "Draft saved") : ""}</span>
              <button onClick={createCard} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500">
                {T("添加卡片", "Add card")}
              </button>
            </div>
          </div>
        )}
      </section>

      {shareCard && (
        <ShareCardModal
          title={shareCard.title}
          content={shareCard.content}
          source={shareCard.source}
          onClose={() => setShareCard(null)}
        />
      )}
    </div>
  );
}

function Stat({ label, value, tone = "text-slate-100" }: { label: string; value: number; tone?: string }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
      <div className={`text-2xl font-bold tabular-nums ${tone}`}>{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}

function Tab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`rounded-lg px-3 py-2 text-xs font-medium ${active ? "bg-indigo-600 text-white" : "bg-slate-950 text-slate-400 hover:bg-slate-800"}`}>
      {children}
    </button>
  );
}

function Empty({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-700 p-10 text-center">
      <h3 className="text-base font-semibold text-slate-200">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{body}</p>
    </div>
  );
}

function GradeButton({ label, detail, tone, onClick }: { label: string; detail: string; tone: "rose" | "amber" | "emerald"; onClick: () => void }) {
  const classes = {
    rose: "border-rose-500/40 bg-rose-500/10 text-rose-200",
    amber: "border-amber-500/40 bg-amber-500/10 text-amber-200",
    emerald: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
  };
  return (
    <button onClick={onClick} className={`rounded-lg border px-4 py-3 text-sm font-medium ${classes[tone]}`}>
      {label}
      <span className="mt-0.5 block text-xs opacity-70">{detail}</span>
    </button>
  );
}
