import { expect, test } from "@playwright/test";

test("core app shell and Naval v2 entry points render", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });

  await page.goto("/");
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("main")).toContainText(/Arete|Dashboard|总览|Mission/i);

  await page.goto("/naval");
  await expect(page.getByRole("heading", { name: /Naval/i, level: 1 })).toBeVisible();
  const main = page.getByRole("main");
  await expect(main.getByRole("link", { name: /90-day plan|90 天计划/i })).toBeVisible();

  await main.getByRole("link", { name: /90-day plan|90 天计划/i }).click();
  await expect(page).toHaveURL(/\/naval\/plan$/);
  await expect(page.getByRole("main")).toContainText(/90|plan|day/i);

  expect(consoleErrors.filter((line) => !line.includes("favicon"))).toEqual([]);
});
