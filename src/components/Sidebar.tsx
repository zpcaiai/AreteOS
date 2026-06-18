"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { useI18n, useT, LanguageSwitcher } from "@/lib/i18n/client";
import type { DictKey } from "@/lib/i18n/dictionaries";

type Item = { href: string; label: string; labelKey?: DictKey };
type Group = { id: string; zh: string; en: string; items: Item[] };

// Always-visible daily entry points.
const PINNED: Item[] = [
  { href: "/dashboard", label: "Dashboard", labelKey: "nav.dashboard" },
  { href: "/journey", label: "Journey · Mission Control", labelKey: "nav.journey" },
  { href: "/coach", label: "AI Coach", labelKey: "nav.coach" },
];

// Thematic sections — collapsed by default; the active section auto-opens.
const GROUPS: Group[] = [
  { id: "start", zh: "开始", en: "Get started", items: [
    { href: "/start", label: "Start Here", labelKey: "nav.start" },
    { href: "/onboarding", label: "First Run · Full Loop", labelKey: "nav.onboarding" },
    { href: "/skills", label: "All 20 engines · search", labelKey: "nav.skillsAll" },
    { href: "/growth-map", label: "Growth Map", labelKey: "nav.growthMap" },
  ]},
  { id: "diagnose", zh: "诊断与成长", en: "Diagnose & grow", items: [
    { href: "/growth-protocol", label: "Growth Protocol", labelKey: "nav.growthProtocol" },
    { href: "/bottlenecks", label: "Bottleneck Diagnosis", labelKey: "nav.bottlenecks" },
    { href: "/prescriptions", label: "Growth Prescription", labelKey: "nav.prescriptions" },
    { href: "/boardroom", label: "Personal Boardroom", labelKey: "nav.boardroom" },
    { href: "/evidence", label: "Evidence · Gap", labelKey: "nav.evidence" },
    { href: "/experiments", label: "N-of-1 Experiments", labelKey: "nav.experiments" },
  ]},
  { id: "thinking", zh: "思维", en: "Thinking", items: [
    { href: "/phronesis", label: "Phronesis · Cognitive", labelKey: "nav.phronesis" },
    { href: "/psychology", label: "Psychology · CBT", labelKey: "nav.psychology" },
    { href: "/decisions", label: "Decisions", labelKey: "nav.decisions" },
    { href: "/models", label: "Genius Library", labelKey: "nav.models" },
    { href: "/role-models", label: "Role Models", labelKey: "nav.roleModels" },
    { href: "/genius-strategies", label: "Genius Strategies", labelKey: "nav.geniusStrategies" },
    { href: "/adaptation", label: "Adaptation", labelKey: "nav.adaptation" },
    { href: "/council", label: "Mentor Council", labelKey: "nav.council" },
    { href: "/future-self", label: "Future Self · Monte Carlo", labelKey: "nav.futureSelf" },
    { href: "/narrative", label: "Growth Narrative", labelKey: "nav.narrative" },
  ]},
  { id: "identity", zh: "身份与方向", en: "Identity & direction", items: [
    { href: "/personal-os", label: "Personal OS Compiler", labelKey: "nav.personalOs" },
    { href: "/identity-tree", label: "Identity Evolution Tree", labelKey: "nav.identityTree" },
    { href: "/telos", label: "Telos · Mission", labelKey: "nav.telos" },
    { href: "/identity", label: "Identity", labelKey: "nav.identity" },
    { href: "/ethos", label: "Ethos · Identity Library", labelKey: "nav.ethos" },
    { href: "/values", label: "Values", labelKey: "nav.values" },
    { href: "/beliefs", label: "Beliefs", labelKey: "nav.beliefs" },
    { href: "/cosmos", label: "Cosmos · Worldview", labelKey: "nav.cosmos" },
    { href: "/cosmos/constellation", label: "Constellation", labelKey: "nav.constellation" },
  ]},
  { id: "execution", zh: "执行与精通", en: "Execution & mastery", items: [
    { href: "/deep-work", label: "Deep Work ★", labelKey: "nav.deepWork" },
    { href: "/specific-knowledge", label: "Specific Knowledge ★", labelKey: "nav.specificKnowledge" },
    { href: "/assets", label: "Asset-Based Growth", labelKey: "nav.assets" },
    { href: "/life-capital", label: "Life Capital Ledger", labelKey: "nav.lifeCapital" },
    { href: "/learning-path", label: "Learning Path", labelKey: "nav.learningPath" },
    { href: "/habits", label: "Habits", labelKey: "nav.habits" },
    { href: "/mastery", label: "Mastery", labelKey: "nav.mastery" },
    { href: "/reflection", label: "Reflection", labelKey: "nav.reflection" },
    { href: "/memory-deck", label: "Memory Deck", labelKey: "nav.memoryDeck" },
    { href: "/legacy", label: "Legacy", labelKey: "nav.legacy" },
  ]},
  { id: "naval", zh: "Naval 人生 OS", en: "Naval Life OS", items: [
    { href: "/naval", label: "Naval · Overview", labelKey: "nav.navalOverview" },
    { href: "/naval/dashboard", label: "Naval Dashboard", labelKey: "nav.navalDashboard" },
    { href: "/naval/onboarding", label: "Naval · Get set up", labelKey: "nav.navalOnboarding" },
    { href: "/naval/plan", label: "90-Day Plan", labelKey: "nav.navalPlan" },
    { href: "/naval/specific-knowledge", label: "Specific Knowledge", labelKey: "nav.navalSpecificKnowledge" },
    { href: "/naval/talent-stack", label: "Talent Stack", labelKey: "nav.navalTalentStack" },
    { href: "/naval/leverage", label: "Leverage", labelKey: "nav.navalLeverage" },
    { href: "/naval/judgment", label: "Judgment", labelKey: "nav.navalJudgment" },
    { href: "/naval/decision-journal", label: "Decision Journal", labelKey: "nav.navalDecisionJournal" },
    { href: "/naval/wealth", label: "Wealth Creation", labelKey: "nav.navalWealth" },
    { href: "/naval/assets", label: "Asset Builder", labelKey: "nav.navalAssets" },
    { href: "/naval/opportunities", label: "Opportunities", labelKey: "nav.navalOpportunities" },
    { href: "/naval/long-term-games", label: "Long-Term Games", labelKey: "nav.navalLongTermGames" },
    { href: "/naval/freedom", label: "Freedom", labelKey: "nav.navalFreedom" },
    { href: "/naval/happiness", label: "Happiness", labelKey: "nav.navalHappiness" },
    { href: "/naval/life-portfolio", label: "Life Portfolio", labelKey: "nav.navalLifePortfolio" },
    { href: "/naval/twin", label: "Naval Digital Twin", labelKey: "nav.navalTwin" },
  ]},
  { id: "org", zh: "组织", en: "Organization", items: [
    { href: "/archon", label: "Archon · Leadership", labelKey: "nav.archon" },
    { href: "/oikos", label: "Oikos · Management", labelKey: "nav.oikos" },
    { href: "/praxis", label: "Praxis · Scaling", labelKey: "nav.praxis" },
  ]},
  { id: "childhood", zh: "童年", en: "Childhood", items: [
    { href: "/genius", label: "Genius · Kids", labelKey: "nav.geniusKids" },
  ]},
  { id: "review", zh: "回顾与社区", en: "Review & community", items: [
    { href: "/reviews", label: "Reviews", labelKey: "nav.reviews" },
    { href: "/timeline", label: "Timeline", labelKey: "nav.timeline" },
    { href: "/twin", label: "Digital Twin", labelKey: "nav.digitalTwin" },
    { href: "/graph", label: "Knowledge Graph", labelKey: "nav.graph" },
    { href: "/mnemosyne", label: "Mnemosyne · Listen", labelKey: "nav.mnemosyne" },
    { href: "/community", label: "Agora · Community", labelKey: "nav.community" },
  ]},
  { id: "account", zh: "账户", en: "Account", items: [
    { href: "/account", label: "Account · Trust", labelKey: "nav.accountTrust" },
    { href: "/membership", label: "Membership", labelKey: "nav.membership" },
    { href: "/emporion", label: "Emporion · Store", labelKey: "nav.emporion" },
    { href: "/about", label: "About Arete", labelKey: "nav.about" },
    { href: "/admin", label: "管理后台 Admin", labelKey: "nav.admin" },
  ]},
];

