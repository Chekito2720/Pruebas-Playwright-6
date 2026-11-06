import { test, expect } from '@playwright/test';
import { GamePage } from '../src/pages/GamePage';

const fields = ['password', 'email', 'domain'] as const;
const delays = [0, 20, 60];

test.describe('Comportamiento de escritura', () => {
  test.beforeEach(async ({ page }) => {
    const g = new GamePage(page);
    await g.openAndStart();
    await g.clearOverlays();
  });

  for (const f of fields) {
    for (const d of delays) {
      test(`${f}: escritura tecla a tecla con delay ${d}ms`, async ({ page }) => {
        const g = new GamePage(page);
        const loc = g[f];
        await loc.click({ force: true });
        await loc.pressSequentially('Abc123', { delay: d });
        await expect(loc).toHaveValue('Abc123');
      });
    }
  }

  for (const f of fields) {
    test(`${f}: conserva el valor al perder el foco`, async ({ page }) => {
      const g = new GamePage(page);
      await g[f].fill('valor');
      await g[f].blur();
      await expect(g[f]).toHaveValue('valor');
    });
  }
});
