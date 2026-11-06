import { Page, Locator } from '@playwright/test';
import { S } from '../selectors';

export interface Card1Data {
  password: string;
  email: string;
  domain?: string;
  terms?: boolean;
}

export const PNG_1x1 = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
);

/** Datos válidos según las reglas conocidas del juego (ver src/data/testData.ts). */
export const VALID_CARD1: Card1Data = { password: 'qauserQ7жxyz', email: 'qauser', domain: 'example', terms: true };

export class GamePage {
  constructor(readonly page: Page) {}

  get startLink(): Locator { return this.page.locator(S.startLink).first(); }
  get password(): Locator { return this.page.locator(S.password); }
  get email(): Locator { return this.page.locator(S.email); }
  get domain(): Locator { return this.page.locator(S.domain); }
  get dropdownOpener(): Locator { return this.page.locator(S.dropdownOpener).first(); }
  get dropdownItems(): Locator { return this.page.locator(S.dropdownItem); }
  get termsBox(): Locator { return this.page.locator(S.termsBox).first(); }
  get interests(): Locator { return this.page.locator(S.interestItem); }
  get uploadButton(): Locator { return this.page.locator(S.uploadButton).first(); }
  get timer(): Locator { return this.page.locator(S.timer).first(); }
  get next(): Locator {
    return this.page.locator(S.next, { hasText: /^\s*Next\s*$/i }).first();
  }

  async open() { await this.page.goto('/'); }

  async start() {
    await this.startLink.click();
    await this.password.waitFor({ state: 'visible' });
  }

  async openAndStart() { await this.open(); await this.start(); }

  /** Cierra los overlays (cookies y ayuda) si están presentes. */
  async clearOverlays() {
    const cookies = this.page.locator(S.cookiesDecline).first();
    if (await cookies.isVisible().catch(() => false)) await cookies.click({ force: true }).catch(() => {});
    const help = this.page.locator(S.helpHide).first();
    if (await help.isVisible().catch(() => false)) await help.click({ force: true }).catch(() => {});
  }

  async chooseDomainExtension(preferredIndex = 0) {
    await this.dropdownOpener.click({ force: true });
    const texts = await this.dropdownItems.allTextContents();
    let idx = texts.findIndex((t, i) => i >= preferredIndex && !/other/i.test(t));
    if (idx < 0) idx = texts.findIndex((t) => !/other/i.test(t));
    await this.dropdownItems.nth(Math.max(idx, 0)).click({ force: true });
  }

  async fillCard1(d: Card1Data) {
    await this.password.fill(d.password);
    await this.email.fill(d.email);
    await this.domain.fill(d.domain ?? 'example');
    await this.chooseDomainExtension(0);
    if (d.terms !== false) await this.termsBox.click({ force: true });
  }

  async clickNext() {
    await this.clearOverlays();
    await this.next.click({ force: true });
  }

  async isOnCard1(): Promise<boolean> {
    return this.password.isVisible().catch(() => false);
  }

  async isOnCard2(): Promise<boolean> {
    await this.page.waitForTimeout(800);
    return (await this.interests.count()) > 0 && (await this.interests.first().isVisible().catch(() => false));
  }

  /** Selecciona intereses concretos por índice. */
  async selectInterests(indices: number[]) {
    for (const i of indices) await this.interests.nth(i).click({ force: true });
  }

  async unselectAll() { await this.page.locator(S.unselectAll).first().click({ force: true }); }

  async uploadAvatar(name = 'avatar.png', mimeType = 'image/png') {
    const [chooser] = await Promise.all([
      this.page.waitForEvent('filechooser'),
      this.uploadButton.click({ force: true }),
    ]);
    await chooser.setFiles({ name, mimeType, buffer: PNG_1x1 });
  }

  /** Avanza de la tarjeta 1 a la 2 con datos válidos. */
  async goToCard2(data: Card1Data = VALID_CARD1) {
    await this.openAndStart();
    await this.clearOverlays();
    await this.fillCard1(data);
    await this.clickNext();
  }
}
