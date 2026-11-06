import { test, expect } from '@playwright/test';
import { GamePage, VALID_CARD1 } from '../src/pages/GamePage';
import { EMAIL_PREFIXES, DOMAINS } from '../src/data/testData';

test.describe('Email y dominio', () => {
  test.beforeEach(async ({ page }) => {
    const g = new GamePage(page);
    await g.openAndStart();
    await g.clearOverlays();
  });

  test('el campo email es visible y editable', async ({ page }) => {
    const g = new GamePage(page);
    await expect(g.email).toBeVisible();
    await expect(g.email).toBeEditable();
  });

  test('el placeholder del email es "Your email"', async ({ page }) => {
    await expect(new GamePage(page).email).toHaveAttribute('placeholder', 'Your email');
  });

  test('el campo dominio es visible y editable', async ({ page }) => {
    const g = new GamePage(page);
    await expect(g.domain).toBeVisible();
    await expect(g.domain).toBeEditable();
  });

  test('el placeholder del dominio es "Domain"', async ({ page }) => {
    await expect(new GamePage(page).domain).toHaveAttribute('placeholder', 'Domain');
  });

  test('email vacío no avanza', async ({ page }) => {
    const g = new GamePage(page);
    await g.fillCard1({ ...VALID_CARD1, email: '' });
    await g.clickNext();
    expect(await g.isOnCard2()).toBe(false);
  });

  test('dominio vacío no avanza', async ({ page }) => {
    const g = new GamePage(page);
    await g.fillCard1({ ...VALID_CARD1, domain: '' });
    await g.clickNext();
    expect(await g.isOnCard2()).toBe(false);
  });

  EMAIL_PREFIXES.forEach((v, i) => {
    test(`email retiene valor #${i + 1} (${v.slice(0, 20)})`, async ({ page }) => {
      const g = new GamePage(page);
      await g.email.fill(v);
      await expect(g.email).toHaveValue(v);
    });
  });

  DOMAINS.forEach((v, i) => {
    test(`dominio retiene valor #${i + 1} (${v.slice(0, 20)})`, async ({ page }) => {
      const g = new GamePage(page);
      await g.domain.fill(v);
      await expect(g.domain).toHaveValue(v);
    });
  });
});
