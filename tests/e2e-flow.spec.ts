import { test, expect } from '@playwright/test';
import { GamePage } from '../src/pages/GamePage';
import { PNG_1x1 } from '../src/pages/GamePage';

const users = [
  { email: 'ana', domain: 'gmail' }, { email: 'luis', domain: 'yahoo' }, { email: 'maria', domain: 'outlook' },
  { email: 'john.doe', domain: 'proton' }, { email: 'qa_tester', domain: 'icloud' }, { email: 'dev1', domain: 'mail' },
  { email: 'user2024', domain: 'example' }, { email: 'zed', domain: 'zeta' }, { email: 'bob', domain: 'bobsite' },
  { email: 'eve', domain: 'evil' }, { email: 'carol', domain: 'corp' }, { email: 'dan', domain: 'dandomain' },
  { email: 'erin', domain: 'erinmail' }, { email: 'frank', domain: 'frankly' }, { email: 'grace', domain: 'gracenet' },
  { email: 'heidi', domain: 'heidi' }, { email: 'ivan', domain: 'ivanov' }, { email: 'judy', domain: 'judymail' },
];

test.describe('Flujo E2E · tarjeta 1 → tarjeta 2 → siguiente', () => {
  users.forEach((u, i) => {
    test(`usuario #${i + 1} (${u.email}@${u.domain}) completa tarjeta 1 y 2`, async ({ page }) => {
      const g = new GamePage(page);
      await g.openAndStart();
      await g.clearOverlays();
      await g.fillCard1({ password: `${u.email}Q7ж`, email: u.email, domain: u.domain, terms: true });
      await g.clickNext();
      expect(await g.isOnCard2()).toBe(true);

      await g.clearOverlays();
      await g.selectInterests([1, 2, 3]);
      await g.uploadAvatar().catch(() => {});
      await g.clickNext();
      await page.waitForTimeout(800);
      expect(await g.interests.first().isVisible().catch(() => false)).toBe(false);
    });
  });

  test('el flujo completo es repetible en la misma sesión', async ({ page }) => {
    const g = new GamePage(page);
    for (let k = 0; k < 2; k++) {
      await g.goToCard2();
      expect(await g.isOnCard2()).toBe(true);
    }
  });

  test('el buffer PNG de prueba es válido (cabecera PNG)', async () => {
    expect(PNG_1x1.subarray(1, 4).toString('ascii')).toBe('PNG');
  });
});
