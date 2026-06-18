"use client";

// Client-side i18n. The provider holds locale in client state and looks the
// dictionary up on the client, so switching language flips every client
// component INSTANTLY; router.refresh() then reconciles server-rendered strings
// in the background (no blocking re-render on click).

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { DEFAULT_LOCALE, DICTIONARIES, type Dict, type DictKey, type Locale } from "./dictionaries";
import { txFor } from "./lookup";

interface I18nValue {
  locale: Locale;
  t: (key: DictKey) => string;
  setLocale: (next: Locale) => void;
}

const I18nContext = createContext<I18nValue>({
  locale: DEFAULT_LOCALE,
  t: (key) => DICTIONARIES[DEFAULT_LOCALE][key],
  setLocale: () => {},
});

export function I18nProvider({ locale: initialLocale, children }: { locale: Locale; dict?: Dict; children: ReactNode }) {
  const router = useRouter();
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const setLocale = useCallback(
    (next: Locale) => {
      if (next === locale) return;
      setLocaleState(next); // instant: every client component re-renders now
      try {
        document.cookie = `locale=${next}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
      } catch {
        /* ignore */
      }
      router.refresh(); // reconcile server-rendered strings in the background
    },
    [locale, router],
  );
  const dict = DICTIONARIES[locale];
  return <I18nContext.Provider value={{ locale, t: (key) => dict[key], setLocale }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}

/** Bilingual helper bound to the current locale: T("中文", "English"). */
export function useT() {
  const { locale } = useContext(I18nContext);
  return (zh: string, en: string) => (locale === "en" ? en : zh);
}

/** Translate by ENGLISH dictionary value (identity for unknown strings). */
export function useTx() {
  const { locale } = useContext(I18nContext);
  return txFor(locale);
}

const LOCALE_LABELS: Record<Locale, string> = { zh: "中文", en: "EN" };

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, t, setLocale } = useI18n();
  return (
    <div
      className={`inline-flex items-center rounded-full border border-slate-700 bg-slate-800/60 p-0.5 ${className}`}
      role="group"
      aria-label={t("common.language")}>
      {(["zh", "en"] as Locale[]).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          aria-pressed={locale === l}
          className={`rounded-full px-2.5 py-1 text-xs font-medium leading-none transition-colors ${
            locale === l ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
          }`}>
          {LOCALE_LABELS[l]}
        </button>
      ))}
    </div>
  );
}
