import { test, expect } from "@playwright/test";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
test.describe("SignUpForm Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Navigiere zur Sign-Up-Seite
    await page.goto("http://localhost:3000/auth/signup");
  });
  test.afterEach(async () => {
    await prisma.user.deleteMany({
      where: {
        email: "testuser@example.com",
      },
    });
  });

  test("should validate form fields and sign up successfully", async ({
    page,
  }) => {
    const usernameInput = page.locator('input[placeholder="Username"]');
    const emailInput = page.locator('input[placeholder="Email"]');
    const passwordInput = page.locator('input[placeholder="Password"]');
    const confirmPasswordInput = page.locator(
      'input[placeholder="Confirm Password"]',
    );
    const signUpButton = page.locator('button:has-text("Sign Up")');
    const strengthBar = page.locator("div.h-2");

    // Eingabefelder ausfüllen
    await usernameInput.fill("testuser");
    await emailInput.fill("testuser@example.com");

    // Schwaches Passwort eingeben
    await passwordInput.fill("1234");
    await confirmPasswordInput.fill("1234");

    // Prüfen, ob der Stärke-Balken rot ist
    await expect(strengthBar).toHaveClass(/bg-red-500/);

    // Stärkeres Passwort eingeben
    await passwordInput.fill("aiwdbzhawdbhjkwahudawdbhj!");
    await confirmPasswordInput.fill("aiwdbzhawdbhjkwahudawdbhj!");

    // Prüfen, ob der Stärke-Balken grün wird
    await expect(strengthBar).toHaveClass(/bg-green-500/);

    // Prüfen, ob der Sign-Up-Button aktiviert ist
    await expect(signUpButton).toBeEnabled();

    // Formular absenden
    await signUpButton.click();

    // Erfolgreiche Weiterleitung überprüfen
    await page.waitForURL("http://localhost:3000/auth/signin", {
      timeout: 60000,
    }); // Zielseite nach erfolgreicher Anmeldung
    await expect(page).toHaveURL(/\/auth\/signin/);
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
