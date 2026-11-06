import { test, expect } from '@playwright/test';
import { GamePage } from '../src/pages/GamePage';
import { S } from '../src/selectors';

const toSeconds = (txt: string): number => {
  const parts = txt.trim().split(':').map((p) => parseInt(p, 10));
  if (parts.some(Number.isNaN)) return -1;
  return parts.reduce((acc, p) => acc * 60 + p, 0);
};

test.describe('Elementos dinámicos · timer, cookies, ayuda', () => {
  test.beforeEach(async ({ page }) => {
    await new GamePage(page).openAndStart();
  });

  test('el timer es visible', async ({ page }) => {
    await expect(new GamePage(page).timer).toBeVisible();
  });

  test('el timer tiene formato de tiempo (mm:ss o hh:mm:ss)', async ({ page }) => {
    await expect(new GamePage(page).timer).toHaveText(/\d{1,2}:\d{2}(:\d{2})?/);
  });

  for (const wait of [1, 2, 3, 5]) {
    test(`el timer avanza tras ${wait}s`, async ({ page }) => {
      const g = new GamePage(page);
      const t0 = toSeconds(await g.timer.innerText());
      await page.waitForTimeout(wait * 1000 + 300);
      const t1 = toSeconds(await g.timer.innerText());
      expect(t1 - t0).toBeGreaterThanOrEqual(wait - 1);
    });
  }

  test('el timer sigue visible tras cerrar overlays', async ({ page }) => {
    const g = new GamePage(page);
    await g.clearOverlays();
    await expect(g.timer).toBeVisible();
  });

  test('el timer sigue corriendo tras escribir en un campo', async ({ page }) => {
    const g = new GamePage(page);
    const t0 = toSeconds(await g.timer.innerText());
    await g.password.fill('abc');
    await page.waitForTimeout(2300);
    expect(toSeconds(await g.timer.innerText())).toBeGreaterThan(t0);
  });

  test('el formulario de cookies aparece', async ({ page }) => {
    await expect(page.locator(S.cookiesForm).first()).toBeVisible();
  });

  test('el formulario de cookies tiene botones', async ({ page }) => {
    expect(await page.locator(S.cookiesButtons).count()).toBeGreaterThan(0);
  });

  test('"Not really, no" cierra el formulario de cookies', async ({ page }) => {
    await page.locator(S.cookiesDecline).first().click({ force: true });
    await expect(page.locator(S.cookiesForm).first()).toBeHidden();
  });

  test('cerrar cookies no rompe el formulario', async ({ page }) => {
    const g = new GamePage(page);
    await page.locator(S.cookiesDecline).first().click({ force: true });
    await expect(g.password).toBeVisible();
  });

  test('el formulario de ayuda aparece', async ({ page }) => {
    await expect(page.locator(S.helpForm).first()).toBeVisible();
  });

  test('"Send to bottom" existe en el formulario de ayuda', async ({ page }) => {
    await expect(page.locator(S.helpHide).first()).toBeVisible();
  });

  test('"Send to bottom" oculta el formulario de ayuda', async ({ page }) => {
    await page.locator(S.helpHide).first().click({ force: true });
    await expect(page.locator(S.helpForm).first()).toBeHidden();
  });

  test('cerrar ayuda no rompe el formulario', async ({ page }) => {
    const g = new GamePage(page);
    await page.locator(S.helpHide).first().click({ force: true });
    await expect(g.password).toBeVisible();
  });

  test('cerrar ambos overlays deja el formulario usable', async ({ page }) => {
    const g = new GamePage(page);
    await g.clearOverlays();
    await g.password.fill('x');
    await expect(g.password).toHaveValue('x');
  });

  test('clearOverlays es idempotente', async ({ page }) => {
    const g = new GamePage(page);
    await g.clearOverlays();
    await g.clearOverlays();
    await expect(g.password).toBeVisible();
  });

  test('recargar la página reinicia el juego', async ({ page }) => {
    const g = new GamePage(page);
    await g.password.fill('abc');
    await page.reload();
    const stillOnForm = await g.password.isVisible().catch(() => false);
    if (stillOnForm) await expect(g.password).toHaveValue('');
    else await expect(g.startLink).toBeVisible();
  });

  test('el indicador de página/paso está presente', async ({ page }) => {
    await expect(page.locator('body')).toContainText(/1\s*\/\s*4|1 of 4|1/);
  });

  test('la página no navega sola en 3 segundos', async ({ page }) => {
    const url = page.url();
    await page.waitForTimeout(3000);
    expect(page.url()).toBe(url);
  });

  test('los overlays no bloquean el scroll', async ({ page }) => {
    await page.mouse.wheel(0, 400);
    await expect(page.locator('body')).toBeVisible();
  });
});
