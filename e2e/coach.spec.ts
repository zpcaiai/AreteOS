import { expect, test } from "@playwright/test";

test("coach: create a session and get a grounded reply", async ({ page }) => {
  await page.goto("/coach");
  await expect(page.getByRole("heading", { name: /AI (Coach|教练)/i })).toBeVisible();

  await page.getByRole("button", { name: /^(New|新会话)$/ }).click();
  const input = page.getByLabel(/Message to coach|发送给教练的消息/i);
  await expect(input).toBeEnabled();

  await input.fill("我的习惯坚持不下去，怎么办？");
  await page.getByRole("button", { name: /^(Send|发送)$/ }).click();

  // Mock provider replies deterministically with data-grounded text.
  await expect(page.locator("section").getByText(/data|score|history|tell me|数据|分数|历史|告诉我/i).first()).toBeVisible({ timeout: 20_000 });
});

test("theme toggle and language switcher persist", async ({ page }) => {
  await page.goto("/dashboard");
  const mobile = (page.viewportSize()?.width ?? 1280) < 1024;
  const activeControl = <T extends ReturnType<typeof page.locator>>(controls: T) =>
    mobile ? controls.first() : controls.last();

  // Theme: toggling flips html[data-theme] and survives reload via cookie.
  const before = await page.evaluate(() => document.documentElement.dataset.theme);
  const after = before === "light" ? "dark" : "light";
  await activeControl(page.locator('button[aria-label^="Switch to"]')).click({ force: true });
  await expect(page.locator("html")).toHaveAttribute("data-theme", after);
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", after);

  // Locale: switching to EN re-renders server copy in English.
  await activeControl(page.locator("button").filter({ hasText: /^EN$/i })).click({ force: true });
  await expect.poll(() => page.evaluate(() => document.cookie)).toContain("locale=en");
  await page.reload();
  await expect(page.getByRole("heading", { name: /^Dashboard$/ })).toBeVisible();
  await activeControl(page.locator("button").filter({ hasText: /^(ZH|中文)$/i })).click({ force: true });
  await expect.poll(() => page.evaluate(() => document.cookie)).toContain("locale=zh");
  await page.reload();
  await expect(page.getByRole("heading", { name: /总览/ })).toBeVisible();
});

test("what-if simulator projects a growth curve", async ({ page }) => {
  await page.goto("/twin");
  await expect(page.getByText(/What-if/i)).toBeVisible();
  await page.getByRole("button", { name: /(Project growth|投影成长)/ }).click();
  await expect(page.getByRole("img", { name: /Projected growth curve/i })).toBeVisible({ timeout: 15_000 });
});
