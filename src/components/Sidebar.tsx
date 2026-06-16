"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { useI18n, LanguageSwitcher } from "@/lib/i18n/client";
import type { DictKey } from "@/lib/i18n/dictionaries";

// Grouped by the product's development lifecycle. Classical sub-brand + plain function.
const GROUPS: { title: string; titleKey?: DictKey; items: { href: string; label: string; labelKey?: DictKey }[] }[] = [
  { title: "", items: [
    { href: "/dashboard", label: "Dashboard", labelKey: "nav.dashboard" },
    { href: "/start", label: "Start Here", labelKey: "nav.start" },
    { href: "/onboarding", label: "First Run · Full Loop", labelKey: "nav.onboarding" },
    { href: "/journey", label: "Journey · Mission Control", labelKey: "nav.journey" },
    { href: "/growth-map", label: "Growth Map", labelKey: "nav.growthMap" },
    { href: "/coach", label: "AI Coach", labelKey: "nav.coach" },
  ]},
  { title: "Innovation", titleKey: "nav.innovation", items: [
    { href: "/council", label: "Mentor Council", labelKey: "nav.council" },
    { href: "/future-self", label: "Future Self · Monte Carlo", labelKey: "nav.futureSelf" },
    { href: "/narrative", label: "Growth Narrative", labelKey: "nav.narrative" },
    { href: "/evidence", label: "Evidence · Gap", labelKey: "nav.evidence" },
    { href: "/experiments", label: "N-of-1 Experiments", labelKey: "nav.experiments" },
    { href: "/graph", label: "Knowledge Graph", labelKey: "nav.graph" },
    { href: "/account", label: "Account · Trust", labelKey: "nav.accountTrust" },
  ]},
  { title: "Diagnose & Decide", titleKey: "nav.diagnose", items: [
    { href: "/growth-protocol", label: "Growth Protocol", labelKey: "nav.growthProtocol" },
    { href: "/bottlenecks", label: "Bottleneck Diagnosis", labelKey: "nav.bottlenecks" },
    { href: "/prescriptions", label: "Growth Prescription", labelKey: "nav.prescriptions" },
    { href: "/boardroom", label: "Personal Boardroom", labelKey: "nav.boardroom" },
  ]},
  { title: "Identity & Life OS", titleKey: "nav.identityLifeos", items: [
    { href: "/personal-os", label: "Personal OS Compiler", labelKey: "nav.personalOs" },
    { href: "/specific-knowledge", label: "Specific Knowledge ★", labelKey: "nav.specificKnowledge" },
    { href: "/deep-work", label: "Deep Work ★", labelKey: "nav.deepWork" },
    { href: "/identity-tree", label: "Identity Evolution Tree", labelKey: "nav.identityTree" },
    { href: "/assets", label: "Asset-Based Growth", labelKey: "nav.assets" },
    { href: "/life-capital", label: "Life Capital Ledger", labelKey: "nav.lifeCapital" },
  ]},
  { title: "Skills Library", titleKey: "nav.skillsLibrary", items: [
    { href: "/skills", label: "All 20 engines · search", labelKey: "nav.skillsAll" },
  ]},

  { title: "Childhood", titleKey: "nav.childhood", items: [
    { href: "/genius", label: "Genius · Kids", labelKey: "nav.geniusKids" },
  ]},
  { title: "Foundation", titleKey: "nav.foundation", items: [
    { href: "/cosmos", label: "Cosmos · Worldview", labelKey: "nav.cosmos" },
    { href: "/cosmos/constellation", label: "Constellation", labelKey: "nav.constellation" },
  ]},
  { title: "Direction", titleKey: "nav.direction", items: [
    { href: "/telos", label: "Telos · Mission", labelKey: "nav.telos" },
    { href: "/identity", label: "Identity", labelKey: "nav.identity" },
    { href: "/ethos", label: "Ethos · Identity Library", labelKey: "nav.ethos" },
    { href: "/values", label: "Values", labelKey: "nav.values" },
    { href: "/beliefs", label: "Beliefs", labelKey: "nav.beliefs" },
  ]},
  { title: "Thinking", titleKey: "nav.thinking", items: [
    { href: "/phronesis", label: "Phronesis · Cognitive", labelKey: "nav.phronesis" },
    { href: "/psychology", label: "Psychology · CBT", labelKey: "nav.psychology" },
    { href: "/decisions", label: "Decisions", labelKey: "nav.decisions" },
    { href: "/role-models", label: "Role Models", labelKey: "nav.roleModels" },
    { href: "/genius-strategies", label: "Genius Strategies", labelKey: "nav.geniusStrategies" },
    { href: "/models", label: "Genius Library", labelKey: "nav.models" },
    { href: "/adaptation", label: "Adaptation", labelKey: "nav.adaptation" },
  ]},
  { title: "Execution", titleKey: "nav.execution", items: [
    { href: "/learning-path", label: "Learning Path", labelKey: "nav.learningPath" },
    { href: "/habits", label: "Habits", labelKey: "nav.habits" },
    { href: "/mastery", label: "Mastery", labelKey: "nav.mastery" },
    { href: "/reflection", label: "Reflection", labelKey: "nav.reflection" },
    { href: "/memory-deck", label: "Memory Deck", labelKey: "nav.memoryDeck" },
    { href: "/legacy", label: "Legacy", labelKey: "nav.legacy" },
  ]},
  { title: "Organization", titleKey: "nav.organization", items: [
    { href: "/archon", label: "Archon · Leadership", labelKey: "nav.archon" },
    { href: "/oikos", label: "Oikos · Management", labelKey: "nav.oikos" },
    { href: "/praxis", label: "Praxis · Scaling", labelKey: "nav.praxis" },
  ]},
  { title: "Naval Life OS", titleKey: "nav.naval", items: [
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
  { title: "Analytics", titleKey: "nav.analytics", items: [
    { href: "/reviews", label: "Reviews", labelKey: "nav.reviews" },
    { href: "/timeline", label: "Timeline", labelKey: "nav.timeline" },
    { href: "/twin", label: "Digital Twin", labelKey: "nav.digitalTwin" },
  ]},
  { title: "Library & Social", titleKey: "nav.library", items: [
    { href: "/mnemosyne", label: "Mnemosyne · Listen", labelKey: "nav.mnemosyne" },
    { href: "/community", label: "Agora · Community", labelKey: "nav.community" },
  ]},
  { title: "Account", titleKey: "nav.account", items: [
    { href: "/emporion", label: "Emporion · Store", labelKey: "nav.emporion" },
    { href: "/membership", label: "Membership", labelKey: "nav.membership" },
    { href: "/about", label: "About Arete", labelKey: "nav.about" },

    { href: "/admin", label: "管理后台 Admin", labelKey: "nav.admin" },
  ]},
];

export default function Sidebar() {
  const path = usePathname();
  const router = useRouter();
  const { t } = useI18n();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [mobileOpen, setMobileOpen] = useState(false);
  if (path === "/login") return null;

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

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
        <div className="mb-5 flex items-center justify-between">
          <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
            <Logo size={34} />
            <div>
              <div className="text-lg font-bold tracking-wide font-serif">ARETE</div>
              <div className="text-[10px] italic text-slate-500">Become who you are.</div>
            </div>
          </Link>
          <button aria-label="Close menu" onClick={() => setMobileOpen(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 lg:hidden">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /></svg>
          </button>
        </div>
        <nav aria-label="Primary" className="flex-1 space-y-3 overflow-y-auto pr-1">
          {GROUPS.map((g, gi) => {
            const open = !collapsed[g.title];
            return (
              <div key={g.title || gi}>
                {g.title && (
                  <button onClick={() => setCollapsed((c) => ({ ...c, [g.title]: !c[g.title] }))}
                    className="flex w-full items-center justify-between px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-300">
                    <span>{g.titleKey ? t(g.titleKey) : g.title}</span>
                    <span className="text-slate-600">{open ? "▾" : "▸"}</span>
                  </button>
                )}
                {open && (
                  <div className="mt-0.5 space-y-0.5">
                    {g.items.map((n) => {
                      const active = path === n.href || path.startsWith(n.href + "/");
                      return (
                        <Link key={n.href} href={n.href} onClick={() => setMobileOpen(false)}
                          aria-current={active ? "page" : undefined}
                          className={`block rounded-lg px-3 py-1.5 text-sm ${active ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-slate-800"}`}>
                          {n.labelKey ? t(n.labelKey) : n.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        <div className="mt-3 flex items-center justify-between">
          <button onClick={logout} className="rounded-lg px-3 py-2 text-left text-sm text-slate-400 hover:bg-slate-800">
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
