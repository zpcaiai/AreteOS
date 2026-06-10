// Server-side locale resolution (signed-cookie-free; plain preference cookie).
import { cookies } from "next/headers";
import { DEFAULT_LOCALE, DICTIONARIES, isLocale, type Dict, type DictKey, type Locale } from "./dictionaries";

export const LOCALE_COOKIE = "locale";

export async function getLocale(): Promise<Locale> {
  const jar = await cookies();
  const value = jar.get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export async function getDict(): Promise<{ locale: Locale; dict: Dict; t: (key: DictKey) => string }> {
  const locale = await getLocale();
  const dict = DICTIONARIES[locale];
  return { locale, dict, t: (key) => dict[key] };
}
