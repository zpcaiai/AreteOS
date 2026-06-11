import { describe, expect, it } from "vitest";
import { txFor } from "../src/lib/i18n/lookup";
import { DICTIONARIES } from "../src/lib/i18n/dictionaries";

describe("reverse-lookup translation (tx)", () => {
  it("translates known English strings to Chinese", () => {
    const tx = txFor("zh");
    expect(tx("Running…")).toBe("运行中…");
    expect(tx("Build Latticework")).toBe("构建格栅");
    expect(tx("Psychology Studio")).toBe("心理工作室");
  });

  it("is identity for English locale", () => {
    const tx = txFor("en");
    expect(tx("Build Latticework")).toBe("Build Latticework");
  });

  it("passes unknown strings through unchanged", () => {
    const tx = txFor("zh");
    expect(tx("some totally unknown literal")).toBe("some totally unknown literal");
    expect(tx("")).toBe("");
  });

  it("every studio long-tail key resolves through the reverse map", () => {
    const tx = txFor("zh");
    const en = DICTIONARIES.en as Record<string, string>;
    const zh = DICTIONARIES.zh as Record<string, string>;
    for (const key of Object.keys(en).filter((k) => k.startsWith("x."))) {
      // the first key owning an EN value wins in the reverse map; translated
      // output must still be a valid zh value from the dictionary
      const out = tx(en[key]);
      expect(Object.values(zh)).toContain(out);
    }
  });
});
