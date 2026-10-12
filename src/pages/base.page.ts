import { Locator, Page, expect } from '@playwright/test';
import { LABELS, TIMEOUTS, exactText } from '../utils/constants';
import { JobDetailsInput } from '../types/employee.types';

/** Shared OrangeHRM UI helpers for all page objects. Contains no test assertions beyond waits. */
export abstract class BasePage {
  protected readonly page: Page;

  protected constructor(page: Page) {
    this.page = page;
  }

  protected async clickTab(label: string): Promise<void> {
    await this.page
      .locator('.oxd-topbar-body-nav-tab-item')
      .filter({ hasText: exactText(label) })
      .click();
  }

  protected async waitForSpinnerToHide(): Promise<void> {
    await expect(
      this.page.locator('.oxd-loading-spinner'),
      'Loading spinner should disappear before continuing',
    ).toBeHidden({ timeout: TIMEOUTS.navigation });
  }

  protected inputByLabel(label: string): Locator {
    return this.fieldGroup(label).locator('input').first();
  }

  protected dropdownByLabel(label: string): Locator {
    return this.fieldGroup(label).locator('.oxd-select-text');
  }

  protected async readDropdownValue(label: string): Promise<string> {
    const text = await this.dropdownByLabel(label).locator('.oxd-select-text-input').textContent();
    return (text ?? '').trim();
  }

  protected async selectDropdownOption(label: string, option: string): Promise<void> {
    await this.dropdownByLabel(label).click();
    await this.page
      .locator('.oxd-select-dropdown .oxd-select-option')
      .filter({ hasText: exactText(option) })
      .first()
      .click();
  }

  /** Returns the form that contains the Job Details fields, to scope the Save button. */
  protected jobDetailsForm(): Locator {
    return this.page
      .locator('form')
      .filter({ has: this.page.locator('label', { hasText: LABELS.jobTitle }) })
      .first();
  }

  protected fieldGroup(label: string): Locator {
    return this.page
      .locator('.oxd-input-group')
      .filter({ has: this.page.locator('label', { hasText: label }) })
      .first();
  }
}

export type { JobDetailsInput };