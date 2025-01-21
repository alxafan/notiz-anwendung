import { test, expect } from "@playwright/test";

test.describe("SignUpForm Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Navigiere zur Sign-Up-Seite
    await page.goto("http://localhost:3000/auth/signup");
  });

  test("should show error when passwords do not match", async ({ page }) => {
    const passwordInput = page.locator('input[placeholder="Password"]');
    const confirmPasswordInput = page.locator(
      'input[placeholder="Confirm Password"]',
    );
    const message = page.locator("text=Passwords do not match");

    // Unterschiedliche Passwörter eingeben
    await passwordInput.fill("ValidPassword123!");
    await confirmPasswordInput.fill("DifferentPassword123!");

    // Fehlermeldung prüfen
    await expect(message).toBeVisible();
  });

  test("should disable submit button when form is invalid", async ({
    page,
  }) => {
    const usernameInput = page.locator('input[placeholder="Username"]');
    const emailInput = page.locator('input[placeholder="Email"]');
    const passwordInput = page.locator('input[placeholder="Password"]');
    const confirmPasswordInput = page.locator(
      'input[placeholder="Confirm Password"]',
    );
    const signUpButton = page.locator('button:has-text("Sign Up")');

    // Unvollständige Felder ausfüllen
    await usernameInput.fill("u");
    await emailInput.fill("invalid-email");
    await passwordInput.fill("1234");
    await confirmPasswordInput.fill("");

    // Prüfen, ob der Button deaktiviert ist
    await expect(signUpButton).toBeDisabled();
  });

  test("should toggle password requirements dropdown", async ({ page }) => {
    const dropdownButton = page.locator("text=Passwortanforderungen anzeigen");
    const dropdownContent = page.locator("text=- Der Balken muss grün sein!");

    // Dropdown öffnen
    await dropdownButton.click();

    // Inhalt prüfen
    await expect(dropdownContent).toBeVisible();

    // Dropdown schließen
    await dropdownButton.click();
    await expect(dropdownContent).not.toBeVisible();
  });
});
