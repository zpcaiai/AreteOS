import { expect, test } from "@playwright/test";

const PALETTE = /command palette|命令面板/i;

test("command palette (⌘K) opens, filters, jumps, and closes", async ({ page }) => {
  await page.goto("/dashboard");

  // Open via keyboard shortcut (component listens for meta OR ctrl + k).
  await page.keyboard.press("Control+k");
  const dialog = page.getByRole("dialog", { name: PALETTE });
  await expect(dialog).toBeVisible();

  // Filtering by route narrows the list, Enter opens the top hit.
  await page.getByRole("textbox", { name: /jump to any page|跳转到任意页面/i }).fill("naval");
  await expect(dialog.getByRole("option").first()).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/naval/);

  // Esc dismisses without navigating.
  await page.keyboard.press("Control+k");
  await expect(page.getByRole("dialog", { name: PALETTE })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: PALETTE })).toHaveCount(0);
});
