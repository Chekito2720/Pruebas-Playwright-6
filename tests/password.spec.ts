import { test, expect } from '@playwright/test';
import { GamePage } from '../src/pages/GamePage';
import {
  PASSWORD_ECHO, WEAK_PASSWORDS, INVALID_FLAG_COMBOS, VALID_PASSWORDS, buildPassword, PREFIX,
} from '../src/data/testData';

test.describe('Contraseña', () => {
  test.beforeEach(async ({ page }) => {
    const g = new GamePage(page);
    await g.openAndStart();
    await g.clearOverlays();
  });

  test('el campo es visible y editable', async ({ page }) => {
    const g = new GamePage(page);
    await expect(g.password).toBeVisible();
    await expect(g.password).toBeEditable();
  });

  test('el placeholder es "Choose Password"', async ({ page }) => {
    await expect(new GamePage(page).password).toHaveAttribute('placeholder', 'Choose Password');
  });

  test('el campo empieza vacío', async ({ page }) => {
    await expect(new GamePage(page).password).toHaveValue('');
  });

  test('se puede borrar con clear()', async ({ page }) => {
    const g = new GamePage(page);
    await g.password.fill('abc');
    await g.password.clear();
    await expect(g.password).toHaveValue('');
  });

  test('un segundo fill() sobrescribe el valor', async ({ page }) => {
    const g = new GamePage(page);
    await g.password.fill('primero');
    await g.password.fill('segundo');
    await expect(g.password).toHaveValue('segundo');
  });

  PASSWORD_ECHO.forEach((pw, i) => {
    test(`retiene el valor escrito #${i + 1} (${JSON.stringify(pw).slice(0, 24)})`, async ({ page }) => {
      const g = new GamePage(page);
      await g.password.fill(pw);
      await expect(g.password).toHaveValue(pw);
    });
  });

  WEAK_PASSWORDS.forEach((pw, i) => {
    test(`contraseña débil #${i + 1} (${JSON.stringify(pw)}) no avanza`, async ({ page }) => {
      const g = new GamePage(page);
      await g.fillCard1({ password: pw, email: PREFIX, domain: 'example', terms: true });
      await g.clickNext();
      expect(await g.isOnCard2()).toBe(false);
    });
  });

  INVALID_FLAG_COMBOS.forEach((f) => {
    const pw = buildPassword(f);
    const missing = [!f.prefix && 'prefijo-email', !f.upper && 'mayúscula', !f.digit && 'dígito', !f.cyr && 'cirílico']
      .filter(Boolean).join('+');
    test(`sin [${missing}] no avanza (${pw})`, async ({ page }) => {
      const g = new GamePage(page);
      await g.fillCard1({ password: pw, email: PREFIX, domain: 'example', terms: true });
      await g.clickNext();
      expect(await g.isOnCard2()).toBe(false);
    });
  });

  VALID_PASSWORDS.forEach((pw, i) => {
    test(`contraseña válida #${i + 1} (${pw}) avanza a la tarjeta 2`, async ({ page }) => {
      const g = new GamePage(page);
      await g.fillCard1({ password: pw, email: PREFIX, domain: 'example', terms: true });
      await g.clickNext();
      expect(await g.isOnCard2()).toBe(true);
    });
  });
});
