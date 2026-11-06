import { test, expect } from '@playwright/test';
import { GamePage, VALID_CARD1 } from '../src/pages/GamePage';
import { VIEWPORTS } from '../src/data/testData';

for (const vp of VIEWPORTS) {
  test.describe(`Responsive · ${vp.name} (${vp.width}x${vp.height})`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test('los campos de la tarjeta 1 existen', async ({ page }) => {
      const g = new GamePage(page);
      await g.openAndStart();
      await expect(g.password).toBeVisible();
      await expect(g.email).toBeVisible();
      await expect(g.domain).toBeVisible();
    });

    test('se pueden rellenar los campos', async ({ page }) => {
      const g = new GamePage(page);
      await g.openAndStart();
      await g.clearOverlays();
      await g.password.fill('abc');
      await g.email.fill('qa');
      await expect(g.password).toHaveValue('abc');
      await expect(g.email).toHaveValue('qa');
    });

    test('flujo válido llega a la tarjeta 2', async ({ page }) => {
      const g = new GamePage(page);
      await g.goToCard2(VALID_CARD1);
      expect(await g.isOnCard2()).toBe(true);
    });

    test('el timer es visible', async ({ page }) => {
      const g = new GamePage(page);
      await g.openAndStart();
      await expect(g.timer).toBeVisible();
    });
  });
}
