import { Locator, Page } from '@playwright/test';
import { exactText } from '../../utils/constants';

export class TopbarComponent {
  private readonly userMenuTrigger: Locator;
  private readonly logoutOption: Locator;

  constructor(page: Page) {
    this.userMenuTrigger = page.locator('.oxd-userdropdown-tab');
    this.logoutOption = page
      .locator('.oxd-userdropdown-link')
      .filter({ hasText: exactText('Logout') });
  }

  async logout(): Promise<void> {
    await this.userMenuTrigger.click();
    await this.logoutOption.click();
  }
}