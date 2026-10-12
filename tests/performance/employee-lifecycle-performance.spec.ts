import { test, expect } from '../../src/fixtures/test.fixtures';
import { loadEmployees } from '../../src/data/data.loader';
import { generateEmployeeId } from '../../src/data/employee.factory';
import { envConfig } from '../../src/utils/env.config';
import { MESSAGES, ROUTES, pathPattern } from '../../src/utils/constants';

const employees = loadEmployees();

test('Performance: full OrangeHRM employee lifecycle', async (
  {
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
  },
  testInfo,
) => {
  const employee = employees[0];
  const employeeId = generateEmployeeId(employee.employeeIdPrefix);
  const timingsMs: Record<string, number> = {};
  let empNumber = 0;

  const measure = async (name: string, action: () => Promise<void>): Promise<void> => {
    const start = performance.now();
    await action();
    timingsMs[name] = Math.round(performance.now() - start);
  };

  await measure('login', async () => {
    await loginPage.open();
    await loginPage.login(envConfig.username, envConfig.password);
    await dashboardPage.expectLoaded();
  });

  const initialDocumentNavigation = await page.evaluate(() => {
    const navigation = performance.getEntriesByType(
      'navigation',
    )[0] as PerformanceNavigationTiming | undefined;

    if (!navigation) {
      return null;
    }

    return {
      ttfbMs: Math.round(navigation.responseStart),
      domContentLoadedMs: Math.round(navigation.domContentLoadedEventEnd),
      loadEventMs: Math.round(navigation.loadEventEnd),
    };
  });

  await measure('add_employee', async () => {
    await sidebar.navigateToPim();
    await addEmployeePage.openAddEmployeeTab();

    empNumber = await addEmployeePage.createEmployee({
      firstName: employee.firstName,
      lastName: employee.lastName,
      employeeId,
      profilePicturePath: employee.profilePicture,
    });
  });

  await measure('search_and_edit_employee', async () => {
    await sidebar.navigateToPim();
    await employeeListPage.expectOpened();
    await employeeListPage.searchByEmployeeId(employeeId);
    await employeeListPage.expectEmployeeInResults(employeeId);
    await employeeListPage.openEmployee(employeeId);

    await jobDetailsPage.openFromPersonalDetails(empNumber);
    await jobDetailsPage.updateJobDetails(employee.jobDetails);
    await toast.expectMessage(MESSAGES.successUpdated);
    await jobDetailsPage.expectJobDetails(employee.jobDetails);
  });

  await measure('api_and_ui_validation', async () => {
    const search = await orangeHrmApi.searchEmployeesById(employeeId);
    expect(search.status, 'Employee search API should return HTTP 200').toBe(200);

    const match = search.body?.data.find((item) => item.employeeId === employeeId);
    expect(match, 'API search should find the newly created employee').toBeDefined();
    expect(match?.empNumber, 'API employee number should match the UI').toBe(empNumber);

    const personal = await orangeHrmApi.getPersonalDetails(empNumber);
    expect(personal.status, 'Personal details API should return HTTP 200').toBe(200);
    expect(personal.body?.data?.firstName, 'API first name should match test data').toBe(
      employee.firstName,
    );
    expect(personal.body?.data?.lastName, 'API last name should match test data').toBe(
      employee.lastName,
    );
    expect(personal.body?.data?.employeeId, 'API employee ID should match the UI').toBe(employeeId);

    const job = await orangeHrmApi.getJobDetails(empNumber);
    expect(job.status, 'Job details API should return HTTP 200').toBe(200);
    expect(job.body?.data?.jobTitle?.title, 'API job title should match the UI').toBe(
      employee.jobDetails.jobTitle,
    );
    expect(job.body?.data?.empStatus?.name, 'API employment status should match the UI').toBe(
      employee.jobDetails.employmentStatus,
    );
  });

  await measure('delete_employee', async () => {
    await sidebar.navigateToPim();
    await employeeListPage.searchByEmployeeId(employeeId);
    await employeeListPage.expectEmployeeInResults(employeeId);
    await employeeListPage.deleteEmployee(employeeId);
    await toast.expectMessage(MESSAGES.successDeleted);

    await employeeListPage.searchByEmployeeId(employeeId);
    await employeeListPage.expectNoRecords();

    const search = await orangeHrmApi.searchEmployeesById(employeeId);
    expect(search.status, 'Employee search API should return HTTP 200 after deletion').toBe(200);
    expect(search.body?.data ?? [], 'Deleted employee should not appear in API search').toHaveLength(
      0,
    );

    const personal = await orangeHrmApi.getPersonalDetails(empNumber);
    expect(
      personal.ok && personal.body?.data != null,
      'Deleted employee should not be retrievable from the API',
    ).toBe(false);
  });

  await measure('logout_and_session_check', async () => {
    await topbar.logout();
    await loginPage.expectOpened();

    await page.goto(ROUTES.dashboard);
    await expect(page, 'Protected dashboard should redirect after logout').toHaveURL(
      pathPattern(ROUTES.login),
    );

    const apiAfterLogout = await orangeHrmApi.searchEmployeesById(employeeId);
    expect(
      apiAfterLogout.ok && Array.isArray(apiAfterLogout.body?.data),
      'API should not return protected employee data after logout',
    ).toBe(false);
  });

  const summary = {
    test: 'OrangeHRM employee lifecycle',
    generatedAt: new Date().toISOString(),
    timingsMs,
    initialDocumentNavigation,
  };

  console.log(`Performance summary:\n${JSON.stringify(summary, null, 2)}`);
  await testInfo.attach('performance-summary.json', {
    body: JSON.stringify(summary, null, 2),
    contentType: 'application/json',
  });
});
