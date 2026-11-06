import { test, expect } from '@playwright/test';
import { USER_AGENTS } from '../src/data/testData';

test.describe('Red · peticiones HTTP', () => {
  test('GET / devuelve 200', async ({ request }) => {
    expect((await request.get('/')).status()).toBe(200);
  });

  test('GET / devuelve HTML', async ({ request }) => {
    const r = await request.get('/');
    expect(r.headers()['content-type']).toContain('text/html');
  });

  test('GET / devuelve cuerpo no vacío', async ({ request }) => {
    expect((await (await request.get('/')).text()).length).toBeGreaterThan(100);
  });

  test('HEAD / responde con éxito', async ({ request }) => {
    expect((await request.head('/')).status()).toBeLessThan(400);
  });

  test('la respuesta incluye content-type', async ({ request }) => {
    expect((await request.get('/')).headers()['content-type']).toBeTruthy();
  });

  test('una ruta inexistente no devuelve 5xx', async ({ request }) => {
    expect((await request.get('/ruta-que-no-existe-xyz')).status()).toBeLessThan(500);
  });

  test('la ruta con query string responde < 500', async ({ request }) => {
    expect((await request.get('/?a=1&b=2')).status()).toBeLessThan(500);
  });

  test('la ruta con fragmento responde 200', async ({ request }) => {
    expect((await request.get('/#test')).status()).toBe(200);
  });

  test('la carga inicial no genera respuestas 5xx', async ({ page }) => {
    const bad: string[] = [];
    page.on('response', (r) => { if (r.status() >= 500) bad.push(`${r.status()} ${r.url()}`); });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(bad).toEqual([]);
  });

  test('la carga inicial no tiene peticiones fallidas del documento', async ({ page }) => {
    const failed: string[] = [];
    page.on('requestfailed', (r) => { if (r.resourceType() === 'document') failed.push(r.url()); });
    await page.goto('/');
    expect(failed).toEqual([]);
  });

  USER_AGENTS.forEach((ua, i) => {
    test.describe(`User-Agent #${i + 1}`, () => {
      test.use({ extraHTTPHeaders: { 'User-Agent': ua } });

      test('GET / responde < 400', async ({ request }) => {
        expect((await request.get('/')).status()).toBeLessThan(400);
      });

      test('la página carga con ese UA', async ({ page }) => {
        const r = await page.goto('/');
        expect(r?.status()).toBeLessThan(400);
      });
    });
  });
});
