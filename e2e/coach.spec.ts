import { expect, test } from "@playwright/test";

test("coach: create a session and get a grounded reply", async ({ page }) => {
  await page.goto("/coach");
  await expect(page.getByRole("heading", { name: /AI Coach/i })).toBeVisible();

  await page.getByRole("button", { name: /^New$/ }).click();
  const input = page.getByLabel(/Message to coach/i);
  await expect(input).toBeEnabled();

  await input.fill("我的习惯坚持不下去，怎么办？");
  await page.getByRole("button", { name: /Send/i }).click();

  // Mock provider replies deterministically with data-grounded text.
  await expect(page.locator("section").getByText(/data|score|history|tell me/i).first()).toBeVisible({ timeout: 20_000 });
});

test("theme toggle and language switcher persist", async ({ page }) => {
  await page.goto("/dashboard");

  // Theme: toggling flips html[data-theme] and survives reload via cookie.
  const before = await page.evaluate(() => document.documentElement.dataset.theme);
  await page.getByRole("button", { name: /switch to (light|dark) theme/i }).click();
  const after = await page.evaluate(() => document.documentElement.dataset.theme);
  expect(after).not.toBe(before);
  await page.reload();
  expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe(after);

  // Locale: switching to EN re-renders server copy in English.
  await page.getByRole("button", { name: /^en$/i }).click();
  await expect(page.getByRole("heading", { name: /^Dashboard$/ })).toBeVisible();
  await page.getByRole("button", { name: /^zh$/i }).click();
  await expect(page.getByRole("heading", { name: /总览/ })).toBeVisible();
});

test("what-if simulator projects a growth curve", async ({ page }) => {
  await page.goto("/twin");
  await expect(page.getByText(/What-if projection/i)).toBeVisible();
  await page.getByRole("button", { name: /Project growth/i }).click();
  await expect(page.getByRole("img", { name: /Projected growth curve/i })).toBeVisible({ timeout: 15_000 });
});
