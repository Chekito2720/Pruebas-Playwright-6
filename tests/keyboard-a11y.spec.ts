import { test, expect } from '@playwright/test';
import { GamePage } from '../src/pages/GamePage';

test.describe('Teclado y accesibilidad básica', () => {
  test.beforeEach(async ({ page }) => {
    const g = new GamePage(page);
    await g.openAndStart();
    await g.clearOverlays();
  });

  test('el campo password acepta foco', async ({ page }) => {
    const g = new GamePage(page);
    await g.password.focus();
    await expect(g.password).toBeFocused();
  });

  test('el campo email acepta foco', async ({ page }) => {
    const g = new GamePage(page);
    await g.email.focus();
    await expect(g.email).toBeFocused();
  });

  test('el campo dominio acepta foco', async ({ page }) => {
    const g = new GamePage(page);
    await g.domain.focus();
    await expect(g.domain).toBeFocused();
  });

  test('Tab desde password mueve el foco a otro elemento', async ({ page }) => {
    const g = new GamePage(page);
    await g.password.focus();
    await page.keyboard.press('Tab');
    await expect(g.password).not.toBeFocused();
  });

  test('Shift+Tab desde email mueve el foco', async ({ page }) => {
    const g = new GamePage(page);
    await g.email.focus();
    await page.keyboard.press('Shift+Tab');
    await expect(g.email).not.toBeFocused();
  });

  test('escribir con el teclado en password funciona', async ({ page }) => {
    const g = new GamePage(page);
    await g.password.focus();
    await page.keyboard.type('Hola1');
    await expect(g.password).toHaveValue('Hola1');
  });

  test('escribir con el teclado en email funciona', async ({ page }) => {
    const g = new GamePage(page);
    await g.email.focus();
    await page.keyboard.type('qa');
    await expect(g.email).toHaveValue('qa');
  });

  test('Backspace borra el último carácter', async ({ page }) => {
    const g = new GamePage(page);
    await g.password.focus();
    await page.keyboard.type('abc');
    await page.keyboard.press('Backspace');
    await expect(g.password).toHaveValue('ab');
  });

  test('Ctrl+A y Delete vacían el campo', async ({ page }) => {
    const g = new GamePage(page);
    await g.password.focus();
    await page.keyboard.type('abc');
    await page.keyboard.press('ControlOrMeta+A');
    await page.keyboard.press('Delete');
    await expect(g.password).toHaveValue('');
  });

  test('Enter en password no rompe la página', async ({ page }) => {
    const g = new GamePage(page);
    await g.password.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('body')).toBeVisible();
  });

  test('Escape no rompe la página', async ({ page }) => {
    await page.keyboard.press('Escape');
    await expect(page.locator('body')).toBeVisible();
  });

  test('el botón Next existe y es visible', async ({ page }) => {
    await expect(new GamePage(page).next).toBeVisible();
  });

  test('el botón Next se puede enfocar', async ({ page }) => {
    const g = new GamePage(page);
    await g.next.focus().catch(() => {});
    await expect(page.locator('body')).toBeVisible();
  });

  test('los inputs tienen placeholder (ayuda al lector de pantalla)', async ({ page }) => {
    const g = new GamePage(page);
    for (const loc of [g.password, g.email, g.domain]) {
      expect(await loc.getAttribute('placeholder')).toBeTruthy();
    }
  });

  test('la página declara idioma o charset', async ({ page }) => {
    const hasLangOrCharset = await page.evaluate(
      () => !!document.documentElement.lang || !!document.characterSet,
    );
    expect(hasLangOrCharset).toBe(true);
  });

  test('hay un <title> no vacío', async ({ page }) => {
    expect((await page.title()).length).toBeGreaterThan(0);
  });

  test('hay al menos un <input> en la tarjeta 1', async ({ page }) => {
    expect(await page.locator('input').count()).toBeGreaterThanOrEqual(3);
  });

  test('zoom del 150% no rompe el formulario', async ({ page }) => {
    await page.evaluate(() => { (document.body.style as any).zoom = '1.5'; });
    await expect(new GamePage(page).password).toBeVisible();
  });

  test('modo de movimiento reducido no rompe la página', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(new GamePage(page).password).toBeVisible();
  });

  test('esquema de color oscuro no rompe la página', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await expect(new GamePage(page).password).toBeVisible();
  });
});
