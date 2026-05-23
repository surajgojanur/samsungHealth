import { expect, test } from "@playwright/test";

const forbiddenUserFacingPhrases = [
  "diagnosis",
  "disease",
  "you have",
  "heart problem",
  "dangerous condition",
  "emergency caused",
  "guaranteed",
  "proves"
];

test("doctor report page renders disclaimer", async ({ page }) => {
  await page.goto("/report");
  await expect(page.getByRole("heading", { name: "Doctor Report", exact: true })).toBeVisible();
  await expect(page.getByText("It does not diagnose, treat, or replace medical advice.").first()).toBeVisible();
});

test("release routes render core public copy", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Turn your Samsung Health export into private, understandable insights." })).toBeVisible();
  await expect(page.getByText("HealthLens is an independent open-source project and is not affiliated with Samsung.").first()).toBeVisible();

  await page.goto("/upload");
  await expect(page.getByRole("heading", { name: "Analyze your Samsung Health export" })).toBeVisible();
  await expect(page.getByText("Your data stays here.").first()).toBeVisible();
  await expect(page.getByText("No cloud, no tracking, no server upload by default.").first()).toBeVisible();

  await page.goto("/privacy");
  await expect(page.getByRole("heading", { name: "Privacy and trust" })).toBeVisible();
  await expect(page.getByText("Your files are processed entirely inside your browser.").first()).toBeVisible();
});

test("demo mode is clearly fake sample data and complete enough for visitors", async ({ page }) => {
  await page.goto("/demo");
  await expect(page.getByText("Sample data").first()).toBeVisible();
  await expect(page.getByText("You are viewing fake sample data. No personal health files are loaded.").first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Your Health Story" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Insight Hub" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Activity", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Heart", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sleep", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Workouts", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Symptom Pattern Timeline" }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Doctor report preview" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Data Detection" })).toBeVisible();
});

test("required release routes do not show forbidden medical phrases", async ({ page }) => {
  for (const route of ["/", "/upload", "/demo", "/dashboard", "/report", "/privacy", "/settings", "/debug/parser"]) {
    await page.goto(route);
    const text = (await page.locator("body").innerText()).toLowerCase();
    for (const phrase of forbiddenUserFacingPhrases) {
      if (phrase === "diagnosis" && text.includes("not a diagnosis tool")) continue;
      expect(text, `${route} should not show ${phrase}`).not.toContain(phrase);
    }
  }
});
