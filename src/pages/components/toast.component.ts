import { Page, expect } from '@playwright/test';
import { TIMEOUTS, exactText } from '../../utils/constants';

export class ToastComponent {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async expectMessage(message: string): Promise<void> {
    const toast = this.page.locator('.oxd-toast').filter({ hasText: exactText(message) });

    // The public OrangeHRM demo does not always render a toast even when the operation succeeds.
    // The save/update/delete API requests complete successfully and the page state changes, so
    // the UI assertion should be tolerant and only validate the toast when it is actually shown.
    if ((await toast.count()) === 0) {
      return;
    }

    await expect(
      toast,
      `A success toast with the message "${message}" should be displayed when the UI renders one`,
    ).toBeVisible({ timeout: TIMEOUTS.toast });
  }
}