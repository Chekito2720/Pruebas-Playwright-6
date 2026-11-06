import { test, expect } from '@playwright/test';
import { GamePage } from '../src/pages/GamePage';
import { INTEREST_TRIPLES, FILE_TYPES } from '../src/data/testData';

test.describe('Tarjeta 2 · intereses', () => {
  test.beforeEach(async ({ page }) => {
    const g = new GamePage(page);
    await g.goToCard2();
    await g.clearOverlays();
  });

  test('la tarjeta 2 muestra una lista de intereses', async ({ page }) => {
    expect(await new GamePage(page).interests.count()).toBeGreaterThan(3);
  });

  test('cada interés tiene texto', async ({ page }) => {
    const texts = (await new GamePage(page).interests.allTextContents()).map((t) => t.trim());
    expect(texts.every((t) => t.length > 0)).toBe(true);
  });

  test('existe la opción "unselect all"', async ({ page }) => {
    await expect(page.locator('body')).toContainText(/unselect all/i);
  });

  test('el botón de subir foto es visible', async ({ page }) => {
    await expect(new GamePage(page).uploadButton).toBeVisible();
  });

  test('con 0 intereses no avanza', async ({ page }) => {
    const g = new GamePage(page);
    await g.clickNext();
    await page.waitForTimeout(500);
    await expect(g.interests.first()).toBeVisible();
  });

  for (let n = 1; n <= 2; n++) {
    test(`con ${n} interés(es) no avanza`, async ({ page }) => {
      const g = new GamePage(page);
      await g.selectInterests(Array.from({ length: n }, (_, i) => i + 1));
      await g.clickNext();
      await page.waitForTimeout(500);
      await expect(g.interests.first()).toBeVisible();
    });
  }

  for (let i = 0; i < 10; i++) {
    test(`se puede seleccionar el interés #${i}`, async ({ page }) => {
      const g = new GamePage(page);
      test.skip(i >= (await g.interests.count()), 'no existe ese interés');
      await g.interests.nth(i).click({ force: true });
      await expect(g.interests.nth(i)).toBeVisible();
    });
  }

  test('"unselect all" no rompe la lista', async ({ page }) => {
    const g = new GamePage(page);
    await g.unselectAll();
    expect(await g.interests.count()).toBeGreaterThan(0);
  });

  test('seleccionar y luego "unselect all" mantiene la tarjeta', async ({ page }) => {
    const g = new GamePage(page);
    await g.selectInterests([1, 2, 3]);
    await g.unselectAll();
    await expect(g.interests.first()).toBeVisible();
  });

  INTEREST_TRIPLES.forEach((triple) => {
    test(`combinación de intereses [${triple.join(',')}] es aceptada`, async ({ page }) => {
      const g = new GamePage(page);
      await g.selectInterests(triple);
      await g.uploadAvatar().catch(() => {});
      await g.clickNext();
      await page.waitForTimeout(800);
      // Debe haber salido de la tarjeta 2 (o al menos no mostrar la lista de intereses)
      const stillThere = await g.interests.first().isVisible().catch(() => false);
      expect(stillThere).toBe(false);
    });
  });
});

test.describe('Tarjeta 2 · subida de avatar', () => {
  test.beforeEach(async ({ page }) => {
    const g = new GamePage(page);
    await g.goToCard2();
    await g.clearOverlays();
  });

  FILE_TYPES.forEach((f) => {
    test(`subir archivo ${f.name.slice(0, 30)} (${f.mime}) no rompe la página`, async ({ page }) => {
      const g = new GamePage(page);
      await g.uploadAvatar(f.name, f.mime);
      await expect(page.locator('body')).toBeVisible();
      await expect(g.interests.first()).toBeVisible();
    });
  });

  test('el diálogo de archivos se abre al pulsar subir', async ({ page }) => {
    const g = new GamePage(page);
    const [chooser] = await Promise.all([page.waitForEvent('filechooser'), g.uploadButton.click({ force: true })]);
    expect(chooser).toBeTruthy();
  });

  test('cancelar el diálogo no rompe la página', async ({ page }) => {
    const g = new GamePage(page);
    const [chooser] = await Promise.all([page.waitForEvent('filechooser'), g.uploadButton.click({ force: true })]);
    await chooser.setFiles([]);
    await expect(g.interests.first()).toBeVisible();
  });
});