const STORE_KEY = "arete-nav-open";

export default function Sidebar() {
  const path = usePathname();
  const router = useRouter();
  const { t } = useI18n();
  const T = useT();
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMobileOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [ready, setReady] = useState(false);

  const label = (it: Item) => (it.labelKey ? t(it.labelKey) : it.label);
  const isActive = (href: string) => path === href || path.startsWith(href + "/");
  const activeGroup = useMemo(
    () => GROUPS.find((g) => g.items.some((it) => isActive(it.href)))?.id,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [path],
  );

  // Hydrate open-state on the client; default to only the active section open.
  useEffect(() => {
    let stored: Record<string, boolean> = {};
    try { stored = JSON.parse(localStorage.getItem(STORE_KEY) || "{}"); } catch { /* ignore */ }
    setOpen({ ...stored, ...(activeGroup ? { [activeGroup]: true } : {}) });
    setReady(true);
  }, [activeGroup]);

  function toggle(id: string) {
    setOpen((o) => {
      const next = { ...o, [id]: !o[id] };
      try { localStorage.setItem(STORE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  if (path === "/login") return null;

  const query = q.trim().toLowerCase();
  const results = query
    ? [...PINNED, ...GROUPS.flatMap((g) => g.items)].filter(
        (it, i, arr) =>
          arr.findIndex((x) => x.href === it.href) === i &&
          (label(it).toLowerCase().includes(query) || it.href.toLowerCase().includes(query)),
      )
    : [];

  const linkCls = (active: boolean) =>
    `block truncate rounded-lg px-3 py-1.5 text-sm ${active ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-slate-800"}`;

  return (
    <>
      <div className="flex items-center gap-2 border-b border-slate-800 bg-slate-900/90 p-3 lg:hidden" style={{ position: "sticky", top: 0, zIndex: 30 }}>
        <button aria-label="Open menu" onClick={() => setMobileOpen(true)} className="rounded-lg p-1.5 text-slate-300 hover:bg-slate-800">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" /></svg>
        </button>
        <Logo size={24} />
        <span className="text-base font-bold tracking-wide font-serif">ARETE</span>
        <LanguageSwitcher className="ml-auto" />
      </div>

      {mobileOpen && <div onClick={() => setMobileOpen(false)} className="fixed inset-0 z-30 bg-black/50 lg:hidden" />}

      <aside className={`fixed inset-y-0 left-0 z-40 flex w-60 shrink-0 flex-col border-r border-slate-800 bg-slate-900 p-4 transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0 lg:bg-slate-900/50 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="mb-3 flex items-center justify-between">
          <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
            <Logo size={32} />
            <div>
              <div className="text-lg font-bold leading-none tracking-wide font-serif">ARETE</div>
              <div className="mt-0.5 text-[10px] italic text-slate-500">Become who you are.</div>
            </div>
          </Link>
          <button aria-label="Close menu" onClick={() => setMobileOpen(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 lg:hidden">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /></svg>
          </button>
        </div>

        <div className="relative mb-2">
          <svg className="pointer-events-none absolute left-2.5 top-2 h-4 w-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" strokeLinecap="round" /></svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={T("筛选页面…", "Filter pages…")}
            aria-label={T("筛选页面", "Filter pages")}
            className="w-full rounded-lg border border-slate-700 bg-slate-950/60 py-1.5 pl-8 pr-2 text-sm text-slate-200 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <nav aria-label="Primary" className="flex-1 space-y-1 overflow-y-auto pr-1">
          {query ? (
            results.length ? (
              results.map((it) => (
                <Link key={it.href} href={it.href} onClick={() => setMobileOpen(false)} aria-current={isActive(it.href) ? "page" : undefined} className={linkCls(isActive(it.href))}>
                  {label(it)}
                </Link>
              ))
            ) : (
              <p className="px-3 py-2 text-xs text-slate-500">{T("没有匹配的页面", "No matching pages")}</p>
            )
          ) : (
            <>
              <div className="mb-1 space-y-0.5">
                {PINNED.map((it) => (
                  <Link key={it.href} href={it.href} onClick={() => setMobileOpen(false)} aria-current={isActive(it.href) ? "page" : undefined} className={linkCls(isActive(it.href))}>
                    {label(it)}
                  </Link>
                ))}
              </div>
              {GROUPS.map((g) => {
                const groupOpen = ready ? !!open[g.id] : g.id === activeGroup;
                const hasActive = g.items.some((it) => isActive(it.href));
                return (
                  <div key={g.id} className="pt-1">
                    <button
                      onClick={() => toggle(g.id)}
                      aria-expanded={groupOpen}
                      className={`flex w-full items-center justify-between rounded-md px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-colors hover:text-slate-200 ${hasActive ? "text-indigo-300" : "text-slate-500"}`}>
                      <span>{T(g.zh, g.en)}</span>
                      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${groupOpen ? "rotate-90" : ""}`}><path d="m9 6 6 6-6 6" /></svg>
                    </button>
                    {groupOpen && (
                      <div className="mt-0.5 space-y-0.5">
                        {g.items.map((it) => (
                          <Link key={it.href} href={it.href} onClick={() => setMobileOpen(false)} aria-current={isActive(it.href) ? "page" : undefined} className={linkCls(isActive(it.href))}>
                            {label(it)}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </nav>

        <div className="mt-3 flex items-center justify-between border-t border-slate-800 pt-3">
          <button onClick={logout} className="rounded-lg px-2.5 py-2 text-left text-sm text-slate-400 hover:bg-slate-800">
            {t("common.logout")}
          </button>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>
      </aside>
    </>
  );
}
