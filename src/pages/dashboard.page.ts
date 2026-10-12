import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { ROUTES, exactText, pathPattern } from '../utils/constants';

export class DashboardPage extends BasePage {
  private readonly header: Locator;

  constructor(page: Page) {
    super(page);
    this.header = page
      .locator('.oxd-topbar-header-breadcrumb h6')
      .filter({ hasText: exactText('Dashboard') });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page, 'User should be redirected to the dashboard after login').toHaveURL(
      pathPattern(ROUTES.dashboard),
    );
    await expect(this.header, 'Dashboard header should be visible after a successful login').toBeVisible();
  }
}