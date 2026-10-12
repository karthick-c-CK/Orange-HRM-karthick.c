import { Page, expect } from '@playwright/test';
import { BasePage } from '../base.page';
import { LABELS, pathPattern } from '../../utils/constants';
import { JobDetailsInput } from '../../types/employee.types';

export class JobDetailsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async openFromPersonalDetails(empNumber: number): Promise<void> {
    await this.page.goto(`/web/index.php/pim/viewJobDetails/empNumber/${empNumber}`);
    await expect(this.page, 'Job Details page should be displayed').toHaveURL(
      pathPattern(`/pim/viewJobDetails/empNumber/${empNumber}`),
    );
  }

  async updateJobDetails(details: JobDetailsInput): Promise<void> {
    await this.selectDropdownOption(LABELS.jobTitle, details.jobTitle);
    await this.selectDropdownOption(LABELS.employmentStatus, details.employmentStatus);
    await this.jobDetailsForm().getByRole('button', { name: 'Save', exact: true }).click();
  }

  async getJobDetails(): Promise<JobDetailsInput> {
    return {
      jobTitle: await this.readDropdownValue(LABELS.jobTitle),
      employmentStatus: await this.readDropdownValue(LABELS.employmentStatus),
    };
  }

  async expectJobDetails(expected: JobDetailsInput): Promise<void> {
    const actual = await this.getJobDetails();
    expect(actual.jobTitle, 'UI Job Title should match the updated value').toBe(expected.jobTitle);
    expect(
      actual.employmentStatus,
      'UI Employment Status should match the updated value',
    ).toBe(expected.employmentStatus);
  }
}