import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from '../base.page';
import { LABELS, ROUTES, pathPattern } from '../../utils/constants';

export class EmployeeListPage extends BasePage {
  private readonly searchButton: Locator;

  constructor(page: Page) {
    super(page);
    this.searchButton = page.getByRole('button', { name: 'Search', exact: true });
  }

  async expectOpened(): Promise<void> {
    await expect(this.page, 'Employee List page should be displayed').toHaveURL(
      pathPattern(ROUTES.employeeList),
    );
  }

  async searchByEmployeeId(employeeId: string): Promise<void> {
    await this.inputByLabel(LABELS.employeeId).fill(employeeId);
    await this.searchButton.click();
    await this.waitForSpinnerToHide();
  }

  async expectEmployeeInResults(employeeId: string): Promise<void> {
    await expect(
      this.resultRow(employeeId),
      `Search results should contain employee with ID ${employeeId}`,
    ).toBeVisible();
  }

  async openEmployee(employeeId: string): Promise<void> {
    // The second cell holds the first name, and clicking the row opens the employee record.
    await this.resultRow(employeeId).locator('.oxd-table-cell').nth(1).click();
  }

  async deleteEmployee(employeeId: string): Promise<void> {
    const row = this.resultRow(employeeId);
    const checkbox = row.locator('.oxd-checkbox-input').first();

    await checkbox.click();

    const deleteButton = this.page.locator('button:has-text("Delete Selected")');
    await expect(deleteButton, `Delete Selected should be available after selecting employee ${employeeId}`).toBeVisible();
    await deleteButton.click();

    const confirmDeleteButton = this.page.locator('button:has-text("Yes, Delete")');
    await expect(confirmDeleteButton, 'Confirmation modal should show the delete confirmation').toBeVisible();
    await confirmDeleteButton.click();
  }

  async expectNoRecords(): Promise<void> {
    await expect(
      this.page.locator('.oxd-table-body .oxd-table-row'),
      'Employee list should be empty after deletion',
    ).toHaveCount(0);
  }

  private resultRow(employeeId: string): Locator {
    return this.page
      .locator('.oxd-table-body .oxd-table-row')
      .filter({ hasText: employeeId });
  }
}