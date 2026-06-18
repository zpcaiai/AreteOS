"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n, useT } from "@/lib/i18n/client";
import { ALL_NAV, type NavItem } from "@/lib/nav";

/** Global ⌘K / Ctrl+K command palette: fuzzy-jump to any of the app's pages. */
export default function CommandPalette() {
  const router = useRouter();
  const { t } = useI18n();
  const T = useT();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const label = (it: NavItem) => (it.labelKey ? t(it.labelKey) : it.label);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQ("");
      setActive(0);
      const id = setTimeout(() => inputRef.current?.focus(), 0);
      return () => clearTimeout(id);
    }
  }, [open]);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    const items = query
      ? ALL_NAV.filter((it) => label(it).toLowerCase().includes(query) || it.href.toLowerCase().includes(query))
      : ALL_NAV;
    return items.slice(0, 50);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, t]);

  useEffect(() => { setActive(0); }, [q]);

  if (!open) return null;

  function go(it: NavItem) {
    setOpen(false);
    router.push(it.href);
  }

  return (
    <div
      className="fixed inset-0 z-[1500] flex items-start justify-center bg-slate-950/70 p-4 pt-[12vh] backdrop-blur-sm"
      onClick={() => setOpen(false)}>
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={T("命令面板", "Command palette")}>
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
            else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
            else if (e.key === "Enter" && results[active]) { e.preventDefault(); go(results[active]); }
          }}
          placeholder={T("跳转到任意页面…", "Jump to any page…")}
          aria-label={T("跳转到任意页面", "Jump to any page")}
          className="w-full border-b border-slate-800 bg-transparent px-4 py-3.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
        />
        <ul className="max-h-[50vh] overflow-y-auto p-2" role="listbox">
          {results.length ? (
            results.map((it, i) => (
              <li key={it.href} role="option" aria-selected={i === active}>
                <button
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(it)}
                  className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm ${
                    i === active ? "bg-indigo-600 text-white" : "text-slate-300"
                  }`}>
                  <span className="truncate">{label(it)}</span>
                  <span className={`shrink-0 font-mono text-[11px] ${i === active ? "text-indigo-200" : "text-slate-500"}`}>{it.href}</span>
                </button>
              </li>
            ))
          ) : (
            <li className="px-3 py-6 text-center text-sm text-slate-500">{T("没有匹配的页面", "No matching pages")}</li>
          )}
        </ul>
        <div className="flex items-center justify-between border-t border-slate-800 px-3 py-2 text-[11px] text-slate-500">
          <span>{T("↑↓ 选择 · ↵ 跳转 · esc 关闭", "↑↓ navigate · ↵ open · esc close")}</span>
          <span className="font-mono">⌘K</span>
        </div>
      </div>
    </div>
  );
}
