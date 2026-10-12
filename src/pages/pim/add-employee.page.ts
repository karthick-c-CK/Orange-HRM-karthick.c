import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from '../base.page';
import { LABELS, PERSONAL_DETAILS_URL_PATTERN, ROUTES, pathPattern } from '../../utils/constants';
import { NewEmployeeRequest } from '../../types/employee.types';

export class AddEmployeePage extends BasePage {
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly fileInput: Locator;
  private readonly saveButton: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator('input[name="firstName"]');
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.fileInput = page.locator('input[type="file"]');
    this.saveButton = page.getByRole('button', { name: 'Save', exact: true }).first();
  }

  async openAddEmployeeTab(): Promise<void> {
    await this.clickTab('Add Employee');
    await expect(this.page, 'Add Employee page should be displayed').toHaveURL(
      pathPattern(ROUTES.addEmployee),
    );
  }

  /**
   * Creates an employee and returns the empNumber assigned by OrangeHRM.
   * The UI redirects to the personal details page on success, which is used to extract the ID.
   */
  async createEmployee(request: NewEmployeeRequest): Promise<number> {
    await this.firstNameInput.fill(request.firstName);
    await this.lastNameInput.fill(request.lastName);
    await this.inputByLabel(LABELS.employeeId).fill(request.employeeId);

    await this.fileInput.setInputFiles(request.profilePicturePath);
    const selectedFiles = await this.fileInput.evaluate(
      (element: HTMLInputElement) => element.files?.length ?? 0,
    );
    expect(selectedFiles, 'Profile picture should be attached to the file input').toBe(1);

    await this.saveButton.click();

    await expect(
      this.page,
      'Saving the employee should redirect to the personal details page',
    ).toHaveURL(PERSONAL_DETAILS_URL_PATTERN);

    const match = PERSONAL_DETAILS_URL_PATTERN.exec(this.page.url());
    if (!match) {
      throw new Error(`Could not extract empNumber from URL: ${this.page.url()}`);
    }
    return Number(match[1]);
  }
}