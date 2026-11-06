import { test, expect } from '@playwright/test';
import { GamePage } from '../src/pages/GamePage';
import { VIEWPORTS } from '../src/data/testData';

test.describe('Home · pantalla de bienvenida', () => {
  test('responde con HTTP 200', async ({ page }) => {
    const r = await page.goto('/');
    expect(r?.status()).toBe(200);
  });

  test('el título contiene "inyerface"', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/inyerface/i);
  });

  test('se sirve por HTTPS', async ({ page }) => {
    await page.goto('/');
    expect(page.url()).toMatch(/^https:\/\//);
  });

  test('el dominio es userinyerface.com', async ({ page }) => {
    await page.goto('/');
    expect(new URL(page.url()).hostname).toContain('userinyerface.com');
  });

  test('el enlace de inicio es visible', async ({ page }) => {
    const g = new GamePage(page);
    await g.open();
    await expect(g.startLink).toBeVisible();
  });

  test('el enlace de inicio dice "HERE"', async ({ page }) => {
    const g = new GamePage(page);
    await g.open();
    await expect(g.startLink).toHaveText(/here/i);
  });

  test('el enlace de inicio está habilitado', async ({ page }) => {
    const g = new GamePage(page);
    await g.open();
    await expect(g.startLink).toBeEnabled();
  });

  test('el cuerpo de la página tiene texto', async ({ page }) => {
    await page.goto('/');
    const text = await page.locator('body').innerText();
    expect(text.trim().length).toBeGreaterThan(10);
  });

  test('el texto de bienvenida está presente', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).toContainText(/welcome|inyerface/i);
  });

  test('document.readyState llega a complete', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('load');
    expect(await page.evaluate(() => document.readyState)).toBe('complete');
  });

  test('no hay errores JS no capturados al cargar', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto('/');
    await page.waitForTimeout(1000);
    expect(errors).toEqual([]);
  });

  test('la página tiene al menos un enlace', async ({ page }) => {
    await page.goto('/');
    expect(await page.locator('a').count()).toBeGreaterThan(0);
  });

  test('hacer clic en HERE muestra el formulario', async ({ page }) => {
    const g = new GamePage(page);
    await g.open();
    await g.start();
    await expect(g.password).toBeVisible();
  });

  test('tras iniciar cambia el contenido de la página', async ({ page }) => {
    const g = new GamePage(page);
    await g.open();
    const before = await page.locator('body').innerText();
    await g.start();
    const after = await page.locator('body').innerText();
    expect(after).not.toBe(before);
  });

  test('iniciar con teclado (focus + Enter) funciona', async ({ page }) => {
    const g = new GamePage(page);
    await g.open();
    await g.startLink.focus();
    await page.keyboard.press('Enter');
    await expect(g.password).toBeVisible();
  });

  test('recargar la bienvenida mantiene el enlace de inicio', async ({ page }) => {
    const g = new GamePage(page);
    await g.open();
    await page.reload();
    await expect(g.startLink).toBeVisible();
  });

  test('se puede hacer scroll sin romper la página', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.locator('body')).toBeVisible();
  });

  test('volver atrás después de iniciar no rompe el sitio', async ({ page }) => {
    const g = new GamePage(page);
    await g.open();
    await g.start();
    await page.goBack().catch(() => {});
    await expect(page.locator('body')).toBeVisible();
  });

  test('navegar a la raíz dos veces es estable', async ({ page }) => {
    await page.goto('/');
    const r = await page.goto('/');
    expect(r?.status()).toBeLessThan(400);
  });

  test('doble clic en HERE no rompe el flujo', async ({ page }) => {
    const g = new GamePage(page);
    await g.open();
    await g.startLink.dblclick();
    await expect(page.locator('body')).toBeVisible();
  });

  for (const vp of VIEWPORTS) {
    test.describe(`viewport ${vp.name} (${vp.width}x${vp.height})`, () => {
      test.use({ viewport: { width: vp.width, height: vp.height } });

      test('HERE es visible', async ({ page }) => {
        const g = new GamePage(page);
        await g.open();
        await expect(g.startLink).toBeVisible();
      });

      test('HERE inicia el formulario', async ({ page }) => {
        const g = new GamePage(page);
        await g.open();
        await g.start();
        await expect(g.password).toBeVisible();
      });
    });
  }
});
