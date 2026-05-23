import { expect, test } from "@playwright/test";

test("doctor report page renders disclaimer", async ({ page }) => {
  await page.goto("/report");
  await expect(page.getByText("Doctor Report")).toBeVisible();
  await expect(page.getByText("It does not diagnose, treat, or replace medical advice.")).toBeVisible();
});

