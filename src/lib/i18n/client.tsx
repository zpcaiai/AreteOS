"use client";

// Client-side i18n: the layout passes the resolved locale + dictionary down so
// client components translate without another fetch, and the switcher just
// writes the preference cookie and refreshes server components.

import { createContext, useContext, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { DEFAULT_LOCALE, DICTIONARIES, type Dict, type DictKey, type Locale } from "./dictionaries";
import { txFor } from "./lookup";

interface I18nValue {
  locale: Locale;
  t: (key: DictKey) => string;
}

const I18nContext = createContext<I18nValue>({ locale: DEFAULT_LOCALE, t: (key) => DICTIONARIES[DEFAULT_LOCALE][key] });

export function I18nProvider({ locale, dict, children }: { locale: Locale; dict: Dict; children: ReactNode }) {
  return <I18nContext.Provider value={{ locale, t: (key) => dict[key] }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}

/** Translate by ENGLISH dictionary value (identity for unknown strings). */
export function useTx() {
  const { locale } = useContext(I18nContext);
  return txFor(locale);
}

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, t } = useI18n();
  const router = useRouter();

  function setLocale(next: Locale) {
    document.cookie = `locale=${next}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    router.refresh();
  }

  return (
    <div className={`flex items-center gap-1 ${className}`} role="group" aria-label={t("common.language")}>
      {(["zh", "en"] as Locale[]).map((l) => (
        <button
          key={l}
          onClick={() => setLocale(l)}
          aria-pressed={locale === l}
          className={`rounded px-2 py-0.5 text-[11px] uppercase tracking-wide ${locale === l ? "bg-slate-700 text-white" : "text-slate-500 hover:text-slate-300"}`}>
          {l}
        </button>
      ))}
    </div>
  );
}
