import { Page, expect } from '@playwright/test';
import { exactText, pathPattern } from '../../utils/constants';

export class SidebarComponent {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateToPim(): Promise<void> {
    await this.page
      .locator('.oxd-main-menu-item')
      .filter({ hasText: exactText('PIM') })
      .click();
    await expect(this.page, 'PIM module should open after selecting the PIM menu item').toHaveURL(
      pathPattern('/pim/'),
    );
  }
}