import { describe, expect, it } from "vitest";
import { DICTIONARIES, isLocale } from "../src/lib/i18n/dictionaries";

describe("i18n dictionaries", () => {
  it("en mirrors every zh key with a non-empty translation", () => {
    const zhKeys = Object.keys(DICTIONARIES.zh);
    for (const key of zhKeys) {
      const value = (DICTIONARIES.en as Record<string, string>)[key];
      expect(value, `missing en translation for ${key}`).toBeTruthy();
    }
    expect(Object.keys(DICTIONARIES.en)).toHaveLength(zhKeys.length);
  });

  it("validates locales", () => {
    expect(isLocale("zh")).toBe(true);
    expect(isLocale("en")).toBe(true);
    expect(isLocale("fr")).toBe(false);
    expect(isLocale(undefined)).toBe(false);
  });
});
