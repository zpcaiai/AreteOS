import { expect, test } from "@playwright/test";

test.use({ storageState: { cookies: [], origins: [] } });

test("login retains typography, form spacing and light/dark surfaces", async ({ page }) => {
  await page.goto("/login");
  const email = page.locator('input[type="email"]');
  const password = page.locator('input[type="password"]');
  const card = page.getByRole("heading", { name: "ARETE", exact: true }).locator("..");
  await expect(email).toBeVisible();
  await expect(email).toHaveCSS("font-size", "14px");
  await expect(email).toHaveCSS("line-height", "20px");
  await expect(email).toHaveCSS("border-radius", "8px");
  await expect(card).toHaveCSS("padding", "32px");
  await expect(card).toHaveCSS("border-radius", "16px");
  await expect(page.locator("h1")).toHaveCSS("font-family", /EB Garamond/);
  await expect(page.locator("body")).toHaveCSS("font-family", /Inter/);
  const first = (await email.boundingBox())!;
  const second = (await password.boundingBox())!;
  expect(second.y - first.y - first.height).toBeCloseTo(12, 0);
  expect(first.width).toBeGreaterThan(200);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

  await page.getByRole("button", { name: "Switch to light theme" }).first().click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(244, 246, 251)");
  await expect(email).toHaveCSS("background-color", "rgb(238, 242, 247)");
  await expect(email).toHaveCSS("color", "rgb(15, 23, 42)");
  await page.getByRole("button", { name: "Switch to dark theme" }).first().click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(email).not.toHaveCSS("background-color", "rgb(238, 242, 247)");
});

test("command palette retains backdrop blur and keyboard focus styles", async ({ page }) => {
  await page.goto("/login");
  await expect(page.locator("html")).toHaveAttribute("data-command-palette-ready", "true");
  await page.keyboard.press("Control+k");
  const dialog = page.getByRole("dialog", { name: /command palette|命令面板/i });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator("..")).toHaveCSS("backdrop-filter", "blur(4px)");
  const search = dialog.getByRole("combobox");
  await expect(search).toBeFocused();
  await expect(search).toHaveCSS("outline-style", "none");
  // Forced colors must expose a visible system-color outline for keyboard users.
  await page.emulateMedia({ forcedColors: "active" });
  await expect(search).toHaveCSS("outline-style", "solid");
  await expect(search).not.toHaveCSS("outline-color", "rgba(0, 0, 0, 0)");
  await expect(search).toHaveCSS("outline-width", "2px");
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
});
