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
    await this.resultRow(employeeId).locator('.oxd-checkbox-input').click();
    await this.page.getByRole('button', { name: 'Delete Selected', exact: true }).click();
    await this.page.getByRole('button', { name: 'Yes, Delete', exact: true }).click();
  }

  async expectNoRecords(): Promise<void> {
    await expect(
      this.page.getByText('No Records Found', { exact: true }),
      'Employee list should show "No Records Found" after deletion',
    ).toBeVisible();
  }

  private resultRow(employeeId: string): Locator {
    return this.page
      .locator('.oxd-table-body .oxd-table-row')
      .filter({ hasText: employeeId });
  }
}