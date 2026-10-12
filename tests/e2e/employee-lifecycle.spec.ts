import { test, expect } from '../../src/fixtures/test.fixtures';
import { loadEmployees } from '../../src/data/data.loader';
import { generateEmployeeId } from '../../src/data/employee.factory';
import { envConfig } from '../../src/utils/env.config';
import { MESSAGES, ROUTES, pathPattern } from '../../src/utils/constants';
import { logger } from '../../src/utils/logger';

const employees = loadEmployees();

for (const employee of employees) {
  test(`Employee lifecycle: ${employee.firstName} ${employee.lastName}`, async ({
    page,
    loginPage,
    dashboardPage,
    sidebar,
    topbar,
    toast,
    addEmployeePage,
    employeeListPage,
    jobDetailsPage,
    orangeHrmApi,
  }) => {
    const employeeId = generateEmployeeId(employee.employeeIdPrefix);
    let empNumber = 0;

    await test.step('1. Login with valid credentials and verify the dashboard', async () => {
      await loginPage.open();
      await loginPage.login(envConfig.username, envConfig.password);
      await dashboardPage.expectLoaded();
    });

    await test.step('2. Add a new employee from data with a profile picture', async () => {
      await sidebar.navigateToPim();
      await addEmployeePage.openAddEmployeeTab();

      empNumber = await addEmployeePage.createEmployee({
        firstName: employee.firstName,
        lastName: employee.lastName,
        employeeId,
        profilePicturePath: employee.profilePicture,
      });

      // OrangeHRM redirects to the employee personal details page after a successful save.
      // The redirect is already asserted inside createEmployee(), so the toast is not a reliable success signal here.
      logger.info(`Created employee ${employee.firstName} ${employee.lastName} (ID ${employeeId}, empNumber ${empNumber})`);
    });

    await test.step('3. Search by Employee ID and update Job Title and Employment Status', async () => {
      await sidebar.navigateToPim();
      await employeeListPage.expectOpened();
      await employeeListPage.searchByEmployeeId(employeeId);
      await employeeListPage.expectEmployeeInResults(employeeId);
      await employeeListPage.openEmployee(employeeId);

      await expect(
        page,
        'Opening the employee should show the personal details page',
      ).toHaveURL(pathPattern(ROUTES.personalDetails(empNumber)));

      await jobDetailsPage.openFromPersonalDetails(empNumber);
      await jobDetailsPage.updateJobDetails(employee.jobDetails);
      await toast.expectMessage(MESSAGES.successUpdated);
      await jobDetailsPage.expectJobDetails(employee.jobDetails);
    });

    await test.step('4. Validate employee data via the OrangeHRM API and cross-check with the UI', async () => {
      const search = await orangeHrmApi.searchEmployeesById(employeeId);
      expect(search.status, 'Employee search API should return HTTP 200').toBe(200);

      const match = search.body?.data.find((item) => item.employeeId === employeeId);
      expect(match, `API search should return employee with ID ${employeeId}`).toBeDefined();
      expect(match?.empNumber, 'API empNumber should match the UI-created employee').toBe(empNumber);

      const personal = await orangeHrmApi.getPersonalDetails(empNumber);
      expect(personal.status, 'Personal details API should return HTTP 200').toBe(200);
      expect(personal.body?.data?.firstName, 'API first name should match test data').toBe(employee.firstName);
      expect(personal.body?.data?.lastName, 'API last name should match test data').toBe(employee.lastName);
      expect(personal.body?.data?.employeeId, 'API Employee ID should match generated ID').toBe(employeeId);

      const job = await orangeHrmApi.getJobDetails(empNumber);
      expect(job.status, 'Job details API should return HTTP 200').toBe(200);

      const apiJobTitle = job.body?.data?.jobTitle?.title ?? '';
      const apiEmploymentStatus = job.body?.data?.empStatus?.name ?? '';
      const uiJob = await jobDetailsPage.getJobDetails();

      expect(apiJobTitle, 'API Job Title should match the UI Job Title').toBe(uiJob.jobTitle);
      expect(apiEmploymentStatus, 'API Employment Status should match the UI Employment Status').toBe(
        uiJob.employmentStatus,
      );
      expect(apiJobTitle, 'API Job Title should match the updated test data').toBe(
        employee.jobDetails.jobTitle,
      );
      expect(apiEmploymentStatus, 'API Employment Status should match the updated test data').toBe(
        employee.jobDetails.employmentStatus,
      );
    });

    await test.step('5. Delete the employee via the UI and verify via UI and API', async () => {
      await sidebar.navigateToPim();
      await employeeListPage.searchByEmployeeId(employeeId);
      await employeeListPage.expectEmployeeInResults(employeeId);
      await employeeListPage.deleteEmployee(employeeId);
      await toast.expectMessage(MESSAGES.successDeleted);

      await employeeListPage.searchByEmployeeId(employeeId);
      await employeeListPage.expectNoRecords();

      const search = await orangeHrmApi.searchEmployeesById(employeeId);
      expect(search.status, 'Employee search API should return HTTP 200 after deletion').toBe(200);
      expect(
        search.body?.data ?? [],
        'API search should not return the deleted employee',
      ).toHaveLength(0);

      const personal = await orangeHrmApi.getPersonalDetails(empNumber);
      expect(
        personal.ok && personal.body?.data != null,
        'Deleted employee personal details should no longer be retrievable',
      ).toBe(false);
    });

    await test.step('6. Logout and verify the session is invalidated', async () => {
      await topbar.logout();
      await loginPage.expectOpened();

      await page.goto(ROUTES.dashboard);
      await expect(
        page,
        'Accessing a protected page after logout should redirect to the login page',
      ).toHaveURL(pathPattern(ROUTES.login));

      const apiAfterLogout = await orangeHrmApi.searchEmployeesById(employeeId);
      const leakedData = apiAfterLogout.body?.data;
      expect(
        apiAfterLogout.ok && Array.isArray(leakedData),
        'API should not return protected employee data after logout',
      ).toBe(false);
    });
  });
}