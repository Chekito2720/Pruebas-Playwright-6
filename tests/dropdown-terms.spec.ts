import { test, expect } from '@playwright/test';
import { GamePage, VALID_CARD1 } from '../src/pages/GamePage';

test.describe('Dropdown de extensión y términos', () => {
  test.beforeEach(async ({ page }) => {
    const g = new GamePage(page);
    await g.openAndStart();
    await g.clearOverlays();
  });

  test('el desplegable se abre al hacer clic', async ({ page }) => {
    const g = new GamePage(page);
    await g.dropdownOpener.click({ force: true });
    await expect(g.dropdownItems.first()).toBeVisible();
  });

  test('el desplegable tiene al menos 2 opciones', async ({ page }) => {
    const g = new GamePage(page);
    await g.dropdownOpener.click({ force: true });
    expect(await g.dropdownItems.count()).toBeGreaterThanOrEqual(2);
  });

  test('las opciones del desplegable no están vacías', async ({ page }) => {
    const g = new GamePage(page);
    await g.dropdownOpener.click({ force: true });
    const texts = (await g.dropdownItems.allTextContents()).map((t) => t.trim());
    expect(texts.every((t) => t.length > 0)).toBe(true);
  });

  test('las opciones del desplegable son únicas', async ({ page }) => {
    const g = new GamePage(page);
    await g.dropdownOpener.click({ force: true });
    const texts = (await g.dropdownItems.allTextContents()).map((t) => t.trim());
    expect(new Set(texts).size).toBe(texts.length);
  });

  test('las extensiones empiezan por punto (excepto "other")', async ({ page }) => {
    const g = new GamePage(page);
    await g.dropdownOpener.click({ force: true });
    const texts = (await g.dropdownItems.allTextContents()).map((t) => t.trim()).filter((t) => !/other/i.test(t));
    expect(texts.every((t) => t.startsWith('.'))).toBe(true);
  });

  for (let idx = 0; idx < 10; idx++) {
    test(`seleccionar la opción #${idx} del desplegable`, async ({ page }) => {
      const g = new GamePage(page);
      await g.dropdownOpener.click({ force: true });
      const count = await g.dropdownItems.count();
      test.skip(idx >= count, `solo hay ${count} opciones`);
      const label = (await g.dropdownItems.nth(idx).innerText()).trim();
      await g.dropdownItems.nth(idx).click({ force: true });
      await expect(page.locator('body')).toContainText(label);
    });
  }

  test('el checkbox de términos es visible', async ({ page }) => {
    await expect(new GamePage(page).termsBox).toBeVisible();
  });

  test('el texto de términos y condiciones existe', async ({ page }) => {
    await expect(page.locator('body')).toContainText(/terms and conditions/i);
  });

  test('marcar y desmarcar términos no rompe la página', async ({ page }) => {
    const g = new GamePage(page);
    await g.termsBox.click({ force: true });
    await g.termsBox.click({ force: true });
    await expect(g.termsBox).toBeVisible();
  });

  test('sin aceptar términos no avanza', async ({ page }) => {
    const g = new GamePage(page);
    await g.fillCard1({ ...VALID_CARD1, terms: false });
    await g.clickNext();
    expect(await g.isOnCard2()).toBe(false);
  });

  test('aceptando términos con datos válidos avanza', async ({ page }) => {
    const g = new GamePage(page);
    await g.fillCard1(VALID_CARD1);
    await g.clickNext();
    expect(await g.isOnCard2()).toBe(true);
  });

  test('marcar términos dos veces (queda desmarcado) no avanza', async ({ page }) => {
    const g = new GamePage(page);
    await g.fillCard1(VALID_CARD1);
    await g.termsBox.click({ force: true });
    await g.clickNext();
    expect(await g.isOnCard2()).toBe(false);
  });
});

/** Matriz: cada combinación de (password, email, dominio, términos) donde falta algo no debe avanzar. */
test.describe('Matriz de campos obligatorios', () => {
  for (let mask = 0; mask < 15; mask++) {
    const has = { password: !!(mask & 1), email: !!(mask & 2), domain: !!(mask & 4), terms: !!(mask & 8) };
    const label = Object.entries(has).map(([k, v]) => `${k}:${v ? 'sí' : 'no'}`).join(' ');
    test(`card1 incompleta [${label}] no avanza`, async ({ page }) => {
      const g = new GamePage(page);
      await g.openAndStart();
      await g.clearOverlays();
      await g.fillCard1({
        password: has.password ? VALID_CARD1.password : '',
        email: has.email ? VALID_CARD1.email : '',
        domain: has.domain ? 'example' : '',
        terms: has.terms,
      });
      await g.clickNext();
      expect(await g.isOnCard2()).toBe(false);
    });
  }
});
