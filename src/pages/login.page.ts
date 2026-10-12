import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { ROUTES, pathPattern } from '../utils/constants';

export class LoginPage extends BasePage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.submitButton = page.locator('button[type="submit"]');
  }

  async open(): Promise<void> {
    await this.page.goto(ROUTES.login);
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async expectOpened(): Promise<void> {
    await expect(this.page, 'Login page URL should be displayed').toHaveURL(
      pathPattern(ROUTES.login),
    );
    await expect(this.submitButton, 'Login button should be visible on the login page').toBeVisible();
  }
}