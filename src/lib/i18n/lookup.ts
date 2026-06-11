// Reverse-lookup translation: translate a string by its ENGLISH dictionary
// value instead of its key. This lets shared primitives (StudioSection,
// RunButton, AnalyzeBox…) translate the literals their callers pass in,
// without threading keys through every call site. Unknown strings pass
// through unchanged, so it is always safe.

import { DICTIONARIES, type Locale } from "./dictionaries";

let reverse: Map<string, string> | null = null;

function reverseMap(): Map<string, string> {
  if (!reverse) {
    reverse = new Map();
    for (const [key, value] of Object.entries(DICTIONARIES.en)) {
      if (!reverse.has(value)) reverse.set(value, key);
    }
  }
  return reverse;
}

/** Returns a translator: EN-valued string -> locale string (identity if unknown). */
export function txFor(locale: Locale): (s: string) => string {
  const dict = DICTIONARIES[locale] as Record<string, string>;
  const rev = reverseMap();
  return (s: string) => {
    const key = rev.get(s);
    return key ? dict[key] : s;
  };
}
